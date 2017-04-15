---

layout:     post
title:      "Docker 中鼠标键盘操作无响应"
date:       2017-03-21
author:     "Gitai"
categories:
    - GUI
tags:
    - Docker
    - BUG
    - 记录

---

Docker 通过 namespace， cgroup 将容器与主机资源进行了隔离，默认情况下，在容器中运行带界面的软件在外部是看不到的。

但是 Linuxer 总能折腾出各种奇葩，网上流传也是常见符合容器特性的方案是通过 xvfb + vnc，共享 x11 接口，或者转发 x11 嵌套字。

其中 Docker 自家的 Jessie 所创建的 [Dockerfiles on the desktop](https://github.com/jessfraz/dockerfiles) 最为完整。

<!--more-->

这种方案基于 x11 的 C/S 模型

![modules of x11][1]

虽然 wayland 等 x11 替代方案和特殊发行版如 Mint 已经稳定发布数年。但是自20世纪80年代初期被 MIT 开发的这套系统凭借着独特的设计哲学，不断的通过插件拓展，始终稳定高效的运行在数以亿万计的设备之上。

## xvfb + vnc

## 共享接口

## xiwi

## In Docker

伴随容器化技术的普及，出现了如 CoreOS 和 RancherOS 这类 `OS made of Containers` 的容器化系统。

![Rancheros][2]

从分布式到微服务化，再到容器化，云服务这片热土被无数顶尖工程师拓荒和优化。而在桌面端却鲜有变化，在 Windows/Mac 均分的家用市场上，Chrome OS 的出现，让人重新审视2/8定则，或许我们需要的只是一个浏览器。

但是经过长约半年的尝试，折腾且不说国内网络环境和各项平台独占的任务。ChromeOS 在同等地位上的用户体验是具有颠覆性的，高度特化的底层，全新的图像引擎更是发挥了，远超传统 Linux 发行版的体验。

但是过度依赖网络的所谓云服务，并不符合现有环境，应用市场的丰富度也总差了点什么，除开纯连接和套壳网页（对，就是你网易云），不谈优质应用，库存也将骤减。曾经从事过所谓的 Chrome 应用开发，不可否认其安全和可用性，但是也总有一种施展不开的错觉？

几年前 CoreOS 在硅谷的车库中诞生，参考 ChromeOS 的分区设计和构建流，以独特的 `OS made of Containers` 设计，在容器云开天辟地，并借力 Google 成为一方笑谈。

与此同时 RancherOS 也以此为中心，完成系统层级的容器化，并且分离容器层级，即使 `docker rm -f $(docker ps -qa)` 被执行，对系统也没有一丝影响。

## 软件分发

但是 docker 本身的安全性尚不明确，过度的限制资源，又将产生意外的问题。姑且将本服务定义为 CoreOS\`s CTO 所说的 `Containers Are the Next Linux Package Manager` [^coreos-cto-containers-are-next-linux-package-manager] 

### 发行渠道

传统的软件分发诸如：

1. Windows exe 第三方渠道
2. Mac/IOS APP Store
3. Debian 及其衍生版的 apt，之类的 Linux 官方库
4. Android 的 Google Play 和 第三方市场

第三方市场鱼龙混杂，官方渠道又受到各种限制。

### 打包工具[^packaging]

1. MSI，Inno Setup，NSIS，Advanced Installer，PAL
2. Linux 打包
3. Mac 打包

> MSI是比较难用，这是一点。第二MSI耍流氓也比写exe麻烦。MSI优点非常多，有利于你写出一个语义上自带transaction的安装程序。但这又怎么样呢？大多数程序员只会想，你装挂了干我鸟事 —— （默默看向装了一半点取消有可能干掉linux的eclipse
([vczh](https://www.zhihu.com/question/33542832/answer/56769981))

打包流程不是诸如 便携式打包 的沙盘监听自动打包，就是手动编写配置打包/解包流程，和位置。卸载之后又总有那么一些残留，于是清理工具就出现了。

随后压缩软件也支持所谓的相对路径自解压什么的。

Linux 打包什么的就完全不知道了，毕竟看起来就那么复杂

Mac 那就更抱歉了，我连 Mac 都没用过


### 兼容性

更奈何，个人作品的分发在跨平台中总受到各种兼容性的打击。

Linux 光是界面方案，就从 X11 到gtk/qt什么的，各种兼容性问题。

多数应用还不能进入 Window 和 Mac

而 Docker 就完美解决以上问题。

## GUI 支持

普通的 docker 容器

```shell
docker run -it \
    --name bash \
    ubuntu
```

Linux 一切都是文件，通过 docker 的共享卷共用x11嵌套字，在容器内输出GUI

```shell
docker run -d \
  -v /etc/localtime:/etc/localtime:ro \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -e DISPLAY=$DISPLAY \
  -v $HOME/slides:/root/slides \
  -e GDK_SCALE \
  -e GDK_DPI_SCALE \
  --name libreoffice \
  jess/libreoffice
```

## CoreOS & RancherOS[^7210064]

同样把容器封装到系统层，然后用 docker 分发软件和环境，同时 CoreOS 的只读分区和多分区引导，保证了系统内核和运行环境的稳定和持续更新，而容器本身互相嵌套，相对传统虚拟机，提高了磁盘利用效率。

```
% systemd-cgls
    ├─user.slice
    │ └─user-1000.slice
    │   └─user@1000.service
    │     ├─6612 /usr/lib/systemd/systemd --user
    │     └─6616 (sd-pam)
    └─system.slice
      ├─1 /sbin/init
      ├─systemd-udevd.service
      │ └─151 /usr/lib/systemd/systemd-udevd
      ├─systemd-logind.service
      │ └─345 /usr/lib/systemd/systemd-logind
      └─systemd-journald.service
        └─125 /usr/lib/systemd/systemd-journald
```

通过在 Ubuntu 之类的完整桌面发行版的尝试，我们依次得到以下几个结论
1. 运行 GUI 程序
2. 拆分/封装系统
3. 提权完成底层交互

于是在上述，docker 运行 GUI 的基础上，将 x11 近一步进行封装。

```shell
docker run -ti \
    -e DISPLAY=:0 \
    -v /tmp/.X11-unit:/tmp/.X11-unit \
    -v /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket \
    -v /dev/tty0:/dev/tty0 \
    --name gui \
    gui xinit
```

```
(EE) Fatal server error:
(EE) parse_vt_settings: Cannot open /dev/tty0 (Operation not permitted)
```

```shell
docker run -ti \
    -e DISPLAY=:0 \
    --privileged \
    --name gui \
    gui xinit
```

![xtrem][3]

xterm 正常运行，然而无法接受鼠标和键盘事件[^keyboard-mouse]

```
cat /proc/bus/input/devices
```

直接查看相关事件
```
$ ls /dev/input/
event0  event2  event4  event6  js1   mouse0  mouse2
event1  event3  event5  js0     mice  mouse1
```

设备文件分为两种：块设备文件(b)和字符设备文件(c)
设备文件一般存放在/dev目录下，对常见设备文件作如下说明：

* `/dev/hd[a-t]`：IDE设备
* `/dev/sd[a-z]`：SCSI设备
* `/dev/fd[0-7]`：标准软驱
* `/dev/md[0-31]`：软raid设备
* `/dev/loop[0-7]`：本地回环设备
* `/dev/ram[0-15]`：内存
* `/dev/null`：无限数据接收设备,相当于黑洞
* `/dev/zero`：无限零资源
* `/dev/tty[0-63]`：虚拟终端
* `/dev/ttyS[0-3]`：串口
* `/dev/lp[0-3]`：并口
* `/dev/console`：控制台
* `/dev/fb[0-31]`：framebuffer
* `/dev/cdrom` => /dev/hdc
* `/dev/modem` => /dev/ttyS[0-9]
* `/dev/pilot` => /dev/ttyS[0-9]
* `/dev/random`：随机数设备
* `/dev/urandom`：随机数设备

/dev 目录下的节点通过devf或者udev自动创建

kobject是sysfs文件系统的基础，udev通过监测、检测sysfs来获取新创建的设备的。

依次如下读取，并执行对应 鼠标/键盘 操作
```
$ cat /dev/input/event2
$ cat /dev/input/mice
```

数据可以正常接受

```
xinput test-xi2 --root
```

应该是设备自动注册出现问题，具体细节列入 TODO。

最后，从 Rancher OS 社区找到解决方案[^monitoring-events-keyboard-mouse-in-x]

直接引入别人做的镜像[^Docker-Xorg]

```
docker run -d \
    -e DISPLAY=:0 \
    -v /tmp \
    -v /var/log \
    --privileged \
    --name xorg \
    dengleros/xorg
```

```
docker run -d \
    -v /var/lib/dbus \
    -v /var/run/dbus \
    -v /home/user/.dbus \
    -v /tmp \
    --name dbus \
    dengleros/dbus
```

```
docker run -d \
    -e DISPLAY=:0 \
    --device /dev/snd:/dev/snd \
    -v /home/user/.config/volumeicon \
    -v /tmp \
    --name volumeicon \
    dengleros/volumeicon
```

```
docker run -d \
    -e DISPLAY=:0 \
    -v /home/user/.fluxbox \
    -v /usr/bin/docker \
    -v /var/run/docker.sock \
    -v /var/lib/dbus \
    -v /var/run/dbus \
    -v /home/user/.dbus \
    -v /tmp \
    --name fluxbox \
    dengleros/fluxbox
```

```
docker run -dti \
    --hostname chromium 、
    --group-add audio \
    --group-add video \
    --volumes-from xorg \
    --volumes-from dbus \
    -e DISPLAY=:0 \
    --shm-size=512m  \
    --device /dev/snd \
    --device /dev/dri \
    --user root \
    --name chromium  \
    dengleros/chromium
```

```
docker run -d \
    --hostname libreoffice \
    -e DISPLAY=:0 \
    --volumes-from xorg \
    --name libreoffice \
    jess/libreoffice
docker run -dti \
    --hostname chromium \
    --group-add audio \
    --group-add video \
    --volumes-from xorg \
    --volumes-from dbus \
    -e DISPLAY=:0 \
    --shm-size=512m  \
    --device /dev/snd \
    --device /dev/dri \
    --user root \
    --name chromium  \
    dengleros/chromium
```

https://twitter.com/AnMaHo/status/723626943170678784

## Windows

以下只提供方向，并未进行测试

https://ctrl.blog/entry/how-to-x-on-wsl?ts=sb



[^Docker-Xorg]: [Docker Xorg](https://forums.rancher.com/t/rancheros-and-sound-module-missing-dev-snd/1799/23)

[^keyboard-mouse]: [Keyboard/Mouse are unresponsable when running x-org in a docker container](http://stackoverflow.com/questions/33585482/keyboard-mouse-are-unresponsable-when-running-x-org-in-a-docker-container)

[^gui-application]: [Running a GUI application in a Docker container](https://linuxmeerkat.wordpress.com/2014/10/17/running-a-gui-application-in-a-docker-container/)

[^coreos-cto-containers-are-next-linux-package-manager]: [CoreOS CTO: Containers Are the Next Linux Package Manager](https://www.linux.com/news/coreos-cto-containers-are-next-linux-package-manager)

[^packaging]: [应用程序打包技术](https://yangwenbo.com/articles/packaging-1-src.html)

[^7210064]: [Broken by design: systemd](https://news.ycombinator.com/item?id=7210064)

[^monitoring-events-keyboard-mouse-in-x]: [monitoring-events-keyboard-mouse-in-x](http://unix.stackexchange.com/questions/146287/monitoring-events-keyboard-mouse-in-x)


  [1]: https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/thumb/0/03/X_client_server_example.svg/284px-X_client_server_example.svg.png
  [2]: http://rancher.com/wp-content/themes/rancher-2016/assets/images/rancheros-containers.png
  [3]: https://www.diigo.com/file/image/ssdarodzdrrcodpdszcraqpcor/capture+image.jpg
  [4]: https://pbs.twimg.com/media/CgrYS2JWIAAARwp.jpg
  [5]: https://pbs.twimg.com/media/CgrW3oeWgAA7Jow.jpg