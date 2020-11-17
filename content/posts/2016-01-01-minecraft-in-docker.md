---

layout:     post
title:      "如何在「Docker」环境构建「Minecraft」Server？"
subtitle:   "How to build Minecraft Server in Docker?"
date:       2016-01-01 01:06:19
author:     "Gitai"
header-img: "img/minecraft-in-docker.jpg"
categories:
    - Minecraft
    - Docker
tags:
    - Minecraft
    - Docker

---

## Docker 是什么？
> 轻量级的操作系统虚拟化解决方案

### 基本概念

1. 仓库/Repository(类似Git仓库)
    * 构建 > 2
2. 镜像/Image(只读的模板)
    * 部署 > 3
3. 容器/Container(运行实例)
4. 数据卷／volume(类似 Linux mount)
    * 挂载虚拟磁盘到指定目录

<!--more-->

### 基本结构

> Dockerfile 由一行行命令语句组成，并且支持以 # 开头的注释行。

> 一般的，Dockerfile 分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令。

例如:

```
# This dockerfile uses the ubuntu image
# VERSION 2 - EDITION 1
# Author: docker_user
# Command format: Instruction [arguments / command] ..

# Base image to use, this must be set as the first line
FROM ubuntu

# Maintainer: docker_user <docker_user at email.com> (@docker_user)
MAINTAINER docker_user docker_user@email.com

# Commands to update the image
RUN echo "deb http://archive.ubuntu.com/ubuntu/ raring main universe" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

EXPOSE 5900

# Commands when creating a new container
CMD /usr/sbin/nginx
```

其中，一开始必须指明所基于的镜像名称，接下来推荐说明维护者信息。

`FROM` 格式为 `FROM <image>` 或FROM `<image>:<tag>` 创建镜像

`RUN` 指令将对镜像执行跟随的命令。每运行一条 `RUN` 指令，镜像添加新的一层，并提交。

`EXPOSE <port> [<port>...]` 暴露端口号

`ENV <key> <value>` 指定一个环境变量，会被后续 RUN 指令使用，并在容器运行时保持。

`ADD <src> <dest>` 将复制指定的 `<src>` 到容器中的 `<dest>` Docker 仓库中的文件默认不会导入镜像

`COPY <src> <dest>` 和 ADD 类似

[Docker COPY vs ADD](http://stackoverflow.com/questions/24958140/docker-copy-vs-add)

`VOLUME ["/data"]` 创建一个可以从本地主机或其他容器挂载的挂载点，一般用来存放数据库和需要保持的数据等。

`USER daemon` 指定运行容器时的用户名或 `UID`，后续的 `RUN` 也会使用指定用户。

`WORKDIR <workdir>` 工作目录,及 `～` 路径，可叠加
```
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```
等同于 `WORKDIR /a/b/c`

`CMD` 指令，来指定运行容器时的操作命令

## Dockerfile
```
FROM itzg/ubuntu-openjdk-7

MAINTAINER gitai

ENV APT_GET_UPDATE 2015-12-31
RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y libmozjs-24-bin imagemagick lsof && apt-get clean
RUN update-alternatives --install /usr/bin/js js /usr/bin/js24 100

RUN wget -O /usr/bin/jsawk https://github.com/micha/jsawk/raw/master/jsawk
RUN chmod +x /usr/bin/jsawk
RUN useradd -M -s /bin/false --uid 1000 minecraft \
  && mkdir /data \
  && mkdir /config \
  && mkdir /mods \
  && chown minecraft:minecraft /data /config /mods

EXPOSE 25565

COPY start.sh /start
COPY start-minecraft.sh /start-minecraft

RUN chmod +x /start
RUN chmod +x /start-minecraft

VOLUME ["/data"]
# 此处已合并挂载目录
#VOLUME ["/mods"]
#VOLUME ["/config"]

COPY server.properties /tmp/server.properties
# 复制 Server 配置文件

WORKDIR /data

CMD [ "/start" ]

# Special marker ENV used by MCCY management tool
ENV MC_IMAGE=YES

ENV UID=1000
ENV MOTD A Minecraft Server Powered by Docker
ENV JVM_OPTS -Xmx2048M -Xms1024M
ENV TYPE=VANILLA VERSION=LATEST FORGEVERSION=RECOMMENDED LEVEL=world PVP=true DIFFICULTY=easy \
  LEVEL_TYPE=DEFAULT GENERATOR_SETTINGS= WORLD=

```

## server.properties

服务器配置

``` yaml
op-permission-level=4
allow-nether=true
level-name=world
enable-query=false
allow-flight=false
announce-player-achievements=true
server-port=25565
level-type=DEFAULT
enable-rcon=false
force-gamemode=false
level-seed=
server-ip=
max-build-height=256
spawn-npcs=true
white-list=false
spawn-animals=true
hardcore=false
snooper-enabled=true
texture-pack=
online-mode=false
resource-pack=
pvp=true
difficulty=1
enable-command-block=true
player-idle-timeout=0
gamemode=0
max-players=20
spawn-monsters=true
generate-structures=true
view-distance=10
spawn-protection=16
motd=A Minecraft Server QAQ
generator-settings=
```

## 下载

[Server](https://coding.net/u/dphdjy/p/Minecraft/git/tree/master/minecraft)

[Client](http://pan.baidu.com/s/1hrgTyYC)
密码：wu5c

## 服务端介绍

> 时速云注册可用 1G 内存配置
>
> 充值 1RMB 可送 100 代金券和 2G 可用配置
>
> 此处有坑，充值余额大于 0 方能使用 2G
>
>
> DaoCloud 注册可用 256MB 内存配置
>
> 支持未备案域名，可升级 512MB 配置
>
> 其他可用的比如 `灵雀云` 并为尝试

## 部署

时速云版本：

[我的世界Forge服务端启动器Docker版](http://www.mcbbs.net/thread-536112-1-1.html)

> 北京1区使用默认存储卷功能，暂不支持导入、导出操作

1. 存储与备份 创建 有多大选多大
    2. Tip：北京2区
2. 部署镜像
    3. 打开服务 
        2. Tip：北京2区
    4. 镜像来源 －> 公有
    5. 搜索[dphdjy/minecraft](https://hub.tenxcloud.com/repos/dphdjy/minecraft)
    1. 点击部署
    2. 应用名称 随意
    3. 运行环境 有多大选多大
    4. 勾选 `有状态服务`
        1. `/data`
    5. 高级设置
        6. EULA=TRUE
        7. 其他自己看
3. 创建

DaoCloud：

1. 创建 `Volume` 有多大选多大
2. 部署镜像
    3. 打开镜像详细 [Minecraft](https://dashboard.daocloud.io/packages/8193964b-30a3-4146-be71-8b1346d91133)
    1. 点击部署
    2. 应用名称 随意
    3. 运行环境 有多大选多大
    4. 基础设置
        1. Volume 绑定 
        2. 值 `/data`
3. 立即部署

## 已知BUG

2. 纯净服
    3. 完美运行！！！！
1. FORGE服
    2. 构建卡死(移除 `forgeessentials`)
    3. 分分钟掉线，不知道为什么

## 引用资料

[Docker 介绍](http://dockerpool.com/static/books/docker_practice/introduction/README.html)