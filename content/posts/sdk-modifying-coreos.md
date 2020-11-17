---

layout:     post
title:      "修改 CoreOS"
subtitle:   "Modifying CoreOS"
date:       2017-03-12 01:06:19
author:     "Gitai"
from: 		"https://coreos.com/os/docs/latest/sdk-modifying-coreos.html"
categories:
    - CoreOS
    - 翻译
tags:
    - CoreOS
    - Docker
    - 记录

---

这些是构建 Container Linux 本身的说明。 在本指南结束时，您将构建一个可以在 KVM 下运行的开发版映像，并具有用于更改代码的工具。

容器 Linux 是一个开源项目。 所有的容器 Linux 的源都可以在 [github](https://github.com/coreos/) 上。 如果您发现这些文档或代码的问题，请发送pull请求。

直接发问题和建议到[IRC频道](irc://irc.freenode.org:6667/#coreos)或[邮件列表](https://groups.google.com/forum/#!forum/coreos-dev)。

<!--more-->

## 开始

让我们使用 SDK chroot 设置并构建 Container Linux 的可启动映像。 SDK chroot 有一个完整的工具链，并隔离构建过程中与主机系统之间的差异。 SDK 必须在 x86-64 Linux 机器上运行，发行版应该不重要（Ubuntu，Fedora等）。

> 
* mount: docker 环境无法构建，需要特权
* portage: ChromeOS 无法编译
* 需要 ChromiumOS 源码，外网可破

## 先决条件

* curl
* git
* python2

你还需要一个适当的git设置：

```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

> 注意： 在普通用户并不使用 sudo 时配置

## 选项1：使用 Cork

包含在 `CoreOS mantle` 项目中的 `cork` 程序可用于创建和使用 SDK chroot。

为了使用此实用程序，您还必须正确安装和配置 `golang` 工具链。

首先，安装 `cork` 程序：

```
git clone https://github.com/coreos/mantle
cd mantle
./build cork
mkdir ~/bin
mv ./bin/cork ~/bin
export PATH=$PATH:$HOME/bin
```

您可能希望将 `PATH` 导出添加到您的 shell 配置文件（例如 `.bashrc`）。

接下来，可以使用cork实用程序创建SDK chroot：

```
mkdir coreos-sdk
cd coreos-sdk
cork create
cork enter
```

> 注意：`create` 和 `enter` 命令将通过 `sudo` 请求 `root` 权限。要在将来使用 SDK chroot，请从上述目录运行 cork enter。

## 选项2： `repo` 和 `cros_sdk`

### 安装 `Repo`

repo 程序有助于管理构成 Container Linux 的 git 存储库的集合。

对于较新的 Debian，Ubuntu 和其他基于 Debian 的系统，请从发行版仓库安装 repo 软件包：

```
sudo apt-get install repo
```

对于没有打包的 `repo` 的系统，下载它并将其添加到 `$PATH`：

```
mkdir ~/bin
export PATH="$PATH:$HOME/bin"
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
chmod a+x ~/bin/repo
```

您可能希望将 `PATH` 导出添加到 `.bashrc` 或 `/etc/profile.d/`，以便您不需要在每个新 `shell` 中设置 `$ PATH`。

### 引导SDK chroot

创建项目目录。 这将保存所有的 `git repo` 和 `SDK chroot` 。 需要几 GB 空间。

```
mkdir coreos; cd coreos
```

使用描述开始所需的所有 `git repo` 的清单初始化 `.repo` 目录。

```
repo init -u https://github.com/coreos/manifest.git
```

从清单同步所有必需的 `git repo` 。

```
repo sync
```

### 使用 `cros_sdk` 来配置 `chroot`

下载并输入 `SDK chroot`，其中包含所有编译器和工具。

```
./chromite/bin/cros_sdk
```

> 警告：要删除 `SDK chroot`，请使用 `./chromite/bin/cros_sdk --delete` 。 否则，您将删除绑定安装到 `chroot` 中的 `/dev` 条目。

## 使用 QEMU 进行交叉编译

容器 Linux initramfs 是使用 `dracut` 工具生成的。 Dracut 假定它在目标系统上运行，并且只为该 CPU 架构产生输出。 为了为其他体系结构创建 initramfs 文件，dracut 在 QEMU 的目标 CPU 的用户模式下执行。

### 为64位ARM二进制文件配置QEMU

注意，“64位ARM” 通过两种简短的形式被知道：`aarch64`（如在QEMU的配置文件中所见）和 `arm64`（如同 Container Linux 和许多其他发行版如何引用该架构）。

QEMU 二进制文件 `/usr/bin/qemu-aarch64-static` 不希望在主机工作站上。 它会在运行 `dracut` 之前进入 `arm64-usr build chroot`。

配置基于Debian的系统
对于 Debian，Ubuntu 和其他基于 Debian 的系统，安装以下软件包将配置主机系统，使 QEMU 将成为 64位ARM 二进制文件的运行时：

```
sudo apt-get install binfmt-support qemu-user-static
```

配置其他基于 systemd 的系统
在 systemd 系统上，配置文件控制如何处理给定架构的二进制文件。

要将QEMU注册为64位ARM二进制文件的运行时，请在 `/etc/binfmt.d/qemu-aarch64.conf` 写入以下内容

```
:qemu-aarch64:M::\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\xb7:\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff:/usr/bin/qemu-aarch64-static:
```

然后运行:

```
systemctl restart systemd-binfmt.service
```

## 构建镜像

首先通过 `cork` 或 `cros_sdk` 进入 `chroot` 后，应该设置用户核心的密码：

```
./set_shared_user_password.sh
```

这是您将用于登录到使用SDK构建和启动的图像控制台的密码。

### 选择要构建的体系结构

64位 AMD：`amd64-usr` 目标 `--board` 选项可以设置为几个已知的目标体系结构之一，以及系统“板”，以构建给定的 CPU。

要为目录 `/build/amd64-usr/` 下的 `amd64-usr` 目标创建根文件系统：

```
./setup_board --default --board=amd64-usr
```

64位ARM：`arm64-usr` 目标
类似地，对交叉编译的 ARM 目标使用 `arm64-usr`。 如果在单个 SDK 中在不同目标之间切换，可以向后续 `build_packages`， `build_image` 和其他类似命令添加 `--board=` 选项，以选择给定的目标体系结构和路径。

```
./setup_board --default --board=arm64-usr
```

### 编译和链接系统二进制文件

构建所有目标二进制包：

```
./build_packages
```

### 渲染 CoreOS 容器 Linux 映像

基于上面构建的二进制包构建映像，包括开发工具：

```
./build_image dev
```

`build_image` 完成后，它打印用于将原始  `bin` 转换为可引导虚拟机的命令。 运行 `image_to_vm.sh` 命令。

## 启动

一旦你构建一个图像，你可以启动它与 KVM（指令将打印输出 `image_to_vm.sh` 运行后）。

# 进行更改

## git 和 repo

容器 Linux 由 `repo` 管理，`repo` 是一个为 Android 项目构建的工具，使得管理大量的 git 存储库更容易。 从 `repo` 通知博客：

> `repo` 工具使用基于 XML 的清单文件描述上游资源库的位置，以及如何将它们合并到单个工作检查中。 `repo` 将递归所有的 `git` 子树，并处理上传，拉取和其他需要的项目。 `repo` 具有内置的主题分支知识，并使它们成为工作流程的重要组成部分。
(from the [Google Open Source Blog](http://google-opensource.blogspot.com/2008/11/gerrit-and-repo-android-source.html))

你可以通过访问 [`android.com`-开发](https://source.android.com/source/developing.html) 找到完整的手册 `repo`。

## 更新 repo 清单

Container Linux 的 `repo` 清单存在于`.repo/manifests` 中的 git 存储库中。 如果需要更新清单，请在此目录中编辑 `default.xml`。

`repo` 使用一个名为 `default` 的分支来跟踪在 `repo init` 中指定的上游分支，默认为 `origin/master`。 在进行更改时记住这一点，原始 git 存储库不应该有一个“默认”分支。

# 构造镜像

有单独的工作流程用于构建[生产映像](https://coreos.com/os/docs/latest/sdk-building-production-images.html)和[开发映像](https://coreos.com/os/docs/latest/sdk-building-development-images.html)。

# 提示和技巧

我们已经编制了一个[提示和技巧的列表](https://coreos.com/os/docs/latest/sdk-tips-and-tricks.html)，可以使使用SDK更容易。

# 测试镜像

[Mantle](https://coreos.com/os/docs/latest/sdk-testing-with-mantle.html) 是用于测试和启动 SDK 图像的实用程序集合。
