---

layout:     post
title:      "ChromiumOS 快速开始指南"
subtitle:   "Chromium OS SDK Creation"
date:       2017-03-23
author:     "Gitai"
from: 		"https://www.chromium.org/chromium-os/build/sdk-creation"
categories:
    - ChromiumOS
    - 翻译
tags:
    - ChromiumOS
    - 记录

---

## 介绍
Chromium OS 项目有一个开发者工具包来提供一个独立的环境来构建目标系统。

当你使用它，它只是一个 Gentoo/Linux  chroot，有很多构建脚本，以简化和自动化的整体构建过程。

<!--more-->

### 预构建流

当你第一次运行 `cros_sdk` (在 [chromite/bin/](https://chromium.googlesource.com/chromiumos/chromite/+/master/scripts/cros_sdk.py)) ，它自动下载已知最新的版本，以及在 `chroot/` 文件夹解包(从 Chromium OS 源码检出)

版本信息储蓄于：

```
src/chromiumos-overlay/chromeos/binhost/host/sdk_version.conf
SDK_LATEST_VERSION="2013.11.16.104134"
```

在 Chromiumos-sdk Google 储存仓库中检索原始那码存档。

为了更多信息，参见

```
https://commondatastorage.googleapis.com/chromiumos-sdk/cros-sdk-2013.11.16.104134.tar.xz
```

### 引导

你可能惊讶于鸡&蛋问题。如何创建一个预构建工具原始码？我们每天都这么做，实际上是一个新功能:如果工具包自己通过提交来打破，如何简单的探索？为了避免这些，我们有完整引导并且运行于 Chromium OS 工作流的 Chromium-sdk 机器人配置。

但是我们依然从引导开始。为了这些我们转向 gentoo。被称为 stage3 原始码释出进程。

它是一个完整的(虽然基本上) gentoo chroot 是被使用来安装gentoo。
我们使用它从0开始创建chromiumos开发者工具。然后我们打包结果并且发布在公开储存上。

如果整个 SDK 生成失败，那么我们不会刷新 SDK，并且发布对开发人员保持稳定的文件。

### 概览

总体流程:

* 下载已知最新的 gentoo stage3
* 更新/安装/移出我们需要的开发工具(比如 git)
* 我们关心于构建所有的跨编译器
* 从0开始构建“amd64-host”(sdk 的旧名字)
* 安装所有跨平台编译器在新roo
* 使用简单的 Chrome 工作流生成独立的跨平台编译器的副本(还有其他一些东西)
* 构建一部分来验证最新构建工具
* 上传所有的二进制包，跨编译器和 SDK

### gentoo stage3

我们抓取 gentoo stage3 原始码的副本，并且发布到 Google 储存仓库

最新已知版本的 stage3 储存于

```
src/third_party/chromiumos-overlay/chromeos/binhost/host/sdk_version.conf
BOOTSTRAP_LATEST_VERSION="2013.01.30"
```

在 Google 储存库中查找原始码，参见 https://commondatastorage.googleapis.com/chromiumos-sdk/stage3-amd64-2013.01.30.tar.xz

我们能简单的解包，并且使用我们的构建脚本来 chroot

### 更新基础包

现在我们运行 [`make_chroot.sh`](https://chromium.googlesource.com/chromiumos/platform/crosutils/+/master/sdk_lib/make_chroot.sh) 脚本(在 src/scripts/sdk_lib/)来响应安装/移出/升级关键包。

确保安装/移出/更新包以正确的顺序来避免冲突和依赖循环。我们还可以添加各种中间 hack，因为我们在叠加中升级的包的版本与 stage3 中发现的版本相差更远，但是最好只是在可能的情况下更新基本 stage3 版本。

有关详细信息，请参阅本页结尾。

然后运行正常的 [update_chroot](https://chromium.googlesource.com/chromiumos/platform/crosutils/+/master/update_chroot) 脚本，安装SDK中通常存在的所有软件包（[virtual/target-sdk](https://chromium.googlesource.com/chromiumos/overlays/chromiumos-overlay/+/master/virtual/target-sdk) 元软件包）。

### 跨编译器构建

构建机器人进程在运行 [`cros_setup_toolschains`](https://chromium.googlesource.com/chromiumos/chromite/+/master/scripts/cros_setup_toolchains.py) 来生成所有被标记在sdk中的的工具链(参见 toolchain.conf 文件来了解更多)

### 构建 amd64-host

现在我们有 chroot，看起来像是 Chromium OS SDK，我们能够继续并且从0开始构建 Chromium OS SDK。

我们这样做是为了验证最新的本地工具链是否正常，以便我们可以生成一个原始的 SDK，没有随时间的随机垃圾累积（像在当前 chroot 中找到的所有 `temp/` 生成的文件）。

这一步完成只需要下面这一句:

```
./setup_board --board=amd64-host --skip_chroot_upgrade --nousepkg --reuse_pkgs_from_local_boards
```

如果熟悉正常的 Chromium OS 流，察觉到这一步非常像运行 `setup_board` 和 `build_packages` 。

可以说，它不应该这样做，但今天无关紧要，去清理它。
这意味着，他将花费一会来结束(正如从源码构建几百个包)，每件事将被写入 `/board/amd64-host`。

### 打包sdk

现在 SDK 被完成并且有我们想要的任何事，我们创建 SDK 原始码包。我们不立刻上传它，只是它没有被测试。

### 生成独立交叉编译器

由于我们的交叉编译器非常有用，我们希望能够自己使用它们。换句话说，没有完整的 Chromium OS 源结算和 SDK 的开销。

有了一些技巧，我们可以完成这一点。它复制工具链本身使用的所有主机库，生成包装器脚本，以便可以找到库的本地副本，然后处理所有路径，使它们独立。

交叉编译链脚本 [`cros_setup_toolchains`](https://chromium.googlesource.com/chromiumos/chromite/+/master/scripts/cros_setup_toolchains.py) 有完整的逻辑

### 测试sdk

我们要确保 SDK 的构建正确可用。这从释出工具链帮助我们更新(比如gcc)是可怕的破坏(比如不能编译和链接)。

为了测试这些，我们简单的使用 SDK 原始码更早的构建新 chroot。这也验证从这个 SDK 中创建新 chroot 普通开发者工作流。

包含新 chroot，我们为普通的一对平台做普通的构建流。现在，意味着这几个主流平台之一(比如: amd64-generic-full，arm-generic-full和x86-generic-full)。我们通过只运行 setup_board+build_packages;没有单元测试或者其他东西(正如当前历史表示它不是必要的)

### 发布 SDK

当所有的测试通过，我们继续并且上传结果

* sdk原始码
* 独立交叉编译原始码
* 为 chroot 的原始码

### 更新 stage3

stage3 伴随时间刷新。这是一个基本上是机械的过程。 它归结为：

* 从[上游 Gentoo](http://www.gentoo.org/main/en/where.xml) 选择一个新的 stage3（查看amd64 stage3s）
* 确保它使用 xz 压缩，而不是 bzip2
* 将其上传到 chromiumos-sdk 仓库
* 在 [`src/chromiumos-overlay/chromeos/binhost/host/sdk_version.conf`](https://chromium.googlesource.com/chromiumos/overlays/chromiumos-overlay/+/master/chromeos/binhost/host/sdk_version.conf) 文件中更新引导版本
* 运行一些chromiumos-sdk远程trybot配置
* 查看 InitSDK 阶段日志并查找降级的软件包（“[ebuild UD]”行）
* [升级所有相关包](https://www.chromium.org/chromium-os/gentoo-package-upgrade-process)
根据需要更新 [`make_chroot.sh`](https://chromium.googlesource.com/chromiumos/platform/crosutils/+/master/sdk_lib/make_chroot.sh) 脚本（清除旧的 hacks，添加新的等等...）
* 重复过程，直到 InitSDK 阶段工作
* 一旦整个 bot 配置通过，你的工作就完成了