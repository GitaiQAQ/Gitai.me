---
layout:     post
title:      "SELinux 策略和 Nginx 403 的问题"
date:       2019-05-20
author:     "Gitai"
tags:
    - 笔记
---

> 以此来纪念我加班的 5.20

Nginx 之类的 Httpd 服务使用非 /var/www 产生的 Permission denied 错误，原因在于权限设置有误。

```bash
2019/05/20 10:53:14 [error] 11262#0: *16 open() "/sangfor/*/*/favicon.ico" failed (13: Permission denied), client: 200.200.211.97, server: localhost, request: "GET /favicon.ico HTTP/1.1", host: "10.58.12.67", referrer: "http://10.58.12.67/"
```

<!--more-->


首先 `ps -aux | grep nginx` 查看 Nginx 是以那个用户运行的，并查看 `cat /etc/nginx/nginx.conf | grep user` 配置的用户。

```bash
[root@node2 ~]# ll /sangfor/*/*/
total 16
drwxr-xr-x.  2 root root  231 May  8 15:11 3parts
-rwxr-xr-x.  1 root root 1406 May  8 15:11 favicon.ico
-rwxr-xr-x.  1 root root 2555 May  8 15:11 index.html
-rwxr-xr-x.  1 root root 1422 May  8 15:11 login.html
-rwxr-xr-x.  1 root root  205 May  8 15:11 redirect.html
drwxr-xr-x. 13 root root  156 May  8 15:11 static


[root@node2 ~]# ps -aux | grep nginx
root     11261  0.0  0.0 122896  2264 ?        Ss   10:36   0:00 nginx: master process /usr/sbin/nginx
root     11262  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
root     11263  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
root     11264  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
root     11265  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
root     26868  0.0  0.0 112652   952 pts/1    R+   11:34   0:00 grep --color=auto nginx

[root@node2 ~]# cat /etc/nginx/nginx.conf | grep user
user root;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

```

目标目录的确是 `root`，且 Nginx 使用 `root` 用户启动，那么就可能是 SELinux 的问题。

使用 `sestatus` 或者 `getemforce` 查看 SELinux 的状态

```bash
➜  ~ getenforce
Enforcing

➜  ~ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      28

```

SELinux 有三种模式：

* `enforcing` 强制模式，该模式下会阻止部分操作
* `permissive` 宽松模式，该模式下只会产生警告提示，并不会阻塞操作
* `disabled` 禁用 SELinux

上面的输出是就是完全启用了的 SELinux，对于部分 Linux 命令支持一个 `Z` 参数，比如我们来看看 `ls` 的。

```bash
       -Z, --context
              Display security context so it fits on most displays.  Displays only mode, user, group, security context and file name.
```

显示 SELinux 上下文，那么我们用 `ls -Z` 查看刚刚被阻止的文件路径

```bash
[root@node2 ~]# ls -Z /sangfor/*/*/favicon.ico
-rwxr-xr-x. root root unconfined_u:object_r:default_t:s0 /sangfor/aBDI/sdp-web/favicon.ico
```

而后我们去看看正常的 `var/www` 是什么样的配置。

```bash
[root@node2 ~]# ls -Z /var | grep www
dr-xr-xr-x. www-data www-data system_u:object_r:httpd_sys_content_t:s0 www
```

而 Nginx 所具有的权限又是什么样的？

```bash
[root@node2 ~]# ps -auxZ | grep nginx
system_u:system_r:httpd_t:s0    root     11261  0.0  0.0 122896  2264 ?        Ss   10:36   0:00 nginx: master process /usr/sbin/nginx
system_u:system_r:httpd_t:s0    root     11262  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
system_u:system_r:httpd_t:s0    root     11263  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
system_u:system_r:httpd_t:s0    root     11264  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
system_u:system_r:httpd_t:s0    root     11265  0.0  0.0 123280  3608 ?        S    10:36   0:00 nginx: worker process
```

对比一下其他进程的配置，先用 vi 读取无权限的文件，并 `Ctrl + Z` 切到后台，然后 `ps -auxZ` 看看结果

