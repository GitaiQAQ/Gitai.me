---

layout:     post
title:      "修改 CoreOS: 提示和技巧"
subtitle:   "Tips & Tricks"
date:       2017-03-21 01:06:19
author:     "Gitai"
from: 		"https://coreos.com/os/docs/latest/sdk-tips-and-tricks.html"
categories:
    - CoreOS
tags:
    - CoreOS
    - Docker
    - 记录

---

## 找到所有打开的请求和问题

* [CoreOS Issues](https://github.com/issues?user=coreos)
* [CoreOS Pull Requests](https://github.com/pulls?user=coreos)

<!--more-->

## 搜索所有 repo 中的代码

使用 `repo forall`,您可以搜索所有的 Git repo

```
repo forall -c  git grep 'CONFIG_EXTRA_FIRMWARE_DIR'
```

注意:这个可能需要一些时间。

## 基本系统依赖图

获取基本系统将包含的内容以及为什么它将包含那些具有emerge树视图的东西：
```
emerge-amd64-usr --emptytree -p -v --tree coreos-base/coreos-dev
```

## 添加新的上游包

关于为Container Linux提供新软件包的概述：
* 为工作创建一个git分支
* 从上游（Gentoo）获取目标包
* 对Container Linux进行任何必要的更改
* 添加软件包作为coreos-base / coreos的依赖
* 构建包并测试
* 提交更改为git
* 将分支推送到您的GitHub帐户并创建一个pull请求

推送前请参阅 [CONTRIBUTING](https://github.com/coreos/etcd/blob/master/CONTRIBUTING.md) 了解准则。

使用以下 Container Linux 存储库：

* 将在 `src/third_party/portage-stable` 中对未修改的软件包进行版本控制
* 带有 Container 的包 - Linux 特定的更改在 `src/third_party/coreos-overlay` 中进行版本控制

在进行任何更改之前，使用 `repo start` 创建工作分支

```
~/trunk/src/scripts $ repo start my_package_update --all 
```

您可以使用 `scripts/update_ebuilds` 将未修改的软件包提取到 `src/third_party/portage-stable` 并将文件添加到 git。 package 参数的格式应为 `category/package-name` ，例如：

```
~/trunk/src/scripts $ ./update_ebuilds sys-block/open-iscsi
```

修改后的包必须从 `src/third_party/portage-stable` 移出到 `src/third_party/coreos-overlay`。

如果您事先知道上游包中的任何文件将需要更改，该包可以从上游 Gentoo 直接提取到 `src/third_party/coreos-overlay`。  

例如：
```
~/trunk/src/third_party/coreos-overlay $ mkdir -p sys-block/open-iscsi
~/trunk/src/third_party/coreos-overlay $ rsync -av rsync://rsync.gentoo.org/gentoo-portage/sys-block/open-iscsi/ sys-block/open-iscsi/
```

从创建的软件包文件夹同步，所以你不能用 `sys-block/open-iscsi/open-iscsi` 结束它。

快速测试新软件包，使用以下命令

```
~/trunk/src/scripts $ # Manually merge a package in the chroot
~/trunk/src/scripts $ emerge-amd64-usr packagename
~/trunk/src/scripts $ # Manually unmerge a package in the chroot
~/trunk/src/scripts $ emerge-amd64-usr --unmerge packagename
~/trunk/src/scripts $ # Remove a binary from the cache
~/trunk/src/scripts $ sudo rm /build/amd64-usr/packages/catagory/packagename-version.tbz2
```

要在干净重建之前重新创建chroot，请退出chroot并运行：

```
~/coreos $ ./chromite/bin/cros_sdk -r
```

要将新包作为Container Linux的依赖关系，请将该包添加到 `coreos-base/coreos/coreos-0.0.1.ebuild` 中的 RDEPEND 环境变量的末尾，然后通过重命名软链接来增加 Container Linux 的版本 ）：

```
~/trunk/src/third_party/coreos-overly $ git mv coreos-base/coreos/coreos-0.0.1-r237.ebuild coreos-base/coreos/coreos-0.0.1-r238.ebuild
```

当再次运行 build_packages 时，新软件包将作为正常构建流程的一部分进行构建和安装。

如果测试成功，提交更改，推送到您的 GitHub fork 并创建一个 pull 请求。

## 打包参考

参考文献
* Chromium OS [Portage Build FAQ](http://www.chromium.org/chromium-os/how-tos-and-troubleshooting/portage-build-faq)
* [Gentoo Development Guide](http://devmanual.gentoo.org/)
* [Package Manager Specification](https://wiki.gentoo.org/wiki/Package_Manager_Specification)

## 缓存 git https 密码

打开凭证助手，git会在内存中保存您的密码一段时间：

```
git config --global credential.helper cache
```

注意：您需要 git 1.7.10 或更高版本才能使用凭据助手

为什么 Container Linux 在 git 远程数据库中使用 SSH？ 因为我们不能使用 SSH URL 从 GitHub 做匿名克隆。 这将最终固定。

## SSH 配置

你将引导大量的虚拟机与即时ssh密钥生成。 将它添加到您的 `$HOME/.ssh/config` 中，以停止恼人的指纹警告。

```
Host 127.0.0.1
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  User core
  LogLevel QUIET
```

## 从桌面环境中隐藏环路设备

默认情况下，桌面环境会努力显示所有已安装的设备，包括用于构建Container Linux磁盘映像的环路设备。 如果负责此守护程序的守护程序恰好是udisks，那么您可以使用以下udev规则禁用此行为：

```
echo 'SUBSYSTEM=="block", KERNEL=="ram*|loop*", ENV{UDISKS_PRESENTATION_HIDE}="1", ENV{UDISKS_PRESENTATION_NOPOLICY}="1"' > /etc/udev/rules.d/85-hide-loop.rules
udevadm control --reload
```

## 离开开发者模式

一些守护进程在“开发模式”中的行为不同。 例如，update_engine拒绝自动更新或连接到HTTPS网址。 如果你需要在vm上测试dev_mode的东西，你可以这样做：

```
mv /root/.dev_mode{,.old}
```

如果你想永久离开你可以运行以下：

```
crossystem disable_dev_request=1; reboot
```

## 已知的问题

### build_packages 在 coreos-base 上失败

有时 coreos-dev 或 coreos builds 会在 build_packages 中失败，并且 backtrace 指向 epoll。 这没有被跟踪，但运行 build_packages 应该修复它。 错误看起来像这样：

```
Packages failed:
coreos-base/coreos-dev-0.1.0-r63
coreos-base/coreos-0.0.1-r187
```

### 新添加的包无法检查内核源

如果构建失败，可能有必要从ebuild注释掉内核源代码检查，因为Container Linux在构建时尚未提供配置的内核源代码的可见性。 通常这不是问题，但可能导致警告消息。

## 常量和ID

### CoreOS容器Linux应用程序ID
此UUID用于将Container Linux标识为更新服务和其他位置。
```
e96281a6-d1af-4bde-9a0a-97b76e56dc57
```

### GPT UUID类型

CoreOS根：5dfbf5f4-2848-4bac-aa5e-0d9a20b745a6
CoreOS保留：c95dc21a-df0e-4340-8d7b-26cbfa9a03e0