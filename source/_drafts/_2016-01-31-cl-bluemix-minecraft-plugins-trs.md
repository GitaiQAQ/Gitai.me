---

layout:     post
title:      "使用 Bluemix、Docker 和 Watson 为 Minecraft 创建认知插件"
date:       2016-01-31 10:23:52
author:     "Gitai"
header-img: "img/minecraft-in-docker.jpg"
from: "http://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-docker-trs-1"
categories:
    - Minecraft
    - Docker
tags:
    - Minecraft
    - Bluemix
    - Watson
    - Spigot
    - 容器
    - 插件
    - Docker
    - Disease
    - Java
    - 记录

---

> 哪个 Java™ 程序的使用频率比其他任何 Java 程序高整整一个数量级？ 提示： 自 2009 年发布 beta 版本以来，该程序已售出了 7000 多万个副本。Microsoft 最近以 25 亿美元收购了创建这个程序的公司。围绕此程序已经形成了一个庞大的开发生态系统，而且数十万的人受到鼓励开始学习 Java 编程 — 以便可以开发此程序的扩展版本。
> 您从标题中可能已经猜到，这个程序就是 Minecraft 游戏，令人惊奇的是，这数十万开发人员主要是儿童和青少年。Minecraft 已成为市场上的一次现象级成功，部分原因在于它的独特结构：您可以通过商业渠道购买客户端（游戏的外观），但服务器可以自由扩展。任何人都可以启动自己的游戏服务器，这使得人们在根据自己的兴趣和好恶在网络上建立独特的 Minecraft 构建者社区时，拥有数千种不同的选择。

<!--more-->

关于本系列

* 设置您的本地 Minecraft 和 Docker 开发环境，开始在您自己的服务器上使用 Minecraft。
* 设置您的本地 Eclipse 开发环境，然后开发、构建您自己的服务器端 Minecraft 插件，并将导出到一个本地 Docker 镜像中。
* 将 Docker 镜像部署到 Bluemix，然后运行它们，使用它们作为可通过云访问的 Docker 容器。
* 使用一个插件扩展 Spigot 服务器，该插件使用 Bluemix 上的 Watson 认知服务为您的游戏体验添加了一些科学性。

但该服务器既可以供您下载来启动您自己的服务器，也可以由想要为游戏构建自己的加载项的人进行扩展。在本系列中，我将展示如何利用 Minecraft 插件开发来传授一些特定的开发技术和原则。

您将了解如何轻松测试您在本地编写的插件，然后获取完全相同的配置，并在您的好友（“公测人员”）可以访问和试用的云服务器上原封不动地运行它。您将使用两种特定的技术完成这项任务：Docker 和 IBM Bluemix 容器，在此过程中，您还将了解如何设置 Eclipse 和 Bluemix DevOps Delivery Pipeline 服务来构建您的插件，甚至是如何使用 git 设置团队开发。

# 第 1 部分: 在 Docker 内运行 Minecraft

## Docker、Bluemix 和容器简介

在深入介绍之前，我将向任何可能熟悉 Minecraft 和 Java，但不熟悉 Docker 和 Bluemix 的读者解释一下我刚才提到的过程。在第一篇教程中，我将重点介绍如何在 Docker 中设置本地 Minecraft 服务器，所以我们首先将介绍 Docker。

通过一个比喻或许能让您更好地理解 Docker。Docker 通常被称为 “代码的运输集装箱”。那么这是什么意思？想想运输集装箱是什么（您总是会看到它们），它们是您在卡车、货车车厢上看到的长方体金属箱子，尤其是在港口之间运输数百个集装箱的称为集装箱云货船的大型船舶上的那些长方体金属箱子。

运输集装箱改变了货物在国家之间转运的方式。我们假设您在制造智能电话。您希望将数千台手机从韩国的工厂转移到位于加拿大多伦多的电子商店。过去，在卡车之间和船舶之间转移时，这些装电话的盒子可能会被装箱和拆箱数十次，在运输途中的仓库中停留多次。每次堆叠和卸下一个盒子时，它们都有可能被损坏或丢失。此外，堆叠和卸下这些货物既耗时又耗钱。如今，手机盒在工厂中一次性地装载到一个大型的钢制集装箱中，该集装箱由起重机从卡车转移到船上，再转移到卡车上，最后转移到电子商店 — 在任何时候都不会拆箱或打开。

Docker 对代码执行同样的操作。我们如今构建和运行代码（比如 Java）的方式是，在开发环境中开发您的代码。然后将源代码转移到另一个系统，该系统将编译您的代码并将它 “构建” 到一个可运行的系统中（一个 WAR 文件或 JAR 文件）。但是，这个可运行的代码需要大量基础架构（比如一个特定的 Java 运行时，或者一个特定的应用服务器，以及大量开源 JAR 文件）才能运行。所以这些事物都需要转移到您的单元测试服务器、您的系统测试服务器和您的每个生产服务器中，一次又一次地重新组装。每个阶段都带来了某个事物可能在 “装箱和拆箱” 步骤中出错的可能性。您可能选择了某个事物的错误版本，或者您可能在此过程中忘记某个事物 — 导致可能很难跟踪的错误。

Docker 允许您将整个运行系统（一直到操作系统）打包到一个轻便的包中（毫不奇怪，这个包也称为容器），然后您将在不同地方转移这个包。在转移它时，未留下任何事物，也未破坏任何事物。

Bluemix 在这方面提供了方便，使您能够获取您的 Docker 容器，不仅能在本地机器上运行它们，还能在云中运行它们，供其他人访问。IBM Bluemix 容器为您提供了实现此目的的一种简单方法。

在这个教程系列中，我们将重点介绍的前两件事是，如何让一个 Minecraft 服务器在 Docker 本地运行，然后如何让同一个 Docker 容器在 Bluemix 中运行。

## 购买并安装 Minecraft 客户端

正如我早先提到的，Minecraft 的特征是，他们向数百万玩家销售客户端并开放了源代码，所以用户可以扩展该游戏，并为了获得多用户游戏体验而设置 Minecraft 服务器。您需要执行的第一步是购买并安装 Minecraft 客户端。可以在 Minecraft 网站 上找到在大多数操作系统上安装该客户端的说明。

我们将在 Ubuntu 中开发和运行我们的服务器，但您可以在任何受支持的操作系统上运行 Minecraft 客户端。您只需要知道该服务器的 IP 地址，而且您的客户端需要能够连接该 IP 地址。事实上，我购买了本机 Mac Minecraft 客户端，然后从该客户端连接到在我桌面上的一个 VMWare 虚拟机中运行的开发服务器。

## 安装并配置 Docker

您需要做的下一件事是下载并配置 Docker 以及让整个指令集发挥作用所需的其他软件。我们从 Docker 开始介绍。在本系列中，我将展示如何为 Ubuntu Linux 14.03.3 LTS 安装和配置它。如果您希望在不同的操作系统上执行此操作，请参阅针对相应平台的 Docker 安装说明 。

尽管我们使用的是 Ubuntu 14.04.3 LTS，但您可以使用任何同时支持 Docker 和来自 Cloud Foundry 和 IBM 的 Cloud Foundry 工具的操作系统，包括 Windows 和 Linux。我推荐使用 Ubuntu，因为根据我的经验，在 Linux 中直接执行这种开发既更干净，又更简单。幸运的是，在其他任何操作系统中，很容易在 VMWare 或 VirtualBox 中下载和创建 Linux 镜像，所以我推荐您以此为基础来执行操作。在这么做时（或者如果您刚将 Ubuntu Linux 安装在硬件上），我还推荐将它配置为使用至少 2GB RAM 和 2 个核心 — 任何比此更低的配置都可能导致以后执行的一些构建失败。

在此示例中，我将展示如何在一个 VMWare 环境中运行的 Ubuntu 镜像内配置和运行 Docker。如果您选择使用 Virtualbox 或另一个虚拟机管理程序，那么在 Ubuntu 外执行的一些任务可能稍微不同。

## 在 Ubuntu 中安装 Docker

1.将以下命令输入到 Ubuntu 中的 “终端” 应用程序来安装 Docker 1.7.0：

```
wget -qO- https://get.docker.com/ | sed 's/lxc-docker/lxc-docker-1.7.0/' | sh
```

2.第一个命令会下载 Docker 并将它安装到 Ubuntu 中。但是，在默认安装中，Docker 要求您使用 root 用户特权运行 Docker 命令。为了避免这么做并使用不同的 id，可以运行下面这个命令：

```
sudo usermod -aG docker <your nonroot login id>
```

3.发出该命令后，退出 Ubuntu 并重新登录。

## 安装 Cloud Foundry 命令行工具

接下来，需要安装 Cloud Foundry 命令行工具。我们不会在第一篇教程中使用它们，但在第三篇教程中将会开始使用它们，现在，在设置您的 Ubuntu 镜像时安装它们是一个好主意。如果在其他任何平台上，则需要转到 GitHub ，在您的浏览器中安装正确的工具，但此过程适用于 Ubuntu。

1.在命令行上，键入下面这行命令来下载 Cloud Foundry 命令行工具：

```
wget "https://cli.run.pivotal.io/stable?release=debian64&version=6.12.3&source=github-rel" -O cf-cli_amd64.deb
```

2.在命令行上键入以下命令来安装这些工具：

```
sudo dpkg -i cf-cli_amd64.deb
```

3.安装用于 Cloud Foundry 工具的 IBM 插件，它将使您能够在以后上传和运行 Docker 镜像。为此，在 Ubuntu 中键入以下命令：

```
cf install-plugin https://static-ice.ng.bluemix.net/ibm-containers-linux_x64
```

4.在安装 IBM Containers 插件后，需要重新启动 Docker。为此，在您的终端中发出下面这条命令：

```
sudo service docker restart
```

