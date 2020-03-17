---

layout:     post
title:      "LEMP 安装"
date:       2017-02-07
author:     "Gitai"
categories:
    - PHP
tags:
    - 记录

---


LEMP[^1][^2] = Linux + nginx (pronounced "engine x") + MySQL + PHP

## 环境

* Ubuntu 16.04 LTS
* PHP 7.0.15 (with php-fpm)
* nginx 1.10.0
* mysql 5.7

```
$ apt search php | grep "^php"
php/xenial,xenial,now 1:7.0+35ubuntu6 all
php-fpm/xenial,xenial,now 1:7.0+35ubuntu6 all
php7.0/xenial-security,xenial-security,xenial-updates,xenial-updates,now 7.0.15-0ubuntu0.16.04.4 all
php7.0-fpm/xenial-security,xenial-updates,now 7.0.15-0ubuntu0.16.04.4 amd64
```

<!--more-->

```
# apt install httpd
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Package httpd is a virtual package provided by:
  nginx-light 1.10.0-0ubuntu0.16.04.4
  nginx-full 1.10.0-0ubuntu0.16.04.4
  nginx-extras 1.10.0-0ubuntu0.16.04.4
  nginx-core 1.10.0-0ubuntu0.16.04.4
  apache2 2.4.18-2ubuntu3.1
  yaws 2.0.2-1
  webfs 1.21+ds1-11
  tntnet 2.2.1-2
  ocsigenserver 2.6-1build2
  mini-httpd 1.23-1
  micro-httpd 20051212-15
  lighttpd 1.4.35-4ubuntu2
  ebhttpd 1:1.0.dfsg.1-4.3
  aolserver4-daemon 4.5.1-18
  aolserver4-core 4.5.1-18
You should explicitly select one to install.

E: Package 'httpd' has no installation candidate
```

```
$ apt search "^mysql"

mysql-client/xenial-updates,xenial-updates 5.7.17-0ubuntu0.16.04.2 all
  MySQL database client (metapackage depending on the latest version)

mysql-client-5.7/xenial-updates 5.7.17-0ubuntu0.16.04.2 amd64
  MySQL database client binaries

mysql-client-core-5.7/xenial-updates 5.7.17-0ubuntu0.16.04.2 amd64
  MySQL database core client binaries

mysql-server/xenial-updates,xenial-updates 5.7.17-0ubuntu0.16.04.2 all
  MySQL database server (metapackage depending on the latest version)

mysql-server-5.7/xenial-updates 5.7.17-0ubuntu0.16.04.2 amd64
  MySQL database server binaries and system database setup
```

```
# apt install php php-fpm \
    mysql-server mysql-client\
    nginx-full
```

New password for the MySQL "root" user: **<-- yourrootsqlpassword**

Repeat password for the MySQL "root" user: **<-- yourrootsqlpassword**

```
$ systemctl status nginx.service
* nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2017-04-24 12:44:20 CST; 26min ago
 Main PID: 29245 (nginx)
   CGroup: /system.slice/nginx.service
           |-29245 nginx: master process /usr/sbin/nginx -g daemon on; master_process on
           `-29246 nginx: worker process                           

Apr 24 12:44:20 VM-155-68-ubuntu systemd[1]: Starting A high performance web server and a reverse proxy server...
Apr 24 12:44:20 VM-155-68-ubuntu systemd[1]: nginx.service: Failed to read PID from file /run/nginx.pid: Invalid argument
Apr 24 12:44:20 VM-155-68-ubuntu systemd[1]: Started A high performance web server and a reverse proxy server.
```

```
$ systemctl status mysql
* mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2017-04-24 13:10:09 CST; 1min 54s ago
 Main PID: 1056 (mysqld)
   CGroup: /system.slice/mysql.service
           `-1056 /usr/sbin/mysqld

Apr 24 13:10:08 VM-155-68-ubuntu systemd[1]: Starting MySQL Community Server...
Apr 24 13:10:09 VM-155-68-ubuntu systemd[1]: Started MySQL Community Server.
```
## 配置 nginx

```
# cat /etc/nginx/nginx.conf
...
        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
...
```

```
# ls /etc/nginx/sites-enabled/
default
```

```
＃ cat /etc/nginx/sites-enabled/default
        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #        include snippets/fastcgi-php.conf;
        #
        #        # With php7.0-cgi alone:
        #        #fastcgi_pass 127.0.0.1:9000;
        #        # With php7.0-fpm:
        #        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one

        #location ~ /\.ht {
        #        deny all;
        #}
```
```
＃ cat /etc/nginx/sites-enabled/default
        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html index.php;

        server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
        #
        #        # With php7.0-cgi alone:
        #        #fastcgi_pass 127.0.0.1:9000;
                # With php7.0-fpm:
                fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one

        location ~ /\.ht {
                deny all;
        }
```

```
# echo "<?php
phpinfo();" > /var/www/html/info.php
```

Now we call that file in a browser (e.g. http://192.168.0.100/info.php):

## Get support mysql

```
$ apt search mysql | grep "php"
php-db/xenial,xenial 1.7.14-3build1 all
php-mdb2-driver-mysql/xenial,xenial 1.5.0b4-1ubuntu1 all
php-mysql/xenial,xenial 1:7.0+35ubuntu6 all
php-zend-db/xenial,xenial 2.6.2-1build1 all
php7.0-mysql/xenial-security,xenial-updates 7.0.15-0ubuntu0.16.04.4 amd64
phpmyadmin/xenial-updates,xenial-updates 4:4.5.4.1-2ubuntu2 all
```

```
# apt-get install php-mysql php7.0-mysql
```

```
sudo vi /etc/php/7.0/fpm/pool.d/www.conf
sudo nginx -s reload
sudo systemctl restart nginx.service
```

ThinkPHP 伪静态

```conf
    location / {  
        index  index.htm index.html index.php;  
        try_files  $uri  /index.php$uri;  
    }  
    location ~ .+\.php($|/) {  
        root        /var/www/html/website;  
        fastcgi_pass   127.0.0.1:9000;  
        fastcgi_index  index.php;  
          
        fastcgi_split_path_info  ^(.+\.php)(/.*)$;  
        fastcgi_param  PATH_INFO $fastcgi_path_info;  
          
        include        fastcgi.conf;  
    }  
```

[^installing-nginx-with-php5-fpm-and-mysql-on-ubuntu-14.04-lts-lemp]: [Installing Nginx With PHP5 (And PHP-FPM) And MySQL Support (LEMP) On Ubuntu 14.04 LTS](https://www.howtoforge.com/installing-nginx-with-php5-fpm-and-mysql-on-ubuntu-14.04-lts-lemp)

[^1]: [php-fpm的安装和启动](https://www.zybuluo.com/phper/note/72879)

[^2]: [linux上nginx的安装启动以及配合php-fpm的使用](https://www.zybuluo.com/phper/note/73025)

