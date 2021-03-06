---
layout:     post
title:      "分析常见 OJ 沙箱"
date:       2019-01-07
author:     "Gitai"
tags:
    - OJ
    - 沙箱
---

沙箱就是为了隔离各应用，防止对上层系统的破坏。常见 OJ 的破坏方式其实我也不知道，又不打比赛。

姑且做了一点点了解：

1. 恶意系统调用（ptrace， seccomp）
2. 恶意占用资源

即使不看下面这几点，也不难发现这就是常见的虚拟化问题，对此我们有 KVM 和 LXC 这 2 类方法。

<!-- more -->

## LXC

就从 docker 来说说 LXC，先找个镜像解开看看。

```shell
$ mkdir rootfs
$ docker export $(docker create busybox) | tar -C rootfs -xvf -
$ tree rootfs
rootfs
├── bin
│   ├── [
│   ├── acpid
...
│   └── zcip
├── dev
│   ├── console
│   ├── pts
│   └── shm
├── etc
...
├── home
├── root
├── usr
│   └── sbin
└── var
    ├── spool
    │   └── mail
    └── www

21 directories, 405 files
```

熟悉 Linux 的不难发现这就是一个 Linux 的目录结构，LXC 被称之为操作系统层级的虚拟化技术或者半虚拟化也是因此，所有容器公用内核，但是通过命名空间而拥有独立的计算资源（CPU/内存）。

上面的目录则可以通过 chroot 构建一个完全隔离的文件系统，接下来我们操作一下。

```shell
$ sudo chroot rootfs sh
```

网上很多流传的 chroot 使用方法都是默认参数，这样会调用 `/bin/bash`，而 `busybox` 只有 `sh`，于是我们需要手动设定启动参数。之后可以尝试  `cd`,`ls` 之类的命令，现在的根目录就是之前解压出来的 `rootfs`。

之后是计算单元的分配，CGroups 的配置是通过 `/sys/fs/cgroup`[^docker] 的子文件夹来配置的，而 Docker 文件的就在各资源的 `docker` 文件夹下。我们在 `docker run -it -d --cpu-quota=50000 busybox` 运行产生的变更就在对应的 `cpu.cfs_quota_us` 文件里。容器对应的进程 ID。可以通过 `docker top` 命令查看。

```shell
$ tree /sys/fs/cgroup
.
├── 0d3316b7e8f1e14106056cf3e315b97688aa01fb6c8c7d1c3b6a11fd493ead71
│   ├── cgroup.clone_children
│   ├── cgroup.procs
│   ├── cpuacct.stat
│   ├── cpuacct.usage
│   ├── cpuacct.usage_percpu
│   ├── cpu.cfs_period_us
│   ├── cpu.cfs_quota_us
│   ├── cpu.shares
│   ├── cpu.stat
│   ├── notify_on_release
│   └── tasks
├── 32aa806782e33aabca018733f07d39c7ae1dd74f412ec2e3fc6366b1f6f04c24
...
├── 5449d3228792d75bdc21c10395b48925a42db8461b5abfdf14a0ef153f1f5a0d
...
├── cgroup.clone_children
├── cgroup.procs
├── cpuacct.stat
├── cpuacct.usage
├── cpuacct.usage_percpu
├── cpu.cfs_period_us
├── cpu.cfs_quota_us
├── cpu.shares
├── cpu.stat
├── notify_on_release
└── tasks

9 directories, 110 files
```

而后就是 UnionFS，这是实现镜像继承的关键，也是保护宿主机文件系统的关键。之前通过 chroot 创建的不过是个隔离的子文件系统。对其的更改也会同步到宿主机上，而 UnionFS 则可以挂载多个只读层和操作层。

之前提到过恶意的系统调用，在 Docker 中是通过 Seccomp 过滤不安全的系统调用，这个应用在 Linux 3.5 之后被加入内核。

和 Docker 出现同期的还有一个叫 Firejail[^firejail] 的项目，也是运用了类似的技术，Docker 在前些年提出一个 OCI 标准，为了兼容各家的容器化方案，于是整个系统更为冗杂。并不利于只是了解这个技术的具体实现。

不过伴随着模块化 Docker，得到了 Daemon，Containerd，Shim，RunC，Proxy 几个部分，通过 查看进程树，Shim 用于挂载伴随其后的子进程，而 RunC 才是实际操作的工具。Oacle 之前开源了一个微容器服务，其中有个兼容 OCI 的 `railcar`，这也是一个 RunC 的实现，但是可能更为精简和高性能。

## KVM

KVM 作为传统虚拟化的解决方案，相比 LXC 更为安全，隔离性更好。但是一直被人诟病的是重量级，不够轻量。最近几年 FaaS 在 lambda 演算的推进下，催生出新一代的 KVM 技术，但是目前开源的只有 AWS 的 `firecracker`，和上述 Oacle 的 `railcar` 一样均为 Rust 构建。

这类新的微虚拟机只保留必要的功能来增强安全性，比如没有显卡支持。也减少了资源的消耗，官方给出的说明，每个虚拟机仅仅需要 5mb 的内存和 120ms 就能启动。

## OpenJugder

青岛大学开源了一个 Jugder 系统，仅仅是使用了 seccomp 和 setrlimit，以及 Linux 的权限系统。

所以上面都是瞎扯淡，性能都没有这个好，这才是面向这个需求的最好设计。不过用 Rust 写一个 Judger 还行，这个轮子造的还算有意思。


## 参考
[^oj]: https://docs.onlinejudge.me/#/judger/api Judger for OnlineJudge
[^docker]: https://draveness.me/docker Docker 核心技术与实现原理
[^firejail]: https://wiki.archlinux.org/index.php/firejail Firejail
[^emmm]: https://blog.csdn.net/dog250/article/details/81025071 以firejail sandbox解析Docker核心原理依赖的四件套