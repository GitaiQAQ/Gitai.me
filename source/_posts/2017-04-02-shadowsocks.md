---

layout:     post
title:      "Shadowsocks"
date:       2017-04-2
author:     "Gitai"
categories:
    - Shadowsocks
tags:
    - Shadowsocks

---

本页面来自 http://shadowsocks.org， 只是被墙后的不及时更新的镜像。 

> A secure socks5 proxy, designed to protect your Internet traffic.

<!-- more -->

## 下载 ＆ 安装

### Windows

GUI Client

* Shadowsocks-Qt5:  [Github](https://github.com/shadowsocks/shadowsocks-qt5/releases)
* shadowsocks-C#（**推荐**）
    * [Github](https://github.com/shadowsocks/shadowsocks-windows/releases)
    * [mirrors](/file/Shadowsocks-4.0.6.zip)

命令行

* `pip install shadowsocks`

### Mac OS X

GUI Client

* ShadowsocksX-NG
    * [GitHub](https://github.com/shadowsocks/ShadowsocksX-NG/releases)
    * [mirrors](/file/ShadowsocksX-NG.1.6.1.zip)

命令行

* `pip install shadowsocks`
* `brew install shadowsocks-libev`
* `cpan Net::Shadowsocks`

### Linux

GUI Client

* Shadowsocks-Qt5: [GitHub](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation)

Command-line Client

* `pip install shadowsocks`
* `apt-get install shadowsocks-libev`
* `cpan Net::Shadowsocks`

### Android

* shadowsocks-android:
    * [Github](https://github.com/shadowsocks/shadowsocks-android/releases)
    * [Google Play (beta)](https://play.google.com/store/apps/details?id=com.github.shadowsocks)
    * [mirrors](/file/shadowsocks-nightly-4.2.5.apk)

### iOS

* Potatso:
    * [App Store](https://itunes.apple.com/app/apple-store/id1070901416?pt=2305194&ct=shadowsocks.org&mt=8)
* MobileShadowSocks:
    * [Big Boss](http://apt.thebigboss.org/onepackage.php?bundleid=com.linusyang.shadowsocks)

### Chromebook

* shadowsocks-chromeapp
    * [Github](https://github.com/shadowsocks/shadowsocks-chromeapp)
    * [Chrome App store](https://chrome.google.com/webstore/detail/shadowsocks/fnhhahhihediajgefcnlpdmnogndblbi?hl=zh-CN)

### OpenWRT

* shadowsocks-libev
    * `opkg install shadowsocks-libev`
* shadowsocks-libev-polarssl
    * `opkg install shadowsocks-libev-polarssl`

## 配置 ＆ 使用

### Windows

有三种方式导入节点

1. 配置文件导入
    1. 下载服务商提供的配置文件
    2. 右键任务栏纸飞机图标
    3. `服务器` -> `从配置文件导入服务器`，选择配置文件
2. 剪贴板导入
    1. 从服务商面板复制配置形如 `ss://cmM0LW1kNTpIaTRXQldAMTAzLjc2LjEwNS4xNjoxMTA0Nw==` 的字符串
    2. 右键任务栏纸飞机图标
    3. `从剪贴板复制地址`
3. 二维码导入
    1. 打开服务商提供的服务器详细信息页面
    2. 将二维码置于可见范围
    3. 右键任务栏纸飞机图标
    4. `扫描屏幕二维码`
    
然后选择一个合适的服务器，更新一下 PAC 为绕过国内 IP，然后开启系统代理即可上网。

### Mac OS X

* 纸飞机上右键
* `服务器列表`
* `导入服务器配置文件...` 
    
导入服务商提供的配置文件，然后选择一个合适的服务器，更新一下PAC，然后开启系统代理即可上网。

### Android

在手机上默认浏览器中点击类似 `ss://cmM0LW1kNTpIaTRXQldAMTAzLjc2LjEwNS4xNjoxMTA0Nw==` 的连接，然后点击确定，批量添加完节点，然后路由选择绕过大陆，右上角开启就可以上网了。

或者扫二维码导入

### OpenWrt

[点击查看](https://www.kansusu.com/ss-op.html)

游戏加速教程：[先下载这个安装](https://sourceforge.net/projects/sockscap64/files/SocksCap64-setup-3.6.exe/download)然后点击[查看教程](https://www.kansusu.com/socks64.html)