---

layout:     post
title:      "直接从硬盘运行 ISO 文件"
date:       2017-02-25
author:     "Gitai"
categories:
    - Linux
tags:
    - 记录

---

相比其他 Linux 发行版，Ubuntu 及其衍生版可以更容易的完成支持。

* ISO 镜像只能通过 GNU GRUB 启动，所以需要在 Linux 环境下启动。
* live 环境下只支持发行版的 live CD 版本

<!--more-->

## 检查 ISO 内容

live CD 通过 VirtIO，内核镜像启动系统，在新的 Ubuntu Live CD 中，内核被存放在 /casper 目录，并且命名为 vmlinuz.efi 。如果你使用的是其它系统，可能会没有 .efi 扩展名或内核被存放在其它地方 (可以使用归档管理器打开 ISO 文件在 /casper 中查找确认)。

![xubuntu iso][1]

## 取得 ISO 镜像路径

GRUb 有一套不同的路径方案，(hd0,1) 意味着 /dev/sda0，0 表示第一个硬盘，1 表示第一个分区。

你可以使用

```sh
# fdisk -l
```
查看自己环境下的参数

![grub fs][2]

## 创建 GRUB 入口

最简单的增加方式为修改 `/etc/grub.d/40_custom` 文件，这个文件被设计为用户自定义增加入口。
```sh
# gedit /etc/grub.d/40_custom
```

![grub edit][3]

除非添加了其他自定义启动项，否则文件基本为空。 在注释行下面的文件中添加一个或多个 ISO 引导部分。

```
menuentry “Ubuntu 14.04 ISO” {
    set isofile=”/home/name/Downloads/ubuntu-14.04.1-desktop-amd64.iso”
    loopback loop (hd0,1)$isofile
    linux (loop)/casper/vmlinuz.efi boot=casper iso-scan/filename=${isofile} quiet splash
    initrd (loop)/casper/initrd.lz
}
```
* [loopback](https://www.gnu.org/software/grub/manual/html_node/loopback.html#loopback)
* [linux](https://www.gnu.org/software/grub/manual/html_node/linux.html#linux)
* [initrc](https://www.gnu.org/software/grub/manual/html_node/initrd.html#initrd)

在更新完 grub 之后（`sudo update-grub`）

`/etc/defaults/grub` 和 `/etc/grub.d` 将被构造成 `/boot/grub/grub.cfg`， 该文件因为自动生成，而不需要手动编写。

> 不同的 Linux 发行版具有不同的入口文件，以及不同的引导参数。GRUB Live ISO Multiboot 为不同的发行版提供了入口菜单[^1]。

## Rancher OS

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

```
menuentry "Rancher OS v0.8.1" --class ubuntu {
  set isoname="rancheros_0.8.1.iso"
  set isofile="/boot/${isoname}"
  echo "Using ${isofile}..."
  loopback loop (hd0,msdos1)$isofile
  linux (loop)/boot/vmlinuz-4.9.12-rancher 
  initrd (loop)/boot/initrd-v0.8.1
}
```


## Q＆A
### GRUB Live ISO Multiboot	




  [1]: https://i.loli.net/2018/04/18/5ad762904414d.png
  [2]: https://i.loli.net/2018/04/18/5ad762edd6440.png
  [3]: https://i.loli.net/2018/04/18/5ad76303a179f.png
  [^1]: http://git.marmotte.net/git/glim/tree/grub2
  
  [^2]: https://github.com/rancher/os
  
  [^3]: https://linux.cn/article-6424-1.html
  [^4]: 在腾讯云服务器中重装 Windows 系统为 Linux 系统 https://danknest.org/install-linux-on-qcloud-windows-cvm