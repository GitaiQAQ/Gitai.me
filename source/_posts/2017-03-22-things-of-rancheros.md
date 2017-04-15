---

layout:     post
title:      "Rancher OS的二三事"
subtitle:   "Things of Rancher OS"
date:       2017-03-22
author:     "Gitai"
categories:
    - RancherOS
tags:
    - RancherOS
    - Docker
    - 记录

---

## Grub 引导

官方提供了 live CD 的镜像[^2]，接下来挂载镜像分析结构

```shell
# mount -o loop [path_of_iso] [path_mounted] 
```

用 `tree` 查看

```shell
$ tree
.
|-- boot
|   |-- global.cfg
|   |-- initrd-v0.8.1
|   |-- isolinux
|   |   |-- boot.cat
|   |   |-- isolinux.bin
|   |   |-- isolinux.cfg
|   |   `-- ldlinux.c32
|   |-- linux-current.cfg
|   `-- vmlinuz-4.9.12-rancher
`-- rancheros
    |-- Dockerfile.amd64
    `-- installer.tar.gz

3 directories, 10 files
```

<!--more-->

编辑自定义 Grub 入口文件

```sh
# gedit /etc/grub.d/40_custom
```

```
menuentry "Rancher OS" --class ubuntu {
  set isoname="rancheros.iso"
  set isofile="/boot/${isoname}"
  echo "Using ${isofile}..."
  loopback loop (hd0,msdos1)$isofile
  linux (loop)/boot/vmlinuz-4.9.12-rancher rancher.password="[PASSWORD]"
  initrd (loop)/boot/initrd-v0.8.1
}
```
> 不加密码会无法登录，没有默认密码。

## Network is unreachable ＆ ssh🐧云无法登录

🐧云不给 DHCP[^3]

先装官方镜像，把信息抄下来，然后自动写入，再开 ssh 连接

Rancher OS 基于 [Alpine Linux][^2] 为了压缩体积，采用静态网络配置，没有`dhclient`， `nslookup` 和 `mtr`

配置文件： `/etc/network/interfaces` 和 `/etc/resolv.conf`

腾讯云配置如下：
```shell
# ifconfig eth0
eth0      Link encap:Ethernet  HWaddr 52:54:00:5f:f6:71  
          inet addr:10.104.81.43  Bcast:10.104.127.255  Mask:255.255.192.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:915 errors:0 dropped:0 overruns:0 frame:0
          TX packets:141 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:111189 (111.1 KB)  TX bytes:22704 (22.7 KB)
```
```
$ route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         10.104.64.1     0.0.0.0         UG    0      0        0 eth0
10.104.64.0     0.0.0.0         255.255.192.0   U     0      0        0 eth0
```

[RancherOS from ISO on machine without DHCP - how to get network up to do ros install](https://forums.rancher.com/t/solved-rancheros-from-iso-on-machine-without-dhcp-how-to-get-network-up-to-do-ros-install/3553/2)

[Linux网络故障排查总结](http://int32bit.me/2016/04/18/Linux%E7%BD%91%E7%BB%9C%E6%95%85%E9%9A%9C%E6%8E%92%E6%9F%A5%E6%80%BB%E7%BB%93/)


## Docker 加速

腾讯云官方脚本好像是错的，缺个引号

```
echo "DOCKER_OPTS=\"\$DOCKER_OPTS --registry-mirror=https://mirror.ccs.tencentyun.com\"" | sudo tee -a /etc/default/docker
sudo service docker restart
```
RancherOS 是 Ubuntu 16 内核，本来应该用这个

```
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/mirror.conf <<-'EOF'
[Service]
ExecStart=
ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://mirror.ccs.tencentyun.com
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

不过 RancherOS 完全接管了配置，如上在 `/var/lib/rancher/conf/cloud-config.yml` 中。
用以下命令配置
```shell
# ros config set rancher.docker.registry_mirror https://mirror.ccs.tencentyun.com
```

[^1]: http://docs.rancher.com/os/networking/interfaces/

[^2]: http://www.infoq.com/cn/news/2016/01/Alpine-Linux-5M-Docker

[^3]:https://blog.yoitsu.moe/arch-linux/cvm_with_arch_linux.html