---

layout:     post
title:      "升级到最新的SSD Firmware"
date:       2014-11-16
author:     "Gitai"
categories:
    - Linux
tags:
    - 记录

---


使用`sudo smartctl -a /dev/sda`命令查看Firmware版本。

[Smartmontools](https://www.smartmontools.org/)

```
sudo apt-get install smartmontools
```

<!--more-->

```
root@debian:/home/i# smartctl -a /dev/sdb
smartctl 6.4 2014-10-07 r4002 [x86_64-linux-3.16.0-4-amd64] (local build)
Copyright (C) 2002-14, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Device Model:     PLEXTOR PX-128M6S+
Serial Number:    P02618107850
LU WWN Device Id: 5 002303 1008be029
Add. Product Id:  SC702040
Firmware Version: 1.00
User Capacity:    128,035,676,160 bytes [128 GB]
Sector Size:      512 bytes logical/physical
Rotation Rate:    Solid State Device
Device is:        Not in smartctl database [for details use: -P showall]
ATA Version is:   ATA8-ACS, ATA/ATAPI-7 T13/1532D revision 4a
SATA Version is:  SATA 3.1, 6.0 Gb/s (current: 3.0 Gb/s)
Local Time is:    Mon Jun 13 16:17:20 2016 CST
SMART support is: Available - device has SMART capability.
SMART support is: Enabled

=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

General SMART Values:
Offline data collection status:  (0x00)	Offline data collection activity
					was never started.
					Auto Offline Data Collection: Disabled.
Self-test execution status:      (   0)	The previous self-test routine completed
					without error or no self-test has ever 
					been run.
Total time to complete Offline 
data collection: 		(   10) seconds.
Offline data collection
capabilities: 			 (0x15) SMART execute Offline immediate.
					No Auto Offline data collection support.
					Abort Offline collection upon new
					command.
					No Offline surface scan supported.
					Self-test supported.
					No Conveyance Self-test supported.
					No Selective Self-test supported.
SMART capabilities:            (0x0003)	Saves SMART data before entering
					power-saving mode.
					Supports SMART auto save timer.
Error logging capability:        (0x01)	Error logging supported.
					General Purpose Logging supported.
Short self-test routine 
recommended polling time: 	 (   1) minutes.
Extended self-test routine
recommended polling time: 	 (  10) minutes.
SCT capabilities: 	       (0x003d)	SCT Status supported.
					SCT Error Recovery Control supported.
					SCT Feature Control supported.
					SCT Data Table supported.

SMART Attributes Data Structure revision number: 1
Vendor Specific SMART Attributes with Thresholds:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  1 Raw_Read_Error_Rate     0x002f   100   100   000    Pre-fail  Always       -       0
  5 Reallocated_Sector_Ct   0x0003   100   100   000    Pre-fail  Always       -       0
  9 Power_On_Hours          0x0002   100   100   000    Old_age   Always       -       0
 12 Power_Cycle_Count       0x0003   100   100   000    Pre-fail  Always       -       2
170 Unknown_Attribute       0x0032   100   100   000    Old_age   Always       -       0
171 Unknown_Attribute       0x0003   100   100   000    Pre-fail  Always       -       0
172 Unknown_Attribute       0x0003   100   100   000    Pre-fail  Always       -       0
173 Unknown_Attribute       0x0003   100   100   000    Pre-fail  Always       -       0
174 Unknown_Attribute       0x0003   100   100   000    Pre-fail  Always       -       2
175 Program_Fail_Count_Chip 0x0003   100   100   000    Pre-fail  Always       -       0
176 Erase_Fail_Count_Chip   0x0003   100   100   000    Pre-fail  Always       -       0
177 Wear_Leveling_Count     0x0003   100   100   000    Pre-fail  Always       -       15
178 Used_Rsvd_Blk_Cnt_Chip  0x0003   100   100   000    Pre-fail  Always       -       0
179 Used_Rsvd_Blk_Cnt_Tot   0x0003   100   100   000    Pre-fail  Always       -       0
180 Unused_Rsvd_Blk_Cnt_Tot 0x0033   100   100   000    Pre-fail  Always       -       880
181 Program_Fail_Cnt_Total  0x0003   100   100   000    Pre-fail  Always       -       0
182 Erase_Fail_Count_Total  0x0003   100   100   000    Pre-fail  Always       -       0
183 Runtime_Bad_Block       0x0032   100   100   000    Old_age   Always       -       0
184 End-to-End_Error        0x0033   100   100   000    Pre-fail  Always       -       0
187 Reported_Uncorrect      0x0003   100   100   000    Pre-fail  Always       -       0
188 Command_Timeout         0x0032   100   100   000    Old_age   Always       -       0
192 Power-Off_Retract_Count 0x0003   100   100   000    Pre-fail  Always       -       2
195 Hardware_ECC_Recovered  0x0003   100   100   000    Pre-fail  Always       -       0
196 Reallocated_Event_Count 0x0003   100   100   000    Pre-fail  Always       -       0
198 Offline_Uncorrectable   0x0003   100   100   000    Pre-fail  Always       -       0
199 UDMA_CRC_Error_Count    0x0003   100   100   000    Pre-fail  Always       -       0
232 Available_Reservd_Space 0x0003   100   100   010    Pre-fail  Always       -       0
233 Media_Wearout_Indicator 0x0003   100   100   000    Pre-fail  Always       -       0
241 Total_LBAs_Written      0x0003   100   100   000    Pre-fail  Always       -       0
242 Total_LBAs_Read         0x0003   100   100   000    Pre-fail  Always       -       0

SMART Error Log Version: 0
No Errors Logged

SMART Self-test log structure revision number 1
No self-tests have been logged.  [To run self-tests, use: smartctl -t]

Selective Self-tests/Logging not supported

```

## 下载 & 刻录CD/DVD至U盘

[Debian 光盘](https://www.debian.org/CD/) / [USTC](https://mirrors.ustc.edu.cn/)

升级到最新的 Linux 发行版本（主要是Kernel）

自Linux内核版本3.7起，以下文件系统支持 TRIM: Ext4, Btrfs, JFS, VFAT, XFS.

但常用发行版只有 Arch Linux 的内核 >= 3.7

Ext4: 2.6.37
XFS: 3.0
Btrfs: 支持 SSD mountc参数，但是本身文件系统的稳定性不高

查看当前发行版的内核发行号
```
uname -r
```

打印设备信息 `lsblk`
```
i@debian:~$ lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
fd0      2:0    1     4K  0 disk 
sda      8:0    0 464.4G  0 disk 
├─sda1   8:1    0   9.3G  0 part /
├─sda2   8:2    0     1K  0 part 
├─sda5   8:5    0     4G  0 part [SWAP]
└─sda6   8:6    0 451.1G  0 part /home
sdb      8:16   0 119.2G  0 disk 
sdc      8:32   0   7.5G  0 disk 
└─sdc1   8:33   0   7.5G  0 part 
```

### 烧录镜像
```
dd bs=block_size if=/path/to/linux.iso of=/dev/sdx && sync
```
用U盘替换 `/dev/sdx`，如 `/dev/sdb`。

```
dd if='/home/i/下载/debian-live-8.5.0-amd64-gnome-desktop_16-44-55.iso' of=/dev/sdc bs=4M && sync
```

`dd` 命令还可以用于测试设备写入/读取速度



[Windows & 其他环境](https://wiki.archlinux.org/index.php/USB_Flash_Installation_Media)

## 优化SSD
1. 更换低延迟磁盘调度策略
2. 修改fstab文件，在挂载参数中加上discard；最好也同时加上noatime。
3. 禁用日志功能
4. 开启BIOS AHCI
5. 加RAM，用RAMDISK明显提升性能，增加寿命
6. TLC 相关评测比较少，先观望
7. 不要做碎片整理操作Defragmentation
8. 不建议开启hibernation休眠功能，因为会有大量的数据读写。但是从笔记本使用角度来说，还是开着吧，关了也要操作很多配置。
9. 开启磁盘的TRIM功能
10. 分区对齐
11. 减少SWAP读写频率
12. 定期检查SSD状态，并做数据备份

## 参考
2. [Linux环境下的SSD优化](http://www.jianshu.com/p/nQpqsN)
3. [Solid State Drives](https://wiki.archlinux.org/index.php/Solid_State_Drives)
4. [Linux SSD TRIM setup – ubuntu/debian](http://joao.machado-family.com/2014/04/01/linux-ssd-trim-setup/)
5. [固态硬盘装系统注意事项](http://www.expreview.com/tag/gutaiyingpanzhuanxitong.html)
6. [Linux 系统下使用 ssd 固态硬盘](http://www.looeo.com/linux-systems-use-the-ssd/)
7. [SSD (固态硬盘)-Linux Wiki](http://linux-wiki.cn/wiki/zh-hans/SSD_(%E5%9B%BA%E6%80%81%E7%A1%AC%E7%9B%98))
8. [Linux系统中使用 DD 命令测试 USB 和 SSD 硬盘的读写速度](https://linux.cn/article-3696-1.html)
9. [Reduction of SSD write frequency via RAMDISK](https://wiki.debian.org/SSDOptimization#Reduction_of_SSD_write_frequency_via_RAMDISK)