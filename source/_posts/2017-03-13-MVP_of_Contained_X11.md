---

layout:     post
title:      "容器化 GUI 的最小可实现模型"
subtitle:   "MVP of Contained X11"
date:       2017-03-13
author:     "Gitai"
categories:
    - Docker
tags:
    - GUI
    - Docker
    - 记录

---

本文将基于 Ubuntu Server 16.04.1 LTS 64位 构造 docker 运行 GUI 服务的最小可实现模型。

<!--more-->

## 安装 Docker[^mirror]

```shell
curl -fsSL https://get.docker.com/ | sh
sudo usermod -aG docker ubuntu
```

开启镜像加速

```shell
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/mirror.conf <<-'EOF'
[Service]
ExecStart=
ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://mirror.ccs.tencentyun.com
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

阿里云加速

```shell
docker login registry-internal.aliyuncs.com
docker run registry-internal.aliyuncs.com/alicloudhpc/hello-world
```

daocloud 加速，敏感信息已经过滤

```
curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://XXX.m.daocloud.io
```

## 安装 x11

在本地安装 `xinit`，并启动 `xterm`

```shell
sudo apt-get install xinit
sudo xinit
```

## Access control disable

X11 服务默认只允许『来自本地的用户』启动的图形程序将图形显示在当前屏幕上。

对于大多数的 Linux 用户来说，直接运行博客中的命令，都应该会遇到这个问题。

解决的办法很简单，允许所有用户访问 X11 服务即可。这个事情可以用 xhost 命令完成。[^1]

```shell
sudo apt-get install x11-xserver-utils
xhost +
```

参数『+』表示允许任意来源的用户。


## Build & Run[^3]

运行 `libreoffice` 

```shell
echo "docker run -d -v /etc/localtime:/etc/localtime:ro -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=\$DISPLAY -v $HOME/slides:/root/slides -e GDK_SCALE -e GDK_DPI_SCALE --name libreoffice jess/libreoffice" > libreoffice.sh
bash libreoffice.sh
```

![](https://www.diigo.com/file/image/ssdarodzdrrsadqoazcrbboqbp/docker-libreoffice.jpg)

[^1]: [林帆：Docker运行GUI软件的方法](http://mp.weixin.qq.com/s?__biz=MzI4MzAwNTQ3NQ==&mid=209866190&idx=1&sn=0ee75509eb2fab454009125e0a8c6437&scene=0#rd)

[^2]: [Container Hacks and Fun Images](https://pan.baidu.com/play/video#video/path=%2FContainer%20Hacks%20and%20Fun%20Images.mp4&t=-1)

[^2.1]: [Dockerfiles of jessfraz](https://blog.jessfraz.com/post/docker-containers-on-the-desktop/)

[^3]: [Dockerfiles of jessfraz](https://github.com/jessfraz/dockerfiles)

[^4]: [Viz-Parallel-Magic](https://github.com/vizv/Viz-Parallel-Magic)

[^5]: [dockerized-openoffice](https://github.com/tobegit3hub/dockerized-openoffice)

[^6]: [存储技术交流会-Ceph的开发与应用](https://www.ustack.com/blog/ceph-meet-up/)

[^7]: [RADOS – RADOS 对象存储工具¶](http://docs.ceph.org.cn/man/8/rados/)

[^8]: [Dataman-Cloud/crane](https://github.com/Dataman-Cloud/crane)
: 这是一个基于最新 Docker SwarmKit 技术的集群管理工具。它可以根据 Docker 的原生编排功能，采用轻量化架构帮助开发者快速搭建 DevOps 环境，体验 Docker 的各种最新功能。

[^9]: [.Net Development Environment](https://hub.docker.com/r/cmiles74/docker-vscode/)

[^mirror]: https://www.daocloud.io/mirror#accelerator-doc