5.下载并安装 Docker 以及用于 Docker 的 Cloud Foundry 工具后（它们使您能够对二者执行一些有趣的操作！），就可以下载示例代码了，我们将在这篇教程和接下来的两篇教程中介绍该示例。示例代码包含在 git 中，您可使用下面这个命令下载它：

```
git clone  https://github.com/kgb1001001/minecraft-project.git
```

## 关于基本的 Minecraft Dockerfile

您可以通过两种不同方法运行 Docker。可以在 Docker 中启动一个容器并开始使用它，然后开始对运行的容器执行一些更，改并将更改保存为新镜像文件。但是，您需要记住，我们对 Docker 感兴趣的原因之一是，它可以避免执行手动更改所带来的问题，所以该方法对我们没有实际帮助！我们将使用同样受 Docker 支持的一种不同方法，那就是 Dockerfile。Dockerfile 是一组以可重复方式构建镜像的命令。通过这种方法，但您在不同的机器上执行 Dockerfile 时，您始终会获得完全相同的结果。可以将它视为一个 “提货单”，它告诉您 Docker 镜像中（以及您构建的容器中）包含的内容。

我们的第一个 Docker 文件的用途是看看在 Docker 本地正常运行一个 Minecraft 服务器有多容易。所以让我们首先看看 Dockerfile。要查看 Dockerfile，可以键入以下命令：

```
cd minecraft-project cat minecraft/dockerfile
```

Dockerfile 的内容如下所示。我们一次分析一部分内容。

```
# Version 0.0.1
# This docker file builds a basic minecraft server
# directly from the default minecraft server from Mojang
#
FROM ubuntu:14.04
MAINTAINER Kyle Brown “brownkyl@us.ibm.com”
RUN apt-get update
RUN apt-get install -y default-jdk
RUN apt-get install -y wget
RUN mkdir minecraft
RUN wget -O minecraft/minecraft_server.jar \ 
https://s3.amazonaws.com/Minecraft.Download/versions/1.8.3/minecraft_server.1.8.3.jar
RUN echo "eula=true" > eula.txt
CMD java -Xms512m -Xmx1024m -jar minecraft/minecraft_server.jar nogui
EXPOSE 25565
```

* Dockerfile 中的第一个命令（在一些以井号为前缀的有帮助的注释之后）是 `FROM` 。它显示这个 Docker 镜像是从哪个镜像构建而来的。Docker 的一个优势是，您可以使用其他镜像来构建镜像，所以如果其他人希望获取您的镜像并以某种方式扩展它，很容易在一些限制内完成此任务。在我们的例子中，我们从来自 Dockerhub 存储库的最新的 Ubuntu 14.04 镜像构建该 Docker 镜像。
* `MAINTAINER` 显示谁负责编写和维护此文件。
* 接下来的 3 个命令很有趣。 `RUN` 命令的作用是在 Linux 命令行上执行一个命令。我在接下来的 3 个命令中所做的事是，将当前的 Ubuntu 镜像更新到来自 Ubuntu 的最新的修复程序和更新集，然后安装默认的 Java JDK 和 wget 实用程序。接下来，我创建了一个名为 minecraft 的目录，并从托管 minecraft_server.jar 文件的 Amazon S3 存储网站下载它，然后将它放在 minecraft 目录中。
* 我的下一条命令是创建一个名为 eula.txt 的文件，它显示此服务器的用户已接受 `EULA` 协议。
* 现在我们已经涉及到了我们想执行的操作的核心。在这个 `Dockerfile` 创建的 Docker 镜像运行时， `CMD` 指令执行 `CMD` 关键字后的所有内容。这很重要 — RUN 指令在构建 `Dockerfile` 后或从一个包含指令的 `Dockerfile` 转换为最终的 Docker 镜像后立即执行。 `CMD` 指令在您实际启动从此镜像创建的容器后才会执行。
* 最后一个指令是 `EXPOSE` 。 `EXPOSE` 关键字指出了在 Docker 容器运行时，应该可以从外部访问在 Docker 容器内查看的哪些 `TCP/IP` 端口。默认情况下，无法访问 Docker 容器内的任何端口 — 这意味着它们在默认情况下是安全的，您需要选择想要公开的端口和公开的时间。

正如我早先提到的，获得一个运行的容器需要两步：将 Dockerfile 构建到镜像中，然后以容器形式运行该镜像。但首先，您需要确定您的 Docker 存储库的名称。我通常使用与 Ubuntu 中的登录名相同的名称，所以只要您在后面的指令中看到 <directory>，即可将它替换为您的登录 id（例如，我的是 “kbrown”）。

正如我早先提到的，获得一个运行的容器需要两步：将 Dockerfile 构建到镜像中，然后以容器形式运行该镜像。但首先，您需要确定您的 Docker 存储库的名称。我通常使用与 Ubuntu 中的登录名相同的名称，所以只要您在后面的指令中看到 <directory>，即可将它替换为您的登录 id（例如，我的是 “kbrown”）。

1.我们首先在终端发出以下命令：

```
cd minecraft sudo docker build -t="<directory>/minecraft188" .
```

请注意，最后一条命令末尾的点 (.) 很重要。此命令通过当前 (".") 目录中找到的 Dockerfile 内的指令创建一个全新的镜像 — 这是我们之前看到的同一个 Dockerfile。

这导致所有步骤一次执行一个，并输出一些有关这些步骤的中间信息。依赖于您的网络连接速度，此命令可能花几分钟或更长时间，因为 Dockerfile 中的许多命令（比如 apt-get 命令）需要将该软件的新版本下载到您的 Docker 镜像中。如果该命令正常执行，您在成功执行 `RUN java -jar minecraft/BuildTools.jar`后应看到的最后一行是：

```
Successfully built 764c25d251f6
```

请注意，您的消息末尾的 12 位 id 将不同，但您希望看到 "Successfully built" 消息。

2.现在是揭示真相的时刻了 — 我们准备查看您是否能够在 Docker 中运行 Minecraft 服务器！要尝试此操作，可以发出下面这条命令，同样用您的登录名替换 <directory>。

```
sudo docker run -i -t -p=25565:25565 <directory>/minecraft188
```

完成后，您会在控制台底部看到一条类似这样的消息： 

```
[14:10:43] [Server thread/INFO]: Done (6.086s)! For help, type "help" or "?"
```

3.我们几乎可以认为我们可以尝试在 Docker 中运行我们的新 Minecraft 服务器了，但我们还需要找到一条信息。您在 VMWare 中运行虚拟机时，它在对您的主机机器可见但对其他所有机器不可见的一个网络地址上运行。但是，为了连接任何在该网络地址上运行的程序，您需要先找到它。因为我们当前的终端窗口正在 Docker 中运行 Minecraft，所以请转到 Ubuntu Terminal 的 File 菜单并选择 `Open Terminal` 来打开另一个窗口。

4.在第二个终端窗口中，键入下面这条命令：

```
ifconfig eth0 | grep “inet addr”
```

执行该命令时，您会看到类似以下输出的信息：

```
inet addr:172.16.103.242  Bcast:172.16.103.255  Mask:255.255.255.0
```

紧挨 `inet addr`:

之后的网络地址是我们将在主机操作系统上的 Minecraft 客户端中用来连接我们的新服务器的地址。

## 设置 Minecraft 客户端

现在到有趣的部分了！

1.启动您的 Minecraft 客户端，单击第一个屏幕上较大的开始按钮（该屏幕提供了即将发布的版本等信息）。

2.在随后的 Minecraft 启动屏幕中，选择 `Multiplayer` 。

