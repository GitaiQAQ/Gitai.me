---
layout:     post
title:      "实现一个简单的虚拟文件系统"
date:       2019-05-11
author:     "Gitai"
tags:
    - Overlay
---

之前改了改 Oracle 开源的用 Rust 实现的 RunC，弄明白如何生成一个最小化的运行容器环境；但是那时候没去理清楚，如何实现分层的文件系统。这次要测试个脚本，又是没有 docker 的内网环境，只能自己弄一个联合文件系统(union filesystem)，然后写测试了。

<!-- more -->

早期 docker 使用的是 AUFS，但是后来已经用 OverlayFS 替换了，其实操作很简单 `mount` 方法启动一个就行了。

先得准备一个有 OverlayFS 的环境，这是 Linux 内核中的，在高版本的内核上，基本只要打开就行。

* OverlayFS（内核版本 > 3.18）
* Overlay2 （内核版本 > 4.0）

```shell
# 查看内核版本，是否支持
$ uname -r
3.10.0-514.el7.x86_64

# 查看内核是否已加载 overlay 模块 
$ lsmod | grep overlay
overlay                47399  0

# 如果没有上述显示，假设内核开启了该编译选项，那就只要手动打开，如果内核没有编译该选项，则需要重新安装或者编译内核
$ modprobe overlay
```

之前分析 Docker 的时候，已经知道 `chroot` 其实是安装 Archlinux 就知道了。为了运行他，我们得先弄个虚拟文件系统。假设叫 `vfs` ，基于最小的 Linux 发行版 Alpine Linux（在这里下载 [MINI ROOT FILESYSTEM](https://www.alpinelinux.org/downloads/)），解压到 `vfs/rootfs` 下，其实更小的 Demo，是 Docker 仓库那个使用 `busybox` 实现的 `rootfs`，但是我是内网，弄不下来，只能用它代替了。

于是得到如下目录结构：

```shell
➜  vfs tree -L 2
.
├── alpine-minirootfs-3.9.4-x86_64.tar.gz
└── rootfs
    ├── bin
    ├── dev
    ├── etc
    ├── home
    ├── lib
    ├── media
    ├── mnt
    ├── opt
    ├── proc
    ├── root
    ├── run
    ├── sbin
    ├── srv
    ├── sys
    ├── tmp
    ├── usr
    └── var

18 directories, 1 file
```

如果展开子目录，就会发现底层其实也是 `busybox`，这样我们获得一个静态的根目录。既然叫分层文件系统，还得有个用于记录差异的写入层，用于显示挂载结果的节点。（参数上还有一个[ `workdir`](https://unix.stackexchange.com/questions/324515/linux-filesystem-overlay-what-is-workdir-used-for-overlayfs)）

```shell
$ mkdir writable work merged
$ mount -t overlay overlay -olowerdir=rootfs,upperdir=writable,workdir=work merged
$ ls -l merged
total 8
drwxr-xr-x  2 root root    6 May 10 04:49 dev
drwxr-xr-x 15 root root 4096 May 10 04:49 etc
drwxr-xr-x  2 root root    6 May 10 04:49 home
drwxr-xr-x  5 root root  185 May 10 04:49 lib
drwxr-xr-x  5 root root   44 May 10 04:49 media
drwxr-xr-x  2 root root    6 May 10 04:49 mnt
drwxr-xr-x  2 root root    6 May 10 04:49 opt
dr-xr-xr-x  2 root root    6 May 10 04:49 proc
drwx------  2 root root   26 May 10 10:14 root
drwxr-xr-x  2 root root    6 May 10 04:49 run
drwxr-xr-x  2 root root 4096 May 10 04:49 sbin
drwxr-xr-x  2 root root    6 May 10 04:49 srv
drwxr-xr-x  2 root root    6 May 10 04:49 sys
-rw-r--r--  1 root root    0 May 10 10:59 test,sh
drwxrwxrwt  2 root root    6 May 10 04:49 tmp
drwxr-xr-x  7 root root   66 May 10 04:49 usr
drwxr-xr-x 11 root root  125 May 10 04:49 var
```

和 `rootfs` 对比少了个 `bin` 目录，因为被我删了，记录在 `writable` 里面。

```shell
➜  vfs ls -lash upper
total 0
0 drwxr-xr-x 2 root root   32 May 10 10:59 .
0 drwxr-xr-x 6 root root  107 May 10 10:57 ..
0 c--------- 1 root root 0, 0 May 10 10:58 bin
0 -rw-r--r-- 1 root root    0 May 10 10:59 test,sh
```

查看挂载点的信息，完美

```shell
➜  vfs mount
overlay on /root/cleanup/vfs/merged type overlay (rw,relatime,lowerdir=rootfs,upperdir=writable,workdir=work)
```

如果中间出错，这样查看错误信息，因为 `mount` 并不会返回完整的错误报告

```shell
$ dmesg | tail
[4842529.075600] overlayfs: workdir and upperdir must be separate subtrees
[4842573.119551] overlayfs: missing 'workdir'
[4842592.113161] overlayfs: failed to resolve './work': -2
[4843963.669551] overlayfs: failed to resolve 'test/1work': -2
[4843983.259265] overlayfs: failed to resolve './test/1work': -2
```

然后写个脚本自动创建测试环境

```shell
#!/bin/sh
echo "vfs: 正在创建虚拟文件系统"
mkdir -p $1/writable $1/work $1/merged
mount -t overlay overlay -olowerdir=rootfs,upperdir=$1/writable,workdir=$1/work $1/merged

echo "vfs: 初始化环境"
export PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
chroot $1/merged  /bin/sh

echo "vfs: 清理环境"
umount $1/merged
rm -rf $1/writable $1/work $1/merged
```

然后来一段紧张刺激的 `rm -rf /*`

```shell
➜  vfs ./vfs.sh
vfs: 正在创建虚拟文件系统
vfs: 初始化环境
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root   run    sbin   srv    sys    tmp    usr    var
/ # rm -rf /*
/ # ls
/bin/sh: ls: not found
/ # exit
vfs: 清理环境
➜  vfs ./vfs.sh
vfs: 正在创建虚拟文件系统
vfs: 初始化环境
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root   run    sbin   srv    sys    tmp    usr    var
/ #
```

完美，开始用吧

[Docker存储驱动—Overlay/Overlay2「译」](https://arkingc.github.io/2017/05/05/2017-05-05-docker-filesystem-overlay/)

[overlayfs技术探究以及docker的使用](https://www.jianshu.com/p/959e8e3da4b2)

[The Overlay Filesystem](https://windsock.io/the-overlay-filesystem/)