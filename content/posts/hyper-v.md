---
layout:     post
title:      "利用 Hyper-V 直接安装 ArchLinux"
date:       2019-02-03
author:     "Gitai"
tags:
    - Linux
    - 虚拟化
---

Windows 环境都配的差不多了，总有点小问题，WSL 太底层的又没实现；Hyper-V 虽然家庭版给他弄开了，但是没有分布式的共享磁盘支持，还是差了点啥，最后还是装个 Linux 吧。

一般安装其他系统都得走，U盘引导，或者 NT6 硬盘引导，反正各种麻烦；这时候想起来 Hyper-V 可以直接挂载物理磁盘，然后按照标准流程走不就好了，最后在 BIOS 设置启动引导，美滋滋。

而且这样我们可以同时让这个系统，运行在裸机或者 Hyper-V 上，简直太方便（有点厉害）。

> 非常重要的提示！！
>
> 虚拟机记得先关机，再关 Windows；要不从物理机进入 Linux 操作产生的变更，会在下一次启动 Hyper-V 时产生物理储存上的冲突，然后就等着重装吧。。。

<!-- more -->

## 启用 Hyper-V

这是我这穷逼家庭版才需要的操作，专业版直接启用就行了。

忘了我怎么启动的了，反正比网上那个文件简单，一行解决。最后还有和 VM 冲突的问题。

无法启动监控程序，除了网上那卸载重装，还有个最重要的。

```bat
bcdedit /set hypervisorlaunchtype Auto
```

## 脱机物理磁盘

虽然不明白问什么，我的磁盘管理就是没有脱机这个选项，只能求助于 CMD。有个 `diskpart` 的磁盘处理工具。

```bat
Microsoft DiskPart 版本 10.0.17134.1

Copyright (C) Microsoft Corporation.
在计算机上: GITAI-PC

DISKPART> list disk

  磁盘 ###  状态           大小     可用     Dyn  Gpt
  --------  -------------  -------  -------  ---  ---
  磁盘 0    联机              476 GB   868 MB        *
  磁盘 1    脱机              119 GB   117 GB        *
  磁盘 2    联机              931 GB   100 MB        *
  磁盘 3    联机             2048 MB  1984 KB        *

DISKPART> select disk 1

磁盘 1 现在是所选磁盘。

DISKPART> offline disk

虚拟磁盘服务错误:
该磁盘已脱机。
```

大概就是这么个流程，然后就可以去磁盘管理看到磁盘状态变成脱机了。

