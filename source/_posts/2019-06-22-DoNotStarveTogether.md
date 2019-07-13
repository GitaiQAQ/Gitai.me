---
layout:     post
title:      "饥荒联机版局域网无法连接的问题？"
date:       2019-06-22
author:     "Gitai"
tags:
	- Don`t Starve Together
---

当年饥荒还没出中文版，WeGame 也没出现的时候，给饥荒转了正；但是之后在也没碰过，所以大概上次玩已经是高二的时候，以及之后多买的联机版也一直没送出去；但是第一次玩联机版就遇到了问题，好在官方论坛有了解决方案，而国内的商业推动还是自来水并没有把这个方法搬运进来，所以在此记录一下。

![浏览游戏](https://i.loli.net/2019/06/22/5d0e405a4c7e652300.png)

<!-- more -->

至于那些吹牛逼一言不合防火墙，虽然和国内大环境有关；但是可能真的有点用。如果解决不了才需要继续看

首先，从技术上简单分析一下原因；所有的网络连接，无论远端还是局域网，都是 C/S 架构；而这里的创建服务就是创建了一个服务器，绑定了本地的一个端口，之后将符合约定的协议，比如 TCP 进行解包来完成同步。

所以这里没有可以连接的地址必然发生在这条链路上，然后参照 TCP/IP 协议的层级来确定

* 网络层，能否 Ping 通目标机器
* 传输层，对应协议能否通过对应端口接受和发送数据
* 应用层，游戏版本是否一致，内部传输协议是否一致

一般第一个直接 `ipconfig`，然后 `ping` 就知道是不是 Oj8k 了

第二个就比较复杂了，因为你既不知道绑定的 IP 和 端口，也不知道啥协议。

比如：Minecraft 可以手动输入 IP + 端口给出连接的结果，无法访问？版本不对？这类问题

但是饥荒就没有直接点的入口，至少我那核桃脑子没发现。

但是在官方论坛有这么一个帖子，通过 `don't starve together lan` 关键词，由 Google 推荐 `don't starve together can't connect lan`；然后第一条！

![1561213950579](https://i.loli.net/2019/06/22/5d0e405b256a060363.png)

然后有这么一段内容

> **Method 3:**
>
> If that doesn't work, here's a more technical way to manually connect to a LAN server:
>
> - Who ever is the host, while the game is running on windows go to this location Documents\Klei\DoNotStarveTogether\Cluster_# (where # is the slot number of the host server you picked when you made the server) and inside you'll see a cluster.ini file (open it with notepad). Look for the number associated with master_ip and master_port. There are the numbers your friend should enter.
> - On the friends computer with DST opened, press tilde "~" and enter the following command where IP address = master_ip and port = master_port and include password if you have it:
>
> ```html
> c_connect("IP address", port, "password")
> ```
>
> So for example, if the master_ip = 1.1.1.1 and master_port = 01010 and you didn't use a password, the code your friend should use is:
>
> ```html
> c_connect(1.1.1.1 , 01010)
> ```
>
> And they should be able to start picking a character and play with you! 
>
> Hopefully the first method I mentioned above helps, good luck and have fun. Cheers.
>
> —— [**LAN connection issues**](https://forums.kleientertainment.com/forums/topic/84885-lan-connection-issues/?page=0&tab=comments#comment-979531)

简单描述一下

* 有个 `C:\Users\gitai\Documents\Klei\DoNotStarveTogether\317637636\Cluster_2\Master `类似这样的文件夹，里面有个 `cluster.ini` 文件
* 里面写了 `server_port` 而这就是对应服务的端口号

之后我们可以在进入如下界面时

![1561214267791](https://i.loli.net/2019/06/22/5d0e40997621163024.png)

通过如下命令查看 

```shell
$ netstat -na | grep 10999
  UDP    0.0.0.0:10999          *:*
```

这样我们就知道他使用的是 UDP 协议，并且可以通过 `ip:10999` 访问

至于通没通，就得看其他 UDP 连接测试工具了。

![1561214881628](https://i.loli.net/2019/06/22/5d0e405d86f4e90905.png)

然后在饥荒界面使用 `~` 键（注意输入法输入半角英文），切出终端输入 `c_connect('192.168.11.101', 10999)`，就能直接联机了

