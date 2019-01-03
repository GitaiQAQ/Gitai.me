---

layout:     post
title:      "容器化系统实践"
date:       2017-03-25
author:     "Gitai"
tags:
    - 容器化
    - Contained OS
    - 记录

---

> App Sandbox is an access control technology provided in OS X, enforced at the kernel level. Its strategy is twofold:
App Sandbox enables you to describe how your app interacts with the system. The system then grants your app the access it needs to get its job done, and no more.
App Sandbox provides a last line of defense against the theft, corruption, or deletion of user data if an attacker successfully exploits security holes in your app or the frameworks it is linked against.
— Apple About App Sandbox[^2.1]


> Containers Are the Next Package Manager [^next-linux-package-manager]

## Quick Start

```
curl http://isostore-1252924862.cosgz.myqcloud.com/cins/install.sh | bash
```

<!--more-->

## On Linux distros[^dockerize-your-development-environment]

[^papyros-shell]: [Papyros Shell](https://github.com/papyros/papyros-shell)

[^next-linux-package-manager]: [coreos-cto-containers-are-next-linux-package-manager](https://www.linux.com/news/coreos-cto-containers-are-next-linux-package-manager)

## On Linux distros without GUI

只需要一个支持显卡驱动的内核，和 Docker 运行环境。估摸着计蒜客的在线 Linux 沙盘，就是这个方案，不过那估计是整个系统放在一个容器里。而不是我这种应用打包的方式。

### 局部容器化

需要在桌面系统中安装运行(具备 X11 即可)

#### 安装桌面化环境

```
$ apt install xinit x11-xserver-utils
```

#### 安装 docker

```
$ curl -fsSL https://get.docker.com/ | sh
# usermod -aG docker ubuntu
```

#### 加速

腾讯云环境
```shell
# mkdir -p /etc/systemd/system/docker.service.d
# tee /etc/systemd/system/docker.service.d/mirror.conf <<-'EOF'
[Service]
ExecStart=
ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://mirror.ccs.tencentyun.com
EOF
# systemctl daemon-reload
# systemctl restart docker
```

阿里云
```shell
$ docker login registry-internal.aliyuncs.com
```

Daocloud
```
$ curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://b2c3765b~.m.daocloud.io
```

#### 切换到 X11

```
# xinit
```
#### 允许外部调用

```
$ xhost +
```

#### 运行

![alpine][5]

```
# docker run -d --rm \
    -v /etc/localtime:/etc/localtime:ro \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -e DISPLAY=:0 \
    -v $HOME/slides:/root/slides \
    -e GDK_SCALE \
    -e GDK_DPI_SCALE \
    --name libreoffice \
    jess/libreoffice
```

### 完全容器化

![](https://www.diigo.com/file/image/ssdarodzdrsqosccczcrbpoebb/docker-desktop-vscode-libreoffice.jpg)

![](https://www.diigo.com/file/image/ssdarodzdrsqosqrazcrbpoeeq/docker-desktop-ui.jpg)

```shell
$ cat /etc/os-release
NAME="Ubuntu"
VERSION="16.04.2 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.2 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
```

#### 安装 docker

```
$ curl -fsSL https://get.docker.com/ | sh
```

#### X11 环境容器化

https://forums.rancher.com/t/rancheros-and-sound-module-missing-dev-snd/1799/23

```
# docker run -d \
    -e DISPLAY=:0 \
    -v /root:/root \
    -v /tmp \
    -v /var/log \
    --privileged \
    --name xorg \
    dengleros/xorg
```

```
# docker run -d \
    -v /var/lib/dbus \
    -v /var/run/dbus \
    -v /home/user/.dbus \
    -v /tmp \
    --name dbus \
    dengleros/dbus
```

#### 启动 libreoffice

```
# docker run -d --rm \
    -e DISPLAY=:0 \
    --volumes-from xorg \
    -v $HOME:/root \
    jess/libreoffice
```

![docker-libreoffice][1]

#### 使用窗口管理器

```
＃ docker run -d \
    -e DISPLAY=:0 \
    --volumes-from xorg \
    --name desktop \
    daocloud.io/dphdjy/docker-xfce4-material:latest
```

```
＃ docker run -d \
    -e DISPLAY=:0 \
    --volumes-from xorg \
    --name fluxbox \
    dengleros/fluxbox
```

![docker-flubox-libreoffice][2]

```
＃ docker run -d --rm\
    --volumes-from desktop \
    -e DISPLAY=:0 \
    --device /dev/dri \
    --name vscode \
    jess/vscode
```

```
docker run -d --rm\
    --volumes-from xorg \
    -e DISPLAY=:0 \
    --device /dev/dri \
    -v $HOME/app:~/app \
    --name electron \
    gitai/electron
```

```
* autoconf
* automake
* inkscape
* libgdk-pixbuf2.0-dev (gdk-pixbuf2-devel)  >= 2.32.2
* libglib2.0-dev (glib2-devel)              >= 2.48.0
* librsvg2-dev (librsvg2-devel)             >= 2.40.13
* libsass0 (libsass)                        >= 3.3.6
* libxml2-utils (libxml2)
* pkg-config (pkgconfig)
* sassc                                     >= 3.3.2
```

```
FROM alpine
MAINTAINER Gitai<gitai.cn@gmail.com>
LABEL maintainer "Gitai<gitai.cn@gmail.com>"

RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk update
RUN apk add 
RUN apk add xfce4 paper-gtk-theme@testing paper-icon-theme@testing 
# RUN apk add lxappearance@testing

ENV HOME /home/user
COPY .gtkrc-2.0 $HOME/.gtkrc-2.0
COPY xsettings.xml $HOME/.config/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml
COPY xfwm4.xml $HOME/.config/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml
RUN adduser -h $HOME -D user \
	&& chown -R user:user $HOME
WORKDIR $HOME

ENTRYPOINT [ "startxfce4" ]
```

start.sh
```
#!/bin/sh

xfconf-query -c xfwm4 -p /general/theme -s Paper
xfconf-query -c xsettings -p /Net/ThemeName -s Paper
startxfce4
```

```
# RUN apk add autoconf automake inkscape gdk-pixbuf-dev glib-dev librsvg-dev libsass libxml2-dev pkgconfig sassc
# https://github.com/adapta-project/adapta-gtk-theme

echo "http://mirrors.aliyuncs.com/alpine/v3.5/main
http://mirrors.aliyuncs.com/alpine/v3.5/community
@edge http://mirrors.aliyun.com/alpine/edge/main
@testing https://mirrors.ustc.edu.cn/alpine/edge/testing" > /etc/apk/repositories
```

```
git clone http://github.com/adapta-project/adapta-gtk-theme.git --depth=1
git clone https://github.com/sass/sassc.git --depth=1
git clone https://github.com/sass/libsass.git --depth=1
```

```
wget http://cn.bing.com/az/hprichbg/rb/Hveravellir_ZH-CN12673758963_1920x10
80.jpg
```

~/.gtkrc-2.0
```
# DO NOT EDIT! This file will be overwritten by LXAppearance.
# Any customization should be done in ~/.gtkrc-2.0.mine instead.

include "/home/user/.gtkrc-2.0.mine"
gtk-theme-name="Paper"
gtk-icon-theme-name="Paper"
gtk-font-name="Sans 10"
gtk-cursor-theme-size=0
gtk-toolbar-style=GTK_TOOLBAR_BOTH
gtk-toolbar-icon-size=GTK_ICON_SIZE_LARGE_TOOLBAR
gtk-button-images=1
gtk-menu-images=1
gtk-enable-event-sounds=1
gtk-enable-input-feedback-sounds=1
gtk-xft-antialias=1
gtk-xft-hinting=1
gtk-xft-hintstyle="hintfull"
gtk-xft-rgba="none"
```

cat ~/.config/xfce4/xfconf/xfce-perchannel-xml/xsettings.xml
```
<?xml version="1.0" encoding="UTF-8"?>

<channel name="xsettings" version="1.0">
  <property name="Net" type="empty">
    <property name="ThemeName" type="string" value="Paper"/>
    <property name="IconThemeName" type="empty"/>
    <property name="DoubleClickTime" type="empty"/>
    <property name="DoubleClickDistance" type="empty"/>
    <property name="DndDragThreshold" type="empty"/>
    <property name="CursorBlink" type="empty"/>
    <property name="CursorBlinkTime" type="empty"/>
    <property name="SoundThemeName" type="empty"/>
    <property name="EnableEventSounds" type="empty"/>
    <property name="EnableInputFeedbackSounds" type="empty"/>
  </property>
  <property name="Xft" type="empty">
    <property name="DPI" type="empty"/>
    <property name="Antialias" type="empty"/>
    <property name="Hinting" type="empty"/>
    <property name="HintStyle" type="empty"/>
    <property name="RGBA" type="empty"/>
  </property>
  <property name="Gtk" type="empty">
    <property name="CanChangeAccels" type="empty"/>
    <property name="ColorPalette" type="empty"/>
    <property name="FontName" type="empty"/>
    <property name="IconSizes" type="empty"/>
    <property name="KeyThemeName" type="empty"/>
    <property name="ToolbarStyle" type="empty"/>
    <property name="ToolbarIconSize" type="empty"/>
    <property name="MenuImages" type="empty"/>
    <property name="ButtonImages" type="empty"/>
    <property name="MenuBarAccel" type="empty"/>
    <property name="CursorThemeName" type="empty"/>
    <property name="CursorThemeSize" type="empty"/>
    <property name="DecorationLayout" type="empty"/>
  </property>
</channel>
```

https://coding.net/u/gitai/p/docker-alpine-docker-material

```
docker login daocloud.io
docker pull daocloud.io/dphdjy/docker-xfce4-material:latest
```

## RancherOS

RancherOS 在 0.8 将对桌面的支持加入内核[^add_desktop_kernel]

[^add_desktop_kernel]: [Add desktop kernel ](https://github.com/rancher/os-kernel/pull/12)

```
# ros s enable kernel-extras
# ros s list
enabled  kernel-extras
```

-> See alse: Install GUI in docker

## Target

+ CoreOS Linux 4.0.5 x86_64
+ mus-ash + Mandoline UI Service + Aura

## Code

The core Mojo system can be found in src/mojo
The Mus service is in src/components/mus
The new window manager, and other shell components extracted from Chrome live in src/mash


> This [Dockerfile][3] from this [blog post][4] demonstrate an ideal way to get started with a Linux GUI running in a (Docker) container. A similar setup can be achieved using a CoreOS machine(s) as a host, and X11 and SSHD running inside the container. In the example I linked, the author also included software like the JRE (Java), Firefox, LibreOffice, and a Desktop/Window Manager (Fluxbox). You don't necessarily need to include this in your container, for instance, you could include the awesome WM, Chromium, and xterm. The author is also using Ubuntu as his docker base image, you might decide to use, for instance, Debian or Arch Linux.[^how-to-install-graphic-capabilities-to-coreos]

[^how-to-install-graphic-capabilities-to-coreos]: [How to install graphic capabilities to CoreOs?](http://unix.stackexchange.com/questions/200229/how-to-install-graphic-capabilities-to-coreos)

[^dockerize-your-development-environment]: [Dockerize Your Development Environment](http://blog.vngrs.com/dockerize-your-development-environment/)

[1]: https://www.diigo.com/file/image/ssdarodzdrrsadqoazcrbboqbp/docker-libreoffice.jpg
[2]: https://www.diigo.com/file/image/ssdarodzdrrsaebpezcrbboqep/docker-flubox-libreoffice.jpg
[3]: https://github.com/rogaha/docker-desktop/blob/master/Dockerfile
[4]: https://blog.docker.com/2013/07/docker-desktop-your-desktop-over-ssh-running-inside-of-a-docker-container/
[5]: https://pbs.twimg.com/media/CgrYS2JWIAAARwp.jpg