![](https://i.loli.net/2019/02/03/5c568d03ec809.png)

## 虚拟机绑定

新建虚拟机，注意最后一步，暂时不要创建虚拟磁盘。

然后进入设置，挂载物理磁盘和 Linux 的安装引导光盘。

![](https://i.loli.net/2019/02/03/5c568d84a2862.png)

直接启动会遇到，“提示存在传递硬盘，无法创建检查点” 相关的错误，关闭检查点即可。

![](https://i.loli.net/2019/02/03/5c568e0bd94f7.png)

最后调整启动顺序，默认从 EFI 分区启动；我们需要让他走光驱引导。

![](https://i.loli.net/2019/02/03/5c568ea0547e0.png)

## 分区&格式化

因为我们就挂载了一块磁盘，直接 `parted`，进入磁盘管理。

![](https://i.loli.net/2019/02/03/5c568f957b90d.png)

弄完长这样，处理磁盘大小，如果有不同的参照下面的。

```bash
rm 1 # 删除分区 1
mkpart # 创建新分区
set 1 boot # 设置 esp, boot 标记
```

至于分区格式，不要在这处理，等这完成了，用 `mkfs` 格式化磁盘。

```bash
# 格式化成 ext4
mkfs.ext4 /dev/sda3 

# 格式化成 fat32，efi 分区必要的
mkfs.vfat -F32 /dev/sda1 

# 交换分区
mkswap /dev/sda2
swapon /dev/sda2 
```

之后挂载到 `/mnt`，进入安装流程。

```bash
# 挂载 rootfs
mount /dev/sda3 /mnt

# 创建引导位置
mkdir -p /mnt/boot/efi

# 挂载引导分区，虽然也有挂载到 boot 的，但是为了后面 GRUB 好写，这样容易一些。
mount /dev/sda1 /mnt/boot/efi
```

最后 `pacstrap /mnt base`，安装 Arch Linux。

生成 UUID 或者卷标 `genfstab -U /mnt >> /mnt/etc/fstab`

这时候光盘已经没啥用了，用 `arch-chroot` 将 `/mnt` 设置为根目录。

## 配置系统

参照官方 [Wiki](https://wiki.archlinux.org/index.php/Installation_guide_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

如果最后 `date` 和 `hwclock` 结果不一致，使用 `hwclock -u` 同步。

记住设置密码 `passwd`

可能需要启动 `dhcpcd`，要不下次启动可能没网。

## 生成 GRUB 引导

看看 `ls /boot` 是否存在那几个 `img` 和 `vmlinuz-linux`，没有的话就可能被挂载时覆盖了，通过 `pacman -S linux` 安装。

之后安装 `grub` 和 `efibootmgr`，使用  `grub-install` 安装引导，之后查看 `/boot/efi/EFI/arch` 是否存在。

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

不配置 `grub.cfg` 会进入 mini bash 环境，那就需要手动引导。

重启，完成。

![OJBK](https://i.loli.net/2019/02/03/5c56970e6105e.png)

之后可以在虚拟机继续配置，Hyper-V 没法粘贴（可能我配置问题），可以先装 `openssh`，然后远程进去配置。突然意识到，这样我们就得到一个 Arch Linux 和 Windows 里面的虚拟 Arch Linux，突然有点厉害啊。

## 手动引导

这把直接进去了，写一下大概。

先看环境变量，`prefix` 和 `root`，`prefix` 设置到 `(hd0,gpt3)/boot`， 如果 `linux` 命令存在，直接 `linux /vmlinuz-linux root=/dev/sda3`，然后设置内核 `initrc /initraxxxx `，最后 `boot`。

## 安装后无法识别启动设备

网上那些复制粘贴的，没几个有用的，不是第三方修复工具，就是改 BIOS。

部分 BIOS 固件无法识别，上面的 `/EFI/arch/grubx64.efi`，他们只支持 `/EFI/BOOT/BOOTX64.EFI` 这个硬编码路径。所以如果无法识别（即 UEFI 无法检测到该硬盘），需要复制到上述路径。

```bash
mkdir -p /boot/efi/EFI/BOOT/
cp /boot/efi/EFI/arch/grubx64.efi /boot/efi/EFI/BOOT/BOOTX64.EFI
```

参考 [Troubleshooting UEFI related problems](https://www.qubes-os.org/doc/uefi-troubleshooting/)



## startx 失效

Hyper-V 和 裸机用的不是同一个显卡驱动，而内核内置一个开源的 nvdia 驱动，需要先通过修改启动的内核参数来关闭，`nouveau.modeset=0 rd.driver.blacklist=nouveau video=vesa:off`。

而 Hyper-V 使用的是 `xf86-video-fbdev`

intel 裸机用的是 `xf86-video-intel`

## 奇奇怪怪的 BUG

ERROR: device '' not found. Skipping fsck

[在Arch Linux中禁止生成/boot/initramfs-linux-fallback.img以节省/boot分区空间](https://wusiyu.me/archlinux-remove-initramfs-linux-fallback-img/)

直接使用 fallback 加载就好了，具体缺了啥，有空再看。

而如果在裸机运行之后通过 `pacman -S linux` 更新内核，重新生成 initramfs，这个 initramfs 又会无法在 Hyper-V 上面运行。

应该是虚拟化导致的底层差异。

## 其他杂七杂八

参见 [Archlinux安裝指南（uefi+gpt）](https://huangwenshan1999.github.io/2018/04/01/ArchLinux-install/)