```bash
[root@node2 ~]# vi /sangfor/*/*/favicon.ico

[1]+  Stopped                 vi /sangfor/*/*/favicon.ico
[root@node2 ~]# ps -auxZ | grep favicon
unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 root 3543 0.0  0.0 126436 1816 pts/1 T 11:52   0:00 vi /sangfor/aBDI/sdp-web/favicon.ico
```

问题找到了，接下来看看如何修改这个参数，这里通过上面的对比，自然能发现有 2 个思路。

改变 Nginx 的配置或者改变目标目录的配置。

而改变 Nginx 的配置可能存在安全性问题，本来就是为了防止操作，如果给他所有文件的读取权限，指不定啥时候就被人端了（其实是我还不会改这个）；那就只能改文件夹的配置了。

上次写清理脚本留下的经验，这种资料比较难找，自己又不会，不如去 Github 抄。

于是以 `httpd_sys_content_t` 这个关键词查找代码，就找到这么个文件 `/etc/selinux/targeted/contexts/files/file_contexts`。[^selinux.md]

```bash
[root@node2 ~]# cat /etc/selinux/targeted/contexts/files/file_contexts | grep httpd_sys_content
/srv/([^/]*/)?www(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/www(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/etc/htdig(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/srv/gallery2(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/lib/trac(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/lib/htdig(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/www/icons(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/glpi(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/htdig(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/drupal.*	system_u:object_r:httpd_sys_content_t:s0
/usr/share/z-push(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/www/svn/conf(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/icecast(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/var/lib/cacti/rra(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/ntop/html(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/doc/ghc/html(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/openca/htdocs(/.*)?	system_u:object_r:httpd_sys_content_t:s0
/usr/share/selinux-policy[^/]*/html(/.*)?	system_u:object_r:httpd_sys_content_t:s0
```

看到了熟悉的 `/var/www` 或许是配置在这里？

再去搜搜这个文件干啥的？[SELinux: manually changing files in /etc/selinux/targeted/contexts/files/](https://serverfault.com/questions/752565/selinux-manually-changing-files-in-etc-selinux-targeted-contexts-files)

很不幸，没发现我这个环境有 `semanage `，安装一个试试，安装失败，大概我这个仓库没有

姑且用 `chcon` 先用着好像也还 OK

```bash
[root@node2 ~]# chcon -R -t httpd_sys_content_t /sangfor/*/*
[root@node2 ~]# ls -lZ /sangfor/*/*
drwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 3parts
-rwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 favicon.ico
-rwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 index.html
-rwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 login.html
-rwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 redirect.html
drwxr-xr-x. root root unconfined_u:object_r:httpd_sys_content_t:s0 static
```

问题虽然解决了，但是 `chcon` 和 `semanage` 有啥区别嘞。

> CentOS系统自带的chcon工具只能修改文件、目录等的文件类型和策略，无法对端口、消息接口和网络接口等进行管理，**semanage 能有效胜任 SELinux 的相关配置工作。**[^semanage]


以及 chcon 只是临时修改目录的 SELinux 属性，而 semanage 会把变更写入到 `/etc/selinux/targeted/contexts/files/file_contexts.local` 里面，这样才能使其永远生效。[^file_selinux]

据 SO 上面说 `/etc/selinux/targeted/contexts/files/file_contexts` 会被某命令覆盖掉；所以并不是很确信，这是不是真的永远生效。

其实对于这个问题，因为 SELinux 产生，那么关了 SELinux 或者修改状态，都能解决这个问题。只是或许存在安全性问题。



[^selinux.md]: [selinux.md](https://github.com/nsmithdev/docs/blob/ca735b8d88fd08f9d33ddcd04eb889b9352a1f09/docs/Linux/selinux.md)

[^semanage]: [linux Selinux 管理工具 semanage](https://blog.csdn.net/u011630575/article/details/52068959)

[^file_selinux]: [文件的SELinux属性](https://blog.51cto.com/stlong/1559468)

