---
layout:     post
title:      "如何运行不可信代码？"
subtitle:	"安全的 IO 隔离"
date:       2020-01-01
author:     "Gitai"
tags:
	- Saas
	- 半虚拟化

---

前一篇写了安全的 JavaScript 沙盘的分析，但是遗留了 IO 这个大问题，和内核调用会受到 ACL 的控制一样；我们平时瞎写的 JS 脚本中，总是缺少不了 `fs`, `net` 这些 IO 库的使用，而这些看上去很随意，实际上包含了对底层硬件的操作行为，所以需要有一定的安全机制。

参考下图，下图上有关的行为都是不应该能直接在运行时中使用的。

![](https://i.loli.net/2020/01/01/SKurGf7kQXwlYmF.jpg)

<!-- more -->

DAC：自主访问控制（Discretionary Access Control）
ACL：访问控制列表（Access Control List）
MAC：强制访问控制（Mandatory Access Control）

比如对文件的访问，写入和执行通过 9 bit 进行控制，也就是储存在 inode 上的 i_mode 位置上；在每次对文件的操作时，都会先检查是否有对应的权限，但是这种权限控制颗粒度不够，比如无法区分用户，没有角色，所以有 ACL 可以给予特定用户或者用户组特定的权限。

最新的就是 NSA 的 SELinux，提供了更为完善的访问控制系统。

参考：[What's The Difference Between POSIX ACLs and SELinux?](https://www.electronicdesign.com/technologies/dev-tools/article/21800662/whats-the-difference-between-posix-acls-and-selinux)

记得写过 Docker 的一篇文章，细说了虚拟化，半虚拟化相关的东西；自然也提到 Docker 配合 SELinux 加强安全性。但是没找到那篇文章，反正就是那么个意思。

使用半虚拟化和全虚拟化方案来隔离不安全代码的运行环境。

参考：[Running untrusted Javascript as a SaaS is hard. This is how I tamed the demons.](https://www.freecodecamp.org/news/running-untrusted-javascript-as-a-saas-is-hard-this-is-how-i-tamed-the-demons-973870f76e1c/)

待细化... 