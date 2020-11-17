---

layout:     post
title:      "ELK 部署"
date:       2017-04-25
author:     "Gitai"
categories:
    - ELK
tags:
    - 记录

---

按照官方文档

https://www.elastic.co/start

或者这份相对完整的安装说明

https://www.ibm.com/developerworks/cn/opensource/os-cn-elk-filebeat/index.html

创建 elk 用户和用户组

```
groupadd elk          # 添加用户组
useradd -g elk elk    # 添加用户到指定用户组
passwd elk            # 为指定用户设置密码
```

以下只记录出现的坑

<!--more-->

```
./bin/logstash -f logstash-filter.conf gives me the below error
Could not find any executable java binary. Please install java in your PATH or set JAVA_HOME.
```

```
# export JAVACMD=`which java`
```

> JAVACMD - full path of the Java executable. Use this to invoke a different JVM than JAVA_HOME/bin/java(.exe).

* [Logstash -Could not find any executable java binary](http://stackoverflow.com/questions/31303922/logstash-could-not-find-any-executable-java-binary)

* [Running Apache Ant Command Line](http://ant.apache.org/manual/running.html)

```
Using provided startup.options file: /etc/logstash/startup.options
/usr/share/logstash/vendor/jruby/bin/jruby: line 388: /usr/bin/java: No such file or directory
Unable to install system startup script for Logstash.
```

Java 安装在自定义位置，并且没有在 `bin` 目录建立链接。

```
# ln -s /opt/jdk/jdk1.8.0_131/bin/java /usr/bin/java
```

----

```
# ./elasticsearch
Java HotSpot(TM) 64-Bit Server VM warning: INFO: os::commit_memory(0x0000000085330000, 2060255232, 0) failed; error='Cannot allocate memory' (errno=12)
#
# There is insufficient memory for the Java Runtime Environment to continue.
# Native memory allocation (mmap) failed to map 2060255232 bytes for committing reserved memory.
# An error report file with more information is saved as:
# /usr/share/elasticsearch/bin/hs_err_pid16738.log
```

```
# cat /usr/share/elasticsearch/bin/hs_err_pid16738.log
#
# There is insufficient memory for the Java Runtime Environment to continue.
# Native memory allocation (mmap) failed to map 2060255232 bytes for committing reserved memory.
# Possible reasons:
#   The system is out of physical RAM or swap space
#   In 32 bit mode, the process size limit was hit
# Possible solutions:
#   Reduce memory load on the system
#   Increase physical memory or swap space
#   Check if swap backing store is full
#   Use 64 bit Java on a 64 bit OS
#   Decrease Java heap size (-Xmx/-Xms)
#   Decrease number of Java threads
#   Decrease Java thread stack sizes (-Xss)
#   Set larger code cache with -XX:ReservedCodeCacheSize=
# This output file may be truncated or incomplete.
#
#  Out of Memory Error (os_linux.cpp:2640), pid=16738, tid=0x00007f8f66221700
#
```

```
# vi elasticsearch.in.sh
...
ES_JAVA_OPTS="$ES_JAVA_OPTS -Xms256M -Xmx256M -Xss1M"
...
```

~~实际上这也是错的，`elasticsearch` 的 `jvm` 配置在安装路径下的 `config/jvm.options` 里~~

----

```
# sudo /usr/share/elasticsearch/bin/elasticsearch
2017-04-28 23:35:43,174 main ERROR Could not register mbeans java.security.AccessControlException: access denied ("javax.management.MBeanTrustPermission" "register")
    ...
Exception in thread "main" org.elasticsearch.bootstrap.BootstrapException: java.nio.file.NoSuchFileException: /usr/share/elasticsearch/config
Likely root cause: java.nio.file.NoSuchFileException: /usr/share/elasticsearch/config
    ...
Refer to the log for complete error details.
```

issue（https://github.com/elastic/ansible-elasticsearch/issues/58）

```
# cp -r /etc/elasticsearch /usr/share/elasticsearch/config
```

http://www.jianshu.com/p/1de60cd34a3e

----

```
$ curl 0.0.0.0:9200 | jq
{
  "error": {
    "root_cause": [
      {
        "type": "security_exception",
        "reason": "unable to authenticate user [rdeniro] for REST request [/]",
        "header": {
          "WWW-Authenticate": "Basic realm=\"security\" charset=\"UTF-8\""
        }
      }
    ],
    "type": "security_exception",
    "reason": "unable to authenticate user [rdeniro] for REST request [/]",
    "header": {
      "WWW-Authenticate": "Basic realm=\"security\" charset=\"UTF-8\""
    }
  },
  "status": 401
}
```

`x-pack` 启用了 Base Authorization 授权

https://www.elastic.co/guide/en/x-pack/current/security-troubleshooting.html

```
# bin/x-pack/users useradd gitai -r superuser
```

内建如下几个组[^built-in-roles]

* superuser
* transport_client
* kibana_user
* monitoring_user
* reporting_user
* remote_monitoring_agent
* ingest_admin
* kibana_system
* logstash_system

```
{
  "error": {
    "root_cause": [
      {
        "type": "security_exception",
        "reason": "unable to authenticate user [gitai] for REST request [/]",
        "header": {
          "WWW-Authenticate": "Basic realm=\"security\" charset=\"UTF-8\""
        }
      }
    ],
    "type": "security_exception",
    "reason": "unable to authenticate user [gitai] for REST request [/]",
    "header": {
      "WWW-Authenticate": "Basic realm=\"security\" charset=\"UTF-8\""
    }
  },
  "status": 401
}
```

好像没什么用，估计有什么错

那用一下几个内建用户登录[^build_in_users]

* elastic
* kibana
* logstash_system

内建用户密码： `changeme`


----

默认 elk 是无法在公网访问的，对此我们需要为 kibna 做反向代理，修改 `/etc/nginx/sites-available/default`

```
upstream kibana5 {
    server 127.0.0.1:5601 fail_timeout=0;
}
server {
    listen               *:80;
    server_name          kibana_server;
    access_log           /var/log/nginx/kibana.srv-log-dev.log;
    error_log            /var/log/nginx/kibana.srv-log-dev.error.log;

    # ssl                  on;
    # ssl_certificate      /etc/nginx/ssl/all.crt;
    # ssl_certificate_key  /etc/nginx/ssl/server.key;

    location / {
        proxy_pass           http://kibana5;
        proxy_set_header     X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header     Host            $host;
    }
}
```

```
# service nginx restart
```

如果用户够多，当然你可以单独跑一个 kibana5 集群，然后在 upstream 配置段中添加多个代理地址做负载均衡。[^production]

```
http://[IP]/kibana5/
```

nginx 支持访问控制

```

    location ~ ^/kibana5/.* {
        ...
        auth_basic           "Restricted";
        auth_basic_user_file /etc/nginx/conf.d/kibana.myhost.org.htpasswd;
    }
```

----

```
input {
    udp {
        port => 5040
        codec => json
    }
    beats {
        port => 5044
    }
}
output {
  elasticsearch {
    hosts => [ "0.0.0.0:9200" ]
    user => "logstash_system"
    password => "changeme"
  }
}
```

----

```
Index Patterns: Please specify a default index pattern
```



[^built-in-roles]: [Built-in Roles](https://www.elastic.co/guide/en/x-pack/current/built-in-roles.html)

[^build_in_users]: [Built-in Users](https://www.elastic.co/guide/en/x-pack/current/setting-up-authentication.html#setting-up-authentication)

[^production]: [生产环境部署](https://kibana.logstash.es/content/kibana/v5/production.html)