![Index-Minecraft 1.8.8](http://www.liuhaihua.cn/wp-content/uploads/2015/12/6niMRzF.jpg)

3.在随后的 Play Multiplayer 屏幕上，单击 `Add Server` 。

![Multiplayer-Minecraft 1.8.8](http://www.liuhaihua.cn/wp-content/uploads/2015/12/viymUzB.jpg)

4.在 `Add`（或 `Edit`）Server Info 屏幕上，输入您早先在您的 VM 中找到的 IP 地址，确保在服务器 IP 网络地址末尾添加了 `:25565` （25565 是我们从 Docker 容器公开的端口）。

![Add Server Info-Minecraft 1.8.8](http://www.liuhaihua.cn/wp-content/uploads/2015/12/2uiEJjA.jpg)


5.单击 `Done` ，然后在 `Play Multiplayer` 屏幕上单击 `Join Server`

6.玩一段时间的游戏，或许在 Minecraft 中搭建了一些物体并杀死一些怪物后，您可以转到（Docker 中）运行您的服务器的 `Ubuntu Terminal` 窗口，按下 `control+C` 结束 Docker 容器。

## 关于 Spigot Dockerfile

能够像上面这样托管您自己的本地 Minecraft 服务器显然很有趣，但这不是本教程系列的重点。问题在于，由于 Minecraft 直接来自 Mojang，所以它在服务器端的扩展能力不是很强。 本系列文章想要展示的是如何利用 Bluemix 提供的一些 Watson 服务，这意味着我们需要一个可以修改的 Minecraft 服务器。在 2010 年，一组开发人员为这个服务器构建了一个 API — 他们将这个 API 称为 Bukkit API，它允许您将自己的扩展构建为 Minecraft 插件。Bukkit API 有许多实现，但最常用的是 Spigot 实现。Spigot 不仅是最常被修改的 Minecraft 服务器版本，而且它还通过多种改进来实现更高的效率和更高的性能。

我们将使用 Spigot 作为我们的服务器，所以剩余的示例没有基于前面的示例中的通用 Minecraft 服务器，我们将使用 Spigot 服务器继续我们的介绍。检查下面给出的 Dockerfile，看看它的区别，以了解如何实现此目的。

请注意，这个 Dockerfile 中的命令是从 Spigot 网站 上的构建指令修改而来的。如果您在这个 Dockerfile 中遇到问题，这或许是由于更改所致，请返回参阅该页面 — 它是有关如何构建 Spigot 服务器的信息的权威来源。

我们将查看新的 Dockerfile：

```
# Version 0.0.2
# This version builds a spigot server
# using the recommended build strategy for spigot
# This is advantageous in that it’s better for plugin development
# and fits well with the Docker approach
#
FROM ubuntu:14.04
MAINTAINER Kyle Brown “brownkyl@us.ibm.com”
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y default-jdk
RUN apt-get install -y wget
RUN mkdir minecraft
RUN wget "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar
RUN git config --global core.autocrlf input
RUN java -jar minecraft/BuildTools.jar
RUN echo "eula=true" > eula.txt
CMD java -XX:MaxPermSize=128M -Xms512m -Xmx1024m -jar spigot-1.8.8.jar nogui
EXPOSE 25565

```

此文件的某些方面看起来应该很熟悉，因为它们与我们早先查看的基本 Minecraft 服务器示例相同。例如，更新 Ubuntu Linux 和安装默认 JDK 的命令是相同的。但是，这个 Dockerfile 还安装了 git 工具，我们已在 Linux 中使用过该工具。

真正的变化发生在执行 `wget` 从 SpitgotMC 服务器（而不是托管普通的 Minecraft 服务器的 Amazon S3 服务器）抓取该文件的行之后。我们从 SpigotMC 服务器抓取的不是我们随后运行的简单 JAR 文件，而是我们用于实际构建最终 JAR 文件的中间文件。这样做的优势是，我们可以始终获取 Spigot 服务器的的最新版本，不需要更改 Dockerfile 中的其他代码。我们还需要对 git 的默认行为执行一些更改（构建过程会使用它），以便以 Microsoft Windows（大多数 Spigot 开发都在这里进行）和 Linux 之间处理回车/换行的方式来处理这些区别。

为了查看构建过程有何不同，可以在您早先从中运行 Minecraft 容器的相同目录发出以下命令。

```
cd ../spigot  sudo docker build -t="<directory>/spigot188” .
```

请注意，构建此文件需要花很长的时间！但好消息是，Docker 的分层性质意味着 Docker 不需要每次都构建所有中间步骤。要理解我的意思，可以再一次执行该命令。它的执行速度应该快得多！原因可在输出中找到：

```
Step 7 : RUN wget "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar  ---> Using cache  ---> fdf1e118f298 Step 8 : RUN git config --global core.autocrlf input  ---> Using cache  ---> 5a130309c12c Step 9 : RUN java -jar minecraft/BuildTools.jar  ---> Using cache  ---> 516e9fb02428
```

请注意，在每条命令后显示了 `Using cache` 。当 Docker 在 Dockerfile 中执行一个步骤时，它会将结果缓存为一个新镜像。在第 2 部分 中，当我们开始为 Spigot 构建插件时，您会看到我们仍然没有经历构建过程的耗时部分 — 更新 Ubuntu 和构建 Spigot 文件！

要查看您是否构建成功，可以发出下面这条命令：

```
sudo docker run -i -t -p=25565:25565 <directory>/spigot188
```

如果您看待类似这样的消息：

```
[21:16:17 INFO]: Done (11.170s)! For help, type "help" or "?"
```

您已经成功构建了您的第二个 Minecraft 服务器 — 这个服务器可扩展！尝试将您的 Minecraft 客户端连接到新服务器（它位于与前面的示例相同的网络地址上，所以您不需要更改地址），看看是否一切正常。

## 结束语

您现在已经完成这个教程系列 的第 1 部分的学习。您学习了 Docker 的工作原理，它对 Minecraft 开发人员有何用处，您还了解了两个创建本地 Minecraft 服务器的 Dockerfile 的一些详细示例。在第 2 部分 中，您将学习如何为 Spigot 服务器创建插件，您将看到一个在该服务器内运行的插件的例子。

# 第 2 部分: 使用 Docker 和 Eclipse 为 Minecraft 构建插件

在 第 1 部分 中，您学习了如何在 Docker 中设置一个 “现成的” 或未修改的 Minecraft 服务器，以及如何在 Docker 中设置 Spigot 服务器。这是构建您自己的可利用许多服务的 Minecraft 插件的第一步，这些服务包括 Bluemix（IBM 的平台即服务环境）上提供的 Watson 认知服务。使用这些服务，将使您的游戏体验更加智慧和更加愉快。

但您不能一蹴而就。您需要完成另外一些步骤，然后才能够构建可使用 Watson 服务的插件。在第 2 部分中，我将介绍设置您本地开发环境的下一步：设置 Eclipse，然后开发、构建您自己的服务器端 Minecraft 插件，并将它们导出到一个本地 Docker 镜像中。

我们将在 Eclipse 集成开发环境 (IDE) 中完成所有开发。Eclipse 是一个用于 Java® 和其他一些语言的免费、开源的开发环境。您可以选择几乎任何 Java IDE 来执行 Minecraft 插件开发，但在使用 IDE 的社区中，Minecraft 开发社区通常使用 Eclipse。

## 在 Ubuntu 中设置 Eclipse

要使用 Eclipse IDE，您需要首先将 Java 安装在您的 Ubuntu Linux 环境中。Eclipse 不仅是一个在 Java 中开发程序的环境，它本身也是一个 Java 程序。安装 Java 的命令应该看起来很熟悉，因为我们已在 第 1 部分 中的 Dockerfile 中使用过它。但是，这一次您需要在您的 Ubuntu Linux 安装的命令行上运行该命令：

```
sudo apt-get install openjdk-7-jdk
```

成功安装 JDK version 7 后，您需要做一次选择：

* 如果您更习惯使用 Ubuntu GUI，可以转到 [Eclipse 下载页面](http://eclipse.org/downloads/) 并选择 Eclipse Mars 版本，然后下载 Eclipse 的安装文件。安装文件为Gzipped tar 文件格式。在 Ubuntu 文件管理器中双击该 tar 文件，使用 Archive Manager 打开它。然后使用文件管理器将该文件的内容提取到一个名为 "eclipse" 的目录中。
*如果您更习惯使用命令行，那么可以一次一个地发出以下命令：

```
wget
"https://eclipse.org/downloads/download.php?file=
/technology/epp/downloads/release/mars/R/eclipse-jee-mars-R-linux-gtk-x86_64.tar.gz&r=1"
-O eclipse-jee-mars-R-linux-gtk-x86_64.tar.gz

tar -xzf eclipse-jee-mars-R-linux-gtk-x86_64.tar.gz
```

 无论您如何下载和安装 Eclipse，都可以采用同样的方式启动它。假设您已经将它安装在主目录中，可以在命令行上键入下面这条命令来启动
Eclipse： `./eclipse/eclipse`

 在启动 Eclipse 后，系统会询问您是想要创建一个新的默认工作区还是使用现有的工作区。继续在它指定的目录中创建默认工作区。 

[工作区启动器](image001.jpg)

 在 Eclipse Welcome 屏幕上，单击右上角的 Workbench 图标打开 Workbench。 

[Workbench 图标](image002.jpg)

 您会看到 Eclipse Workbench：

 [Eclipse workbench](image003.jpg)

## 导入归档文件

我们将使用 Eclipse 的项目导入功能来导入一个包含我们的示例的项目归档文件。Eclipse 中的项目是您的工作区目录中的目录结构。项目归档文件是一种用于 Eclipse 的特殊 zip 文件格式，它允许您与其他人共享您的配置完整的项目。在将该项目导入 Eclipse 中后，我们将会分析示例代码。归档导入文件位于在 第 1 部分 中从 GitHub 克隆的 minecraft-project 目录的根目录下，所以如果尝试不学习第 1 部分中的所有示例，而是直接跳到本教程，则需要返回执行该克隆过程。

1.从 Eclipse Workbench 顶部的菜单中选择 `File > Import`。
2.选择 `General > Existing Projects into Workspace`，然后单击 `Next`。

![Import 对话框](image004.jpg)

3.选择 `Select Archive File`，然后单击 `Browse`。

![Import 对话框](image005.jpg)

4.导航到您克隆到的目录（或许是您的主目录，但具体情况取决于您在 第 1 部分 中执行的操作）并打开 minecraft-project 目录。选择 SpigotPlugin.zip 并单击 `OK`。

![Import 对话框](image006.jpg)

5.单击 `Finish`。

6.在 Workspace 中，您将在 SpigotProject 下看到一个红色的感叹号 (!)。没有关系 — 它只是提醒我们，我们需要修补指向 spigot-1.8.3.jar 文件的类路径，以便我们的插件的 Java 代码能够运行（因为我们的代码依赖于 Spigot API，所以需要导入这些 API）。
在 Project 窗格中选择 SpigotPlugin.zip。单击（在其他平台上可以按下 Alt-Enter 或按住 Control 键并单击）并从弹出菜单上选择 `Properties`，然后选择 `Java Build Path`。选择 `Libraries` 选项卡。

![Import 对话框](image007.jpg)

7.选择 Spigot1.8.3.jar，然后单击 `Edit`。

![Import 对话框](image008.jpg)

8.双击 minecraft-project，然后在下一个窗格中选择 Spigot1.8.3.jar。
如果仔细查看，您可能会担心这个 Spigot JAR 文件与上一个示例中构建的 Spigot JAR 文件的级别（为 1.8.8 级）不匹配。实际上，因为我们使用此 JAR 文件只是为了允许执行我们的代码编译，所以即使它具有较低的级别也没有关系 — 该 API 暂时不会更改。在您自己的代码中，如果这在以后导致了问题，可以按照 [Spigot Build Tools wiki ](https://www.spigotmc.org/wiki/buildtools)上的说明，在本地构建一个新的 spigot JAR 文件，并替换您从 GitHub 下载的文件。

9.单击 `Apply`，然后单击 `OK`，再次单击 `OK`。

此刻，您的工作区会显示旁边没有红色感叹号的 SpigotPlugin 项目，这意味着您已经解决了这个问题，而且我们可以继续运行我们的示例。

## 为 Minecraft 构建插件

Spigot 插件 API 实际上非常简单。如果您曾经使用 Java 执行过其他类型的服务器端编程，比如构建 servlet，就会发现它是采用同样工作原理的一个简单示例。我们安装一个特定的 JDK (Java 1.7) 的原因是，Minecraft 中的插件（或者至少使用 Bukkit API 的插件）必须在 Java 1.7 上构建。否则，您会在服务器上获得奇怪的类不匹配错误。在未来，这种情况可能发生改变，但就现在而言，最好坚持使用 Java 1.7 执行开发。

## HelloWorld 类

我们首先来看一个简单的 Minecraft 插件，它等效于任何编程语言中的 Hello World 程序。我们将使用此文件介绍 Bukkit API 的一些更简单的特性。

1. 首先，单击并展开 `SpigotPlugin`，从 `Eclipse Workbench` 项目窗格调出插件源代码文件。
2. 单击并展开 `src`，然后展开 `com.ibm.minecraftplugin` 目录。
3. 单击 `HelloWorld.java`。

让我们看看 HelloWorld.java 文件的内容：

```
package com.ibm.minecraftplugin;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

public class HelloWorld extends JavaPlugin {

    public void onEnable(){
        getLogger().info("Hello World!");
    }
    
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args)
    {
    if (cmd.getName().equalsIgnoreCase("hello")) {
    sender.sendMessage("Hello Everybody!");
    }
    return false;
    }
}
```

您需要理解两个简单的概念。首先，构建一个插件非常简单，只需扩展 JavaPlugin 类，所以您的所有插件都将是 JavaPlugin 的子类。第二，您需要在每个插件类中实现两个方法：

`onEnable()` 是一个事件处理函数，会在服务器加载该插件时调用。您在此方法中对该类执行所有必要设置（例如设置数据库连接）。我们采用了一种标准的调试方法，那就是将一些状态信息记录到日志记录器中，以便在加载插件时，可以在日志输出中查看结果。

每当用户使用 `/&COMMAND&`  发出一个 Minecraft 命令时，就会调用 `onCommand()` 。每个插件必须确定该命令能否被该插件处理（这非常简单，只需将该命令的名称与该插件可处理的相应名称进行比较），然后执行任何必要的操作。

在我们的例子中，一旦我们确认该命令可被该插件处理，就会将消息 "Hello Everybody!" 发送到该命令的发送者。这很简单，但足以让您了解该概念的原理。如果您喜欢的话，可以更改 `onEnable() `方法写入的日志消息，或者该命令向用户发回的消息来自定义您的插件。

## Plugin.yml 文件

Bukkit 插件正常运行所需的最后的配置涉及 Plugin.yml 文件。此配置文件向框架的剩余部分描述您的插件。它是使用 YAML (Yet Another Markup Language) 编写的，像您将在本教程系列中看到的许多其他配置文件。要记住的一件事是，您不能在 YAML 插件文件中使用选项卡。

要检查您的 plugin.yml 文件，可以在 SpigotPlugin 项目中双击该文件。该文件的内容是：

```
name: HelloWorld
main: com.ibm.minecraftplugin.HelloWorld
version: 1.0
commands: 
  hello:
    description: A new command

```

可以看到，它非常简单：您在该文件的顶部指定您的插件的名称、主要类，以及版本。任何由您的类处理的命令都必须在 commands: 后面列出（缩进一个空格）。在这里的示例中，我们仅展示了该命令的 description 部分，但如果查阅 [插件 YAML 文档](http://wiki.bukkit.org/Plugin_YAML)，还可以看到其他部分。

## 在本地测试

在编写了第一个插件的代码后，可以导出并试用它了。

如果您只想使用所提供的预先构建的 HelloWorld.jar 文件示例，可以跳过介绍导出 JAR 文件的下一节。如果您没有对该代码执行任何更改，那么这是最快的选择。如果您执行了更改，需要执行下一节中的步骤来试用您的新代码。

## 导出您的 JAR 文件

要导出您的 JAR 文件，可以完成这些步骤：

1.在 Workbench 中，选择 SpigotPlugin 项目，单击以弹出菜单，然后选择 `Export`。
2.在 `Export` 对话框中，选择 `Java > JAR file` 并单击 `Next`。

![Export 窗口](image009.jpg)

3.在 JAR File Specification 对话框中，单击 `Browse`。

4.在 File Selection 对话框中，导航到您的 minecraft-project 目录的 spigot-plugin 子目录，选择 HelloWorld.jar，然后单击 OK。

![Jar File Selection 对话框](image010.jpg)

5.返回到 `JAR File Specification` 对话框，单击 `Overwrite existing files without warning`，然后单击 `Finish`。

![JAR File Specification 对话框](image011.jpg)

您的新 JAR 文件现在已替换旧文件。是时候查看您的代码是否能运行了！

## 新的 Dockerfile

像上一个示例中一样，我们将使用一个新 Dockerfile，该文件将在一个 Docker 镜像中构建该示例。首先，在 Ubuntu 中打开第二个终端窗口 — 这样您就可在 Eclipse 仍在运行时运行 Docker 命令。在新的终端窗口中（假设您位于主目录中，这也是您将 minecraft-project 目录克隆到的地方），键入以下两条命令：

```
cd minecraft-project/spigot-plugin
cat dockerfile
```

您将看到此示例的新 Dockerfile，如下所示。花一些时间查看它，看看您能否发现与我们的上一个示例 Dockerfile 的区别。

您可能已经注意到，这非常类似于我们在本系列的 第 1 部分 中看到的 0.0.2 示例 Dockerfile，但有两处不同。首先，这个文件创建了一个名为 "plugins" 的新目录。第二，它在 Docker 中执行了一个您未看到过的新命令：ADD。

ADD 命令从您的本地（主机）目录获取一个文件，并将它复制到 Docker 文件 — 这太棒了！这就是我们在这个示例中想要的结果 — 我们希望能够更改我们的插件文件，同时撇开其他部分不管。但是，CMD 命令在您每次使用 Docker run 启动一个新容器时都会运行，与它不同的是，ADD 命令仅在您执行 Docker build 时运行。这意味着，如果更改插件，则需要重新构建您的镜像。对于此示例，让我们在命令行键入下面这个命令，首次构建我们的新镜像：

```
sudo docker build -t="<directory>/spigot188-plugin" .
```

就像您在 第 1 部分 中所做的一样，将 <directory> 替换为您的登录 id。您第一次构建新镜像时，所花的时间可能比后续构建更长，因为 Docker 会建立一些新的镜像层。

您已经构建了新的镜像，是时候运行它了！为此，键入以下这条命令：

```
sudo docker run -i -t -p=25565:25565 <directory>/spigot188-plugin
```

因为您在与以前相同的端口上启动 Docker 容器的，所以应该不需要更改 Minecraft 客户端的配置。您将在 Minecraft 服务器的屏显日志中找到您的插件在正常运行的第一条线索 — 查找一个类似这样的行：

```
[14:22:50 INFO]: Done (12.942s)! For help, type "help" or "?"
```

确定服务器已成功启动后，启动 Minecraft 客户端，连接到您的服务器，然后在 Minecraft 内键入：

```
/hello
```

您的 Minecraft 命令屏幕看起来应该类似于下图：

![Minecraft 屏幕](image012.jpg)

如果您看到消息 "Hello Everybody"（或您将该消息更改为的任何消息），则表明它在正常运行。恭喜您！

## 结束语

在本教程系列的第 2 部分中，您学习了如何使用 Eclipse 为 Minecraft 构建一个简单的服务器端插件，以及如何在 Docker 上运行它。在 第 3 部分 中，将会进一步改进插件 — 让它在网络上的 Bluemix 中运行。

# 第 3 部分: 将 Spigot Minecraft 服务器部署在 Bluemix 上

在 第 1 部分 和 第 2 部分 中，您了解了如何构建一个 Minecraft 服务器，并将它部署到在本地运行的 Docker 容器中，以及如何构建和部署服务器端插件来扩展您的本地 Minecraft 服务器。在这一部分中，我们将获取我们在第 2 部分中构建的 Docker 镜像，然后运行它们，使用它们作为可通过云访问的 Docker 容器。

## Bluemix 和 Cloud Foundry 的特性和命令

但在开始之前，让我们回顾一下 Bluemix 和 Cloud Foundry 的一些特性。Bluemix 是 IBM 基于 Cloud Foundry 的平台即服务 (PaaS) 解决方案，它使得开发人员能够快速创建、部署、管理和监视云应用程序。Cloud Foundry 是一个开源的 PaaS 解决方案，它在构建云解决方案的方式上为开发人员和组织提供了许多选择。例如，开发人员可以选择使用 buildpack（基于社区、自定义构建或从头构建），它可以很方便地打包框架和运行时。
关于本系列

要使用 Bluemix，第一步是 [注册一个免费试用版帐户](https://developer.ibm.com/sso/bmregistration?lang=zh_CN&ca=dwchina-_-bluemix-_--_-article)。创建您的帐户时，请记下您的访问凭证（用户名和密码），因为在本教程的后面部分将需要它们。

不同于 Cloud Foundry 的开源版本，Bluemix 使得将 Docker 容器部署到云中成为可能。将 Docker 容器部署在 Bluemix 上时，我们将同时使用 Cloud Foundry 命令行接口 (cf) 和您已在 第 1 部分 中安装的用于 IBM Containers 的 Cloud Foundry 插件 (cf ic)。

cf ic 命令用于管理 Bluemix 环境中的容器。命令 cf ic login 向 Bluemix 存储库验证用户，并提供用于在 Bluemix 中存储镜像的私有注册表的信息。cf ic命令实际上是 Docker 的一个扩展，支持所有 Docker 命令以及一些专门用于管理 Bluemix 上的 IBM 容器的命令。

下面是其他一些使用 Cloud Foundry 命令行接口和用于 IBM Containers 的 Cloud Foundry 插件的有用命令：
列出 Bluemix 存储库中的镜像：

```
cf ic images
```

显示 Bluemix 中运行的容器：

```
cf ic ps
```

显示 Bluemix 中的所有容器：

```
cf ic ps –a
```

停止一个运行的容器：

```
cf ic stop CONTAINER
```

从 Bluemix 存储库中删除镜像：

```
cf ic rmi IMAGE
```

从 Bluemix 存储库中删除容器：

```
cf ic rm CONTAINER
```

## 为您的 IBM Containers 存储库定义一个命名空间

在 IBM Containers for Bluemix 中，私有 Bluemix 存储库是一个组织中存储受信任的 Docker 镜像的中央存储库。您可以向该存储库推送镜像和从中拉取镜像，您可以将这些镜像部署到任何开发、暂存或生产环境。

您第一次在一个组织内创建容器时，系统会提示您为与该私有 Bluemix 存储库关联的命名空间输入一个名称。该命名空间用于生成唯一 URL，供您用于访问私有 Bluemix 存储库。您任何时候对存储库执行操作都需要这个 URL，比如一个镜像的拉取请求或推送请求。

以下规则适用于私有存储库名称：

* 在为组织设置该名称后就无法更改它。
* 该名称必须仅包含小写字母、数字和下划线。
* 该名称必须以字母或数字开头。
* 该名称必须在 4 到 30 个字符之间。

要设置您的命名空间，可使用此命令：

```
cf ic namespace set <namespace>
```

要确定您的命名空间是什么，可使用此命令：

```
cf ic namespace get
```

## 用于在 Bluemix 上构建和运行容器的 Dockerfile

在 第 1 部分 中，您将一个 git 存储库 (https://github.com/kgb1001001/minecraft-project.git) 克隆到了您的本地空间。在 minecraft-project 目录中，有一个名为 spigot-plugin-bluemix 的文件夹，它包含一个 Dockerfile、一个 server.properties 文件和一个 HelloWorld.jar 文件。正如之前介绍的，Dockerfile 用于构建以后将推送到 Bluemix 容器的镜像。HelloWorld.jar 文件是包含 Spigot 的服务器模拟器的插件，就像我们在 第 2 部分 中创建的一个一样。

要更改到 spigot-plugin-bluemix 目录并打印新的 Dockerfile 的内容，可以在 Linux 终端运行以下命令：

```
cd $DIR/minecraft-project 
cd spigot-plugin-bluemix  
ls
```

其中 DIR 是您从 GitHub 将 Minecraft-project 克隆到的目录。

```
cat dockerfile
```

查看 Dockerfile 并查找与 0.0.3 版的区别；我们接下来将讨论它们的区别。

找出这个 Dockerfile 中的两处区别了吗？第一处更改是引入了一个要添加到 Docker 镜像的新文件 (server.properties)。第二处更改是公开的端口。让我们首先讲讲端口设置，因为它是较简单的一处更改。

Bluemix 默认情况下仅开放低于某个端口编号的端口。我们目前为止使用的端口编号（默认的 Minecraft 端口：25565）超出了这个范围。通过公开一个更低的端口编号，您能够满足 Bluemix 限制。但是，这需要您对服务器配置执行一次更改，您接下来将会看到。


## 配置服务器属性

在执行这些服务器配置更改之前，需要讲讲我们添加的 server.properties 文件，它存储一个多玩家（Minecraft 或 Minecraft Classic）服务器的所有设置。目前为止我们使用的是默认配置，还不需要这个可选的文件。可以运行下面这个命令来查看新的 server.properties 文件的内容：

```
cat server.properties
```

server.properties 文件的内容为：

```
#Minecraft server properties
#(File modification datestamp)
spawn-protection=16
max-tick-time=60000
generator-settings=
force-gamemode=false
allow-nether=true
gamemode=0
enable-query=false
player-idle-timeout=0
difficulty=1
spawn-monsters=true
op-permission-level=4
resource-pack-hash=
announce-player-achievements=true
pvp=true
snooper-enabled=true
level-type=DEFAULT
hardcore=false
enable-command-block=false
max-players=20
network-compression-threshold=256
max-world-size=29999984
server-port=9085
server-ip=
spawn-npcs=true
allow-flight=false
level-name=world
view-distance=10
resource-pack=
spawn-animals=true
white-list=false
generate-structures=true
online-mode=false
max-build-height=256
level-seed=
use-native-transport=true
motd=A Minecraft Server
enable-rcon=false
```


编辑 server.properties 时，您必须使用与原始文件相同的结构，但这些行的顺序是任意的。等号之前的文本是键，不要更改它。等号之后的文本是属性的值，您可以编辑它。以 # 开头的行是注释 — 修改或删除这些行对游戏没有影响。

事实证明，Bluemix（或 SoftLayer）会拦截用于与 Mojang 身份验证服务器进行外部通信的身份验证端口。为了解决这个问题，需要将属性 online-mode 设置为 false，这样会在用户登录时跳过身份验证步骤。

> 警告：这在本质上会让您的 Minecraft 服务器变得不安全。此设置对测试和调试（这就是我们使用它的目的）很有用，但您不应将此设置用于生产级服务器。

最终，您需要运行 Minecraft 服务器，在端口 9085 上进行监听，这是我们在 Dockerfile 中公开的端口。可以通过更改 server.properties 文件中的 server-port 设置来实现此目的。

更改 server.properties 文件后，必须重新启动服务器，它们才会生效。在我们的例子中，我们总是会重新启动整个 Docker 镜像，这样将满足该需求。

如果 server.properties 文件没有列出所有属性（例如，如果服务器的一个新版本添加了新属性或如果该文件不存在），那么在启动时，该服务器在 server.properties 文件中重写列出的新属性，并将它们设置为默认值。

## 将 Docker 镜像部署到 Bluemix 并在 IBM 容器中运行它们

1.与在 第 1 部分 和 第 2 部分 中一样，如果没有这么做，请更改到 minecraft-project/spigot-plugin-bluemix 目录，并使用以下命令构建镜像 spigot-plugin-bluemix：

```
cd $DIR/minecraft-project/spigot-plugin-bluemix
docker build -t spigot-plugin-bluemix .
```

2.在成功构建镜像后，可以使用此命令检查它：

```
docker images
```

![image003.jpg](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image003.jpg)

3.接下来，创建一个标记，它是镜像的一个助记性名称。您可使用此命令，才存储库中为镜像 spigot-plugin-bluemix 创建该标记：

```
docker tag spigot-plugin-bluemix 
registry.ng.bluemix.net/<namespace>/spigot-plugin-bluemix
```

![image004.jpg](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image004.jpg)

4.构建并标记您的 Docker 镜像后，可以将它部署到您的 Bluemix 存储库。为此，您需要登录到您的 Bluemix 帐户，并向您的 Bluemix 注册表执行验证。（如果您属于多个 Bluemix 组织，那么您会获得提示，让您选择将要访问的组织。）

```
cf login –u username –p password
```

其中 username 和 password 是您在本教程开头指定的 Bluemix 用户名和密码。（您还可以发出 cf login 并被提示输入您的用户名和密码。）

5.要向您的 Bluemix 注册表执行验证，可以键入：

```
cf ic login
```

如果成功，您应看到类似下图的结果：


![image005.jpg](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image005.jpg)

6.要将 Docker 镜像部署（上传）到您的 Bluemix 存储库，可以键入下面这个命令。根据您的网络速度，这可能会花几分钟：

```
docker push registry.ng.bluemix.net/<namespace>/spigot-plugin-bluemix
```

7.要确认镜像已成功推送到您的 Bluemix 存储库，可以键入下面这个命令：

```
cf ic images
```

8.现在 Docker 镜像已成功部署到 Bluemix，可以使用此命令在 Bluemix 中启动该容器：

```
cf ic run --name=testspigot --publish=9085 registry.ng.bluemix.net/<namespace>/spigot-plugin-bluemix
```

9.接下来使用此命令，确认新容器已成功地在 Bluemix 上运行。

```
cf ic ps
```

10将在 Bluemix 容器内运行的 Spigot 服务器与一个公共 IP 地址关联，以便客户端可以访问该服务器。为此，您可发出以下命令：
请求一个新的公共 IP 地址（一定要记下返回的 IP 地址 <ip>）：

```
cf ic ip request
```

11.将该公共 IP 绑定到在 Bluemix 中运行的 spigot-plugin-bluemix 容器：

```
cf ic ip bind <ip> spigot-plugin-bluemix
```

12.如果遇到任何问题，这些命令可以帮助您调试在获取 IP 地址上的任何问题：
返回可供您的组织使用的 IP：

```
cf ic ip list
```

13.释放 <ip> 地址，以便可以重用它：

```
cf ic ip release <ip>
```

## 测试 Docker 镜像

将该 IP 地址绑定到您在 Bluemix 上运行的新容器后，就可以进行测试了。

1.转到您的本地 Minecraft 客户端并设置一个新服务器（像 第 1 部分 和 第 2 部分 中所做的一样），但这一次使用您通过 cf ic ip request 命令获得的新的公共 IP 地址（如果您忘记了它，可以使用 cf ic ip list 找到它）。一定要使用端口 9085 作为要连接到的该服务器地址上的端口。

![Edit Server Info 的屏幕截图](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image006.jpg)

2.在设置此服务器后，应该能够加入该服务器，如下面两个屏幕截图所示：

![Play Multiplayer 的屏幕截图](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image007.jpg)

![玩游戏时的屏幕截图](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-spigot-trs-3/image008.jpg)

## 结束语

如果您正确执行了所有步骤，那么您应该已经在游戏中，并能够使用您早先构建的 "Hello World" 插件。试验以各种方式更改该插件，重复上述步骤来查看容器的工作原理！
在本 教程系列 的 第 4 部分 中，您将学习如何使用一个使用 Watson 认知服务的插件扩展 Spigot 服务器。IBM 在 Bluemix 上提供了多个 Watson 服务，您可以使用它们来构建认知解决方案，包括教育性和交互式游戏体验。

## 附录

在 Bluemix 中使用 Docker 容器的一个问题是，您需要运行大量命令来构建您的容器，将它推送到 Bluemix 上的存储库，请求和分配一个 IP 地址，以及在完成时撤销所有这些操作。执行此过程几次后，这种重复会变得沉闷乏味。
所以，我们鼓励您使用自动化，将所有这些命令集中到一些简单的脚本中来执行这些常见的操作。我们包含了两个示例脚本（名为 setup.sh 和 cleanup.sh），我们已将它们上传到 [GitHub 中的 Minecraft 项目](https://github.com/kgb1001001/minecraft-project) 中。
这是 setup.sh 脚本。试验使用此脚本，您可能很快会发现您不再想返回单独键入每个命令！

# 第 4 部分: 将 Watson 集成到 Minecraft 中

在 第 1 部分、第 2 部分 和 第 3 部分 中，您看到了如何在 Docker 容器内启动您自己的 Minecraft 服务器，首先在本地启动，然后在 Bluemix 上的 IBM Container 服务内启动。您还学习了如何为 Minecraft 构建服务器端插件，以及将这些插件添加到在 Docker 中运行的 Minecraft 服务器。

所有这些都是学习本教程（本系列的最后一篇）的前奏，本教程展示如何在您的插件开发中利用 IBM Bluemix 环境的强大功能，并在此期间向 Minecraft 中的游戏体验添加一定的科学性。在本文中，您将了解如何使用一个使用 Watson 认知服务的插件扩展 Spigot 服务器。

IBM 在 Bluemix 上提供了多个 Watson 服务，您可使用它们来构建认知解决方案。这些服务包括 Watson Question and Answer 服务、Personality Insights、Watson Natural Language Classifier、Tradeoff Analytics 和其他一些服务。浏览 Watson 服务 的完整列表。

在本教程中，您将看到如何构建一个使用 Watson Q&A 服务回答疾病问题的插件 — 以及如何将该插件与另一个第三方 Minecraft 插件相组合，向 Minecraft 村民添加传染病。将这二者相结合时，您就有理由在该游戏中学习如何诊断和治疗疾病。这种概念证明集成展示了如何将第三方插件与您自己的插件相组合来利用 Watson 和 Bluemix 的强大功能。

## 创建一个 Bluemix 应用程序并获取 Watson Q&A 凭据

让我们开始吧。首先，我们需要获取 Watson Q&A 服务的一个实例，并从该服务实例获取一些凭据，以便在我们的新插件中使用它们。然后我们将构建该插件，将它安装到 Docker 中并推送到 IBM Container 服务中。

要获取相关的凭据来访问当前 Bluemix 版本中的 Watson Q&A 实例，我们需要执行一个迂回流程。如果您使用一个 Cloud Foundry 运行时编写一个应用程序，可创建一个服务，然后将该服务绑定到您的运行时，以便获取该服务的凭据，凭据信息会通过一组环境变量自动传输到您的运行时。但是，同样的绑定流程还无法对 Docker 容器无缝地执行，所以我们需要引入一个 “虚拟” 应用程序，我们将它绑定到 Watson Q&A 服务来获取正确的凭据。为此，执行此过程：

1.使用您的 IBM id 和密码 [登录到 Bluemix](http://www.bluemix.net/?cm_mmc=dwchina-_-bluemix-_--_-article)。（如果您没有 IBM id，可在注册您的 [免费 Bluemix 试用帐户](https://developer.ibm.com/sso/bmregistration?lang=zh_CN&ca=dwchina-_-bluemix-_--_-article) 时获取一个。）

2.单击 `CREATE APP` > `Web` > `SDK for Node.js` > `Continue` 创建一个新应用程序。
指定一个唯一的应用程序名称（我们在示例中使用 WatsonSpigotApp）。创建 WatsonSpigotApp 后，返回到 Overview 页面（通过单击左侧栏中的 `Overview`）。

3.单击 `ADD A SERVICE OR API`，将 Watson 服务添加到您刚创建的应用程序。

![您的新应用程序的 Overview 页面的屏幕截图]()

4.从服务目录中选择 Watson Question and Answer 服务。

![Bluemix 目录中的 Watson Question and Answer 服务的屏幕截图]()

5.单击下一个弹出窗口上的 USE 来添加该新服务。注意生成的服务名称（如果愿意，您可更改它），另请注意此服务绑定到 WatsonSpigotApp。在左下角，您可单击 VIEW DOCS 按钮来了解该服务的更多信息和您可用来访问它的 REST API。

![Bluemix 目录中的 Watson Question and Answer 服务详细信息的屏幕截图]

6.单击左侧栏中的 Overview 返回到 WatsonSpigotApp 概述。注意新添加的 Question and Answer 服务。单击该服务下的 Show Credentials 以查看访问这个配备的 Watson Question and Answer 服务实例所需的凭据。

![Bluemix 目录中的 Watson Question and Answer 服务详细信息的屏幕截图]()

7.保存这些凭据（具体来讲，URL、用户名和密码），因为您在以后需要它们来连接此 Watson 服务。您的凭据将是唯一的 — 这个示例仅显示了它们采取的形式：

```
"url": "https://gateway.watsonplatform.net/question-and-answer-beta/api",
"username": "some-long-hyphenated-set-of-characters",
"password": "AVeryL0ngSer1esOfCharact3rs"
```

## 构建一个 Spigot 插件来使用 Watson Q&A 服务

拥有正确的凭据后，我们就可以构建自己的 Spigot 插件。

> 备注：本教程系列中引用的所有代码都可在 GitHub 上您在 第 1 部分 中克隆的相同项目中找到。如果您还未克隆（假设您直接跳到了本教程），那么可从 GitHub 克隆以下项目：

```
git clone  https://github.com/kgb1001001/minecraft-project.git
```

minecraft-project/spigot-plugin-watson/ 目录包含一个 spigot-plugin-watson.zip，这是一个 Eclipse 项目归档文件，包含本教程剩余部分所引用的代码。

在您的 Ubuntu 环境中（您已在第 1、2 和 3 部分中使用）：

1.将以下 jar 下载到 $HOME/refLibs 目录。您在后续步骤中将需要它们：

* http://mvnrepository.com/artifact/commons-codec/commons-codec/1.10 (commons-codec-1.10.jar)
* http://mvnrepository.com/artifact/org.codehaus.jackson/jackson-core-asl/1.9.13 (jackson-core-asl-1.9.13.jar)
* http://mvnrepository.com/artifact/org.codehaus.jackson/jackson-mapper-asl/1.9.13 (jackson-mapper-asl-1.9.13.jar)

2.执行以下步骤来构建 craftbukkit-1.8.8.jar：

```
cd $HOME/refLibs
mkdir minecraft
wget "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar
git config --global core.autocrlf input
java -jar minecraft/BuildTools.jar
```

完成这些步骤后，您的目录中应有一个 craftbukkit-1.8.8.jar。

3.启动 Eclipse：

```
./eclipse/eclipse
```

选择一个工作区目录。（Eclipse 将它的文件写入该目录中。）

> 备注：如果 Eclipse 启动时没有显示 File 菜单，可结束 Eclipse 并使用下面这个命令重新启动它：
UBUNTU_MENUPROXY=0 ./eclipse/eclipse

4.选择 `File` > `New` > `Java Project` 来创建一个新项目。

![创建一个新项目的屏幕截图]()

指定 WatsonSpigotPlugin 作为名称。

![命名新项目的屏幕截图]()

单击 `Next`，在 Libraries 下，单击 `Add External Jars...`。

![添加 JAR 的屏幕截图]()

导航到 $HOME/refLibs 并选择 `craftbukkit-1.8.8.jar`。

![选择一个 JAR 的屏幕截图]()

单击 `OK`，然后在下一个屏幕上单击 `Finish`。将使用名称 WatsonSpigotPlugin 在您的 Eclipse 工作区中创建一个新项目。

5.接下来，我们需要添加一些需要的依赖项 jar。
在您的 WatsonSpigotPlugin 项目下创建一个新文件夹并将它命名为 lib。

![创建一个新文件夹的屏幕截图]()

将以下 jar 从您的 $HOME/refLibs 目录复制到您刚创建的 lib 目录中：

* commons-codec-1.10.jar
* jackson-core-asl-1.9.13.jar
* jackson-mapper-asl-1.9.13.jar

将这些 jar 添加到您项目的构建路径：在 Eclipse 中选择它们，右键单击，然后选择 Build Path > Add to Build Path。

![移动 JAR 的屏幕截图]()

6.创建一个新包并将它命名为 com.ibm.minecraft.spigotplugin。

7.在 com.ibm.minecraft.spigotplugin 包下，创建一个新 Java 类并将它命名为 WatsonQA。这会创建该新类并将该文件加载到 Eclipse 中。

![创建和加载一个新类文件的屏幕截图]()


8.将以下代码添加到您的 WatsonQA.java 中：

```
// Begin WatsonQA.java

package com.ibm.minecraft.spigotplugin;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

public class WatsonQA extends JavaPlugin {
	// Fired when plugin is first enabled
    @Override
    public void onEnable() {
    	getLogger().info("WatsonSpigotPlugin");
    }
    // Fired when plugin is disabled
    @Override
    public void onDisable() {

    }
    
    public boolean onCommand(CommandSender sender, Command cmd, String label,
			String[] args) {
		getLogger().info("command: " + cmd.getName());
		//getServer().dispatchCommand(getServer().getConsoleSender(), cmd.getName());
		if (cmd.getName().equalsIgnoreCase("hello")) {
			sender.sendMessage("Hello Watson");
		}
		if (cmd.getName().equalsIgnoreCase("watson")) {
			if (args.length == 0) {
				sender.sendMessage("WATSON Rocks");
				return true;
			} 
			
			if (args.length >= 1) {
				StringBuilder str = new StringBuilder();
				for(int i=0; i < args.length; i++) {
					str.append(args[i]);
					if(i < args.length-1) {
						str.append(" ");
					}
				}
				String question = str.toString();
				sender.sendMessage("asking Watson: " + question);
				//String response = SpigotQAAPI.getQAAPIResponse(question);
				//sender.sendMessage("Watson response: " + response);
				
				return true;
			}
			
		}

		return false;
	}
}


// End WatsonQA.java
```

WatsonQA.java 中的示例代码类似于您在开始为 Spigot 服务器开发插件时所找到的示例代码。

9.请注意第 42 和 43 行上被注释掉的代码。我们接下来将为这些行添加需要的代码。

10.为此，在同一个包 (com.ibm.minecraft.spigotplugin) 下，创建一个新类并将它命名为 SpigotQAAPI。

11.将以下代码添加到您的 SpigotQAAPI.java 中：

```
// Begin SpigotQAAPI.java

package com.ibm.minecraft.spigotplugin;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

public class SpigotQAAPI {
	private static final Logger logger = Logger.getLogger(SpigotQAAPI.class.getName());
	
	/*
	 Insert the credentials for the Watson Question and Answer service
	 credentials": {
       	 "url": "https://gateway.watsonplatform.net/question-and-answer-beta/api",
	"username": qa_username,
    	"password": qa_password
      	}
	 */
	static String QAAPI_URL = "https://gateway.watsonplatform.net/question-and-answer-beta/api/v1/question/healthcare";
	static String QA_USERNAME = qa_username;
	static String QA_PASSWORD = qa_password;
	static String BASIC_AUTH = "Basic " + new String(Base64.encodeBase64((QA_USERNAME+":"+QA_PASSWORD).getBytes()));
	
	/*
	* Create HTTP connection
	*/
	static public HttpURLConnection createConnection(String address, String method) throws IOException {
	URL url = new URL(address);
	HttpURLConnection connection = (HttpURLConnection)url.openConnection();
	if (method == "PUT" || method == "POST") {
	   connection.setDoOutput(true);
	}
	connection.setRequestMethod(method);
	connection.setRequestProperty("Authorization", BASIC_AUTH);
	connection.setRequestProperty("Accept", "application/json");
	connection.setRequestProperty("Content-Type", "application/json");

	return connection;
	}


	/* 
	 * Accepts as input a string of the question text, calls Watson
	 * QAAPI and returns the answer back as a String.
	 */
	public static String getQAAPIResponse(String questionText) {
	ObjectMapper mapper = new ObjectMapper();
	JsonNode resp=null;
	String ans=null;
	System.out.println("QAAPI url: " + QAAPI_URL);
	HttpURLConnection connection;
	try {

	connection = createConnection(QAAPI_URL,"POST");
	
	connection.setRequestProperty("X-SyncTimeout", "30");
	questionText = questionText.replaceAll("\"", "");
	questionText = "\"" + questionText + "\"";
	String s = "{ \"question\" : { \"questionText\" : " + questionText + "}}";
	
	JsonNode nd = mapper.readValue(s, JsonNode.class);
	
	connection.setInstanceFollowRedirects(false);
	OutputStream wr = connection.getOutputStream();
	wr.write(nd.toString().getBytes());
	wr.flush();
	wr.close();
	if (connection.getResponseCode() != HttpURLConnection.HTTP_CREATED &&
	connection.getResponseCode() != HttpURLConnection.HTTP_OK && 
	connection.getResponseCode() != HttpURLConnection.HTTP_MOVED_TEMP) {
	throw new RuntimeException("Failed : HTTP error code : "
	+ connection.getResponseCode());
	}

	BufferedReader br = new BufferedReader(new InputStreamReader(
	(connection.getInputStream())));

	String output=null;
	while ((output = br.readLine()) != null) {
		resp = mapper.readValue(output, JsonNode.class);
		if(resp == null) {
		logger.log(Level.WARNING,"system response is null");
		} else {
		ans = resp.get(0).get("question").get("evidencelist").get(0).get("text").toString();
		}
	}
	connection.disconnect();
	} catch (IOException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
	}
	return ans;
	}	
}

// End SpigotQAAPI.java
```

请注意，代码中使用的实际 Watson QA URL 为：

https://gateway.watsonplatform.net/question-and-answer-beta/api/v1/question/healthcare 

但是凭据返回的 URL 为 

https://gateway.watsonplatform.net/question-and-answer-beta/

Bluemix 中的 Watson Q&A 服务的 REST API  文档解释道，为旅游启用了一个语料库，为医疗启用了另一个语料库，所以要向医疗语料库询问问题，需要使用 /api/v1/question/healthcare 扩展该 URL。

另外，一定要将 qa_username 和 qa_password 替换为您在 [本教程前面](https://www.ibm.com/developerworks/cn/cloud/library/cl-bluemix-minecraft-watson-trs-4/#step1) 创建一个 Watson QA 服务实例时获得的凭据：

```
static String QA_USERNAME = qa_username;
static String QA_PASSWORD = qa_password;
```

12.取消注释 WatsonQA.java 中的以下两行：

```
String response = SpigotQAAPI.getQAAPIResponse(question);
sender.sendMessage("Watson response: " + response);
```

13.要为服务器提供 Watson 插件的信息，可选择 `src` > `New` > `File` 来在 src 文件夹中添加一个新文件，并将它命名为 plugin.yml。

![添加 plugin.yml 的屏幕截图]()

14.将以下行添加到 plugin.yml 中：

```
name: WatsonSpigotPlugin
main: com.ibm.minecraft.spigotplugin.WatsonQA
version: 1.0

commands:
  hello:
    description: A new command
  watson:
    description: watson initial command
```

15.定义一个 MANIFEST.MF 来引用该插件的依赖项 jar。在 WatsonSpigotPlugin 项目下，创建一个新文件夹并将其命名为 META-INF。在 META-INF 文件夹中，创建一个新文件并将其命名为 MANIFEST.MF。

16.将以下行添加到 MANIFEST.MF 中。确保该文件中的最后一行是一个换行符（回车键）。

```
Manifest-Version: 1.0
Main-Class: com.ibm.minecraft.spigotplugin.WatsonQA
Class-Path: lib/jackson-core-asl-1.9.13.jar lib/commons-codec-1.10.jar lib/jackson-mapper-asl-1.9.13.jar
```

17.在终端窗口中，创建一个目录，您将从该目录运行使用了 Watson Spigot 插件的 Spigot 服务器：

```
mkdir  $HOME/watsonspigotdir
```

18.在 Eclipse 中，将 WatsonSpigotPlugin 项目导出到一个 JAR 中，如下所示：

1. 单击 File > Export
2. 在 Java 下，选择 JAR File 并单击 Next
3. 在 Resources to Export 下，选择 WatsonSpigotPlugin，取消选择 .classpath 和 .project，将 JAR 的目标位置指定为您启动 Spigot 服务器的相同目录 ($HOME/watsonspigot) 并将它命名为 watsonqa.jar ($HOME/watsonspigot/watsonqa.jar)。
4. 单击 Next（不要单击 Finish）。
5. 再次单击 Next。
6. 在 JAR Manifest Specification 页面上，确保选择了 use existing manifest from workspace 选项。
7. 单击 Finish。

![将项目导出到 JAR 中的屏幕截图]()

19.运行 Docker，使用 WatsonSpigotPlugin 插件创建一个新映像。对于这一步，我们可通过 cd 命令进入 $HOME/watsonspigot 目录，该目录包含 dockerfile 和 watsonqa.jar：

![watsonspigot 目录的屏幕截图]()

20.编辑 $HOME/watsonspigot/dockerfile 以包含以下行：

```
# Version 0.0.3
# This version builds a spigot server
# using the recommended build strategy for spigot
# This is advantageous in that it's better for plugin development
# and fits well with the Docker approach
# it also adds a first Minecraft plugin into the bare spigot server
#
FROM ubuntu:14.04
MAINTAINER Kyle Brown “brownkyl@us.ibm.com”
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y default-jdk
RUN apt-get install -y wget
RUN mkdir minecraft
RUN wget "https://hub.spigotmc.org//jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar
RUN git config --global core.autocrlf input
RUN java -jar minecraft/BuildTools.jar
RUN echo "eula=true" > eula.txt
RUN mkdir plugins
ADD watsonqa.jar /plugins/watsonqa.jar
# Install unzip
RUN apt-get install -y unzip
RUN unzip -uo /plugins/watsonqa.jar -d /plugins/
CMD java -XX:MaxPermSize=128M -Xms512m -Xmx1024m -jar spigot-1.8.8.jar nogui
EXPOSE 25565

```

前面的代码清单中以粗体突出显示的行是与您在以前的代码中看到的其他 Docker 文件的主要区别。实际上，这些行在 $HOME/watsonspigot 下创建一个名为 plugins 的新目录，将 watsonqa.jar 复制到 plugins 目录，将该 jar 解压到 plugins 目录，然后运行 Spigot 服务器。需要这样才能确保该插件可访问所有需要的依赖项 jar，前面已经介绍过，这些 jar 已复制到 Eclipse 项目的 lib 目录下并已在 MANIFEST.MF 文件中引用。

21.按如下方式构建一个新 docker 映像：

```
docker build -t="parallels/watsonspigotplugin" .
```

运行具有 Watson QA 插件的 Spigot 服务器：

```
docker run -i -t -p=25565:25565 parallels/watsonspigotplugin
```

如果您看到以下行，则表明您具有 Watson 插件的 Spigot 服务器已成功启动：

```
[00:04:07 INFO]: [WatsonSpigotPlugin] Enabling WatsonSpigotPlugin v1.0
[00:04:07 INFO]: [WatsonSpigotPlugin] WatsonSpigotPlugin
[00:04:07 INFO]: Done (12.659s)! For help, type "help" or "?"
```

23.将您的 Minecraft 客户端连接到您的服务器（如本系列中前面的教程中所述）。

连接之后，向 Watson 询问一个问题，比如 “什么是糖尿病”。问题文本会传递到 Watson QA 实例，并将回复提供给发送问题的玩家。

![向 Watson 询问问题的屏幕截图]()

## 在 Bluemix 中托管具有 WatsonQA 插件的 Spigot 服务器

目前为止，我们已使用 Watson 插件在 Docker 容器本地验证了 Spigot 服务器的功能。接下来，让我们将此服务器托管在 Bluemix 上。

1.在 Linux 终端中，创建一个新目录 $HOME/watsonspigotbluemix：

```
mkdir $HOME/watsonspigotbluemix
```

2.将我们提取的 watsonqa.jar 复制到 $HOME/watsonspigot 中：

```
cp $HOME/watsonspigot/watsonqa.jar $HOME/watsonspigotbluemix/
```

3.创建一个 server.properties 文件 (vi server.properties)：

```
#Minecraft server properties
#(File modification datestamp)
spawn-protection=16
max-tick-time=60000
generator-settings=
force-gamemode=false
allow-nether=true
gamemode=0
enable-query=false
player-idle-timeout=0
difficulty=1
spawn-monsters=true
op-permission-level=4
resource-pack-hash=
announce-player-achievements=true
pvp=true
snooper-enabled=true
level-type=DEFAULT
hardcore=false
enable-command-block=false
max-players=20
network-compression-threshold=256
max-world-size=29999984
server-port=9085
server-ip=
spawn-npcs=true
allow-flight=false
level-name=world
view-distance=10
resource-pack=
spawn-animals=true
white-list=false
generate-structures=true
online-mode=false
max-build-height=256
level-seed=
use-native-transport=true
motd=A Minecraft Server
enable-rcon=false
```

4.创建一个包含以下代码的 dockerfile (vi dockerfile)：

```
# Version 0.0.3
# This version builds a spigot server
# using the recommended build strategy for spigot
# This is advantageous in that it's better for plugin development
# and fits well with the Docker approach
# it also adds a first Minecraft plugin into the bare spigot server
#
FROM ubuntu:14.04
MAINTAINER Kyle Brown “brownkyl@us.ibm.com”
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y openjdk-7-jre-headless
RUN apt-get install -y wget
RUN mkdir minecraft
RUN wget "https://hub.spigotmc.org//jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar
RUN git config --global core.autocrlf input
RUN java -jar minecraft/BuildTools.jar
RUN echo "eula=true" > eula.txt
ADD server.properties ./server.properties
RUN mkdir plugins
ADD watsonqa.jar /plugins/watsonqa.jar
RUN apt-get install -y unzip
RUN unzip -uo /plugins/watsonqa.jar -d /plugins/
CMD java -XX:MaxPermSize=128M -Xms512m -Xmx1024m -jar spigot-1.8.8.jar nogui
EXPOSE 9085
```

与我们之前为本地运行 Spigot 服务器而创建的 Dockerfile 的唯一区别是，我们添加了 server.properties 文件并公开了 9085 端口。

5.$HOME/watsonspigotbluemix 目录应类似于下图：

![该目录的屏幕截图]()

6.使用您的 Bluemix id、密码和 dev 空间登录到 Bluemix（如果您已设置命名空间，则不需要设置它）：

```
cf login
cf ic login
cf ic namespace set kozhaya
```

7.构建一个新 Docker 映像：

```
docker build -t watsonspigotbluemix .
```

8.标记创建的映像：

```
docker tag watsonspigotbluemix registry.ng.bluemix.net/kozhaya/watsonspigot
```

9.将 Docker 映像推送到 Bluemix：

```
docker push registry.ng.bluemix.net/kozhaya/watsonspigot
```

10.在 Bluemix 上运行 Docker 容器：

```
cf ic run --name=watsonspigot  --publish=9085 
registry.ng.bluemix.net/Kozhaya/watsonspigot
```

此命令成功运行后，它会返回一个 id：1b5fa8fe-c988-4b64-b238-546d6031da1e

![返回的 id 的屏幕截图]()


11.请求一个可用的 IP 地址：

```
cf ic ip request
```

![请求一个 IP 地址的屏幕截图]()

12.将返回的 IP 地址绑定到您在第 10 步中运行的 Bluemix Docker 容器：

```
cf ic ip bind <ip address> watsonspigot
```

![将返回的 IP 地址绑定到 Bluemix Docker 容器的屏幕截图]()

13.确认该 IP 地址已绑定到 Bluemix Docker 容器：

![确认该 IP 地址已绑定到 Bluemix Docker 容器的屏幕截图]()

14.将客户端连接到在 Bluemix 上托管的 Spigot 服务器。注意矩形框中的 IP 地址和椭圆形框中的端口号。

![IP 地址和端口号的屏幕截图]()

15.向 Watson 询问一个问题来验证功能：

```
/watson “What is Diabetes”
```

![向 Watson 询问问题的屏幕截图]()

## 添加 Disease 插件并咨询 Doctor Watson

在本节中，我们引入一个第三方插件 [Disease 插件](http://dev.bukkit.org/bukkit-plugins/byte-disease/)，它允许玩家将对传染病的恐惧带到 Minecraft 城镇中。加入了这些疾病后，您可通过我们之前介绍的插件来利用 Doctor Watson，获取这些疾病的定义和症状的信息，以及最佳的治疗方案。
要添加 Disease 插件，我们将需要向我们之前使用的 Dockerfile 中添加一个步骤来创建 Watson 插件。也就是说，我们需要下载 Disease 插件的 jar 并将它添加到 plugins 目录中。要引用它，我们需要编辑 Dockerfile（下面包含了一个副本）并添加下面以粗体突出显示的一行代码（靠近清单底部）。

```
# Version 0.0.3
# This version builds a spigot server
# using the recommended build strategy for spigot
# This is advantageous in that it’s better for plugin development
# and fits well with the Docker approach
# it also adds a first Minecraft plugin into the bare spigot server
#
FROM ubuntu:14.04
MAINTAINER Kyle Brown “brownkyl@us.ibm.com”
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y default-jdk
RUN apt-get install -y wget
RUN mkdir minecraft
RUN wget "https://hub.spigotmc.org//jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar" -O minecraft/BuildTools.jar
RUN git config --global core.autocrlf input
RUN java -jar minecraft/BuildTools.jar
RUN echo "eula=true" > eula.txt
RUN mkdir plugins
ADD watsonqa.jar /plugins/watsonqa.jar
# Install unzip
RUN apt-get install -y unzip
RUN unzip -uo /plugins/watsonqa.jar -d /plugins/
RUN wget “http://dev.bukkit.org/media/files/898/525/Disease-1.7.jar” -O plugings/Disease-1.7.jar
CMD java -XX:MaxPermSize=128M -Xms512m -Xmx1024m -jar spigot-1.8.8.jar nogui
EXPOSE 25565
```

对于这个 Dockerfile，您需要执行之前运行的相同步骤来构建一个 Docker 映像并运行它：

1.更改到您的 Dockerfile 所在的目录。出于演示的目的，我们假设我们位于之前引用来启动包含 Watson QA 插件（也就是 $HOME/watsonspigot）的服务器的相同目录：

```
cd $HOME/watsonspigot
```

2.按如下方式构建一个新 Docker 映像：

```
docker build -t="parallels/diseasewatsonspigotplugin" .
```

3.运行包含我们已下载的 Disease 插件和 Watson QA 插件的 Spigot 服务器，如下所示：

```
docker run -i -t -p=25565:25565 parallels/diseasewatsonspigotplugin
```

如果您看到以下行，则表明您具有 Disease 插件和 Watson 插件的 Spigot 服务器已成功启动：

![启动您的 Spigot 服务器的屏幕截图]()


4.将您的 Minecraft 客户端连接到您的服务器（如前面的教程中所述）。

连接之后，探究 Disease 插件和关联的命令，比如：

* /disease help
* /disease list
* /disease check
* /disease infect <player> <disease>

查阅完整的 [命令列表](http://dev.bukkit.org/bukkit-plugins/byte-disease/)。（一些命令需要管理员权限。）

现在您已可通过该插件访问针对医疗的 Watson QA，您可向 Doctor Watson 发送任何与疾病相关的问题。例如，发出下面这个命令来向 Watson 询问肺炎的最佳治疗方案：

```
/watson “How to treat Pneumonia”
```

![向 Watson 询问问题的屏幕截图]()

我们将在 Bluemix 上托管具有 Disease 和 Watson QA 插件的 Spigot 服务器的任务留给读者练习。您现在已知道如何将多个插件（包括 Watson 服务）组合到您的 Minecraft 服务器来创建一种更有吸引力的游戏体验。

## 结束语

现在您已了解如何在 Spigot 服务器中集成 Watson Q&A 服务并将它托管在 Bluemix 上的一个 Docker 容器中。尽管我们重点介绍的是 Watson Q&A 服务，但您也可使用一个或多个其他 Watson 服务来通过相同方法实现更有吸引力的游戏体验，比如 Dialog（想想在玩游戏时订购披萨）、Personality Insights（想想组建玩家团队）、Natural Language Classifier（想想通过玩家的问题理解他们的意图），以及 Visual Recognition（想想从图像中识别疾病症状）。

这个 developerWorks 教程系列 到此就结束了。在这里让您的 Minecraft 体验更上一层楼吧！
