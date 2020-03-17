---

layout:     post
title:      "LatticeOS Project"
date:       2017-03-28
author:     "Gitai"
categories:
    - LatticeOS
tags:
    - LatticeOS
    - Slide
    - Imagine Cup

---

* Home: https://latticeos.github.io/
* Github: https://github.com/LatticeOS/
* Slide of imagine cup 2017: https://latticeos.github.io/slide_imagine_cup_2017.html

<!--more-->

<iframe src="https://latticeos.github.io/slide_imagine_cup_2017.html" height="400px" width="100%"> </iframe>


## Speeches

本次提交的项目是基于容器化的操作系统

<!-- next page -->

因为它来源于当前存在的周多产品或者解决方案。

在此我们将先对有关的背景，技术和方向做出介绍。

<!-- next page -->

11 年 Google 公司发布了 chromebook，其使用的 chromeos 这是完全依赖云服务的系统。

<!-- next page -->

这是 futrue source 于去年发布的操作系统市场占有率的调查报告。从中可以轻易看出 chromeos 在教育市场上比重之大，甚至挤压了主流操作系统的份额。而本身 chromeos 又以优秀的用户体验，在全球市场占有一席之地。
而 chromeos 自发布起，一直被人诟病的是：理念过于超前，用户也无法适应。

<!-- next page -->

<!-- next page -->

从 13 年开始的比特币勒索问题，至今没有妥善的解决
去年的 xcodeghost，因为恶意劫持，造成大量用户数据的泄露(劫持正常软件)
今年年初的 gitlab 误删 300G 数据又是因为管理员误操作

以上几类都对计算机环境产生不可复原的后果。而在开发过程中有一句“不要相信收到的任何数据”。

没有什么服务是可信的，应先假定其存在危害，然后进行隔离和校验。

<!-- next page -->

苹果在 11 年引入 sandbox，对用户提供的完善的权限管理方案。

据说微软也在 Windows7 中开始引入容器，不过这只是传言。

而本项目为了提供相对完善的安全环境，基于容器化进行资源管理和权限控制，在 live demo 中我们会有相应的演示。

<!-- next page -->

这是第三方机构对容器化的描述。

<!-- next page -->

既然提到了容器化，不的不提虚拟化

虽然严格意义上，容器化不是虚拟化，但是结果来说，能取代部分虚拟化的功能。

这是docker官方发布的架构对照图。

<!-- next page -->

显然 docker 相对虚拟机更加轻量，但是提供了大致相同的解决方案。

因为不仿真内核和系统，使得资源利用率更高，也更适合封装成运行时环境。

<!-- next page -->

<!-- next page -->

Coreos CTO 提出容器技术将作为下一代包管理器。

<!-- next page -->

应用程序运行并不是单一文件，现有的应用基本都是调用系统和框架提供的接口，一层层的嵌套，最后触及内核和硬件。

<!-- next page -->

这是几个常见的框架，一般用户都基本安装了其中之一，甚至更多。

<!-- next page -->

那么包管理器是什么？这是维基百科的描述，简言之：自动管理应用程序部署状态的软件。

相对于 Windows，Linux 的依赖管理更复杂，因而出现了一堆各种各样的包管理器。

<!-- next page -->

因而如前面 coreos CTO 提出的容器作为包管理器，我们用容器作为环境分发，提供了更为复杂，灵活的软件分发方案。

<!-- next page -->

在过去几年中，使用容器来大规模部署程序的尝试已大大增加。原因很简单：容器封装了应用程序的依赖关系，以提供可重复且可靠的执行应用程序和服务，而无需完全虚拟机的开销。如果您为科学或深度学习应用程序花了一天时间为服务器提供了大量软件包，或者花了数周的时间来确保您的应用程序可以在多个Linux环境中构建和部署。

在此之前已经有如 wamp 之类的实现，用于分发 PHP 开发环境，其实许多其他部署复杂的软件也有自己的工具。

但是各种方案都只是应用级的打包，有的甚至破坏了原有结构关系。

<!-- next page -->

这是一个简单的多容器应用的例子

<!-- next page -->

这里还有几个优秀的容器部署例子

KDE neon ，这个项目用容器运行 KDE 的环境，让其他系统的用户免安装体验 KDE 的程序包。


![](https://c1.staticflickr.com/1/747/32111280196_9b2875a809_b.jpg)

https://community.kde.org/Neon/Docker

本身桌面环境是无比复杂的，除了基础的 GUI 接口，窗口管理器，还有一堆可用的挂件。

而容器化硬是把这些全部打包，然后整体分发。甚至利用 x11 的接口直接运行和渲染。

<!-- next page -->

近年机器学习盛行，而 GPU 在其中的作用是不可忽视的，但是复杂的运行环境，往往让数据科学家望而却步。

这是英伟达提供的容器化 GPU 计算单元的方式

![](https://devblogs.nvidia.com/parallelforall/wp-content/uploads/2016/06/nvidia-docker.png)

容器封装了应用程序的依赖关系，以提供可重现和可靠的执行。英伟达 Docker 插件可以在支持任何 Linux GPU 服务器上部署 GPU 加速应用程序。

Google 通过其公共容器存储库提供了 TensorFlow 的预先构建的 Docker 映像，而 Microsoft 为您提供了可构建自己的 CNTK 的 Docker 文件。

<!-- next page -->

<!-- next page -->

无状态和微服务是在服务器开发中广泛运用的技术，将储存环境和运行环境分离，提高可用性。再将运行环境继续分割，提高部署效率和迁移能力。

<!-- next page -->

这是一个简单的容器架构，右边的储存和左边的运行环境，相互独立但又可以操作。

<!-- next page -->

传统环境迁移极为复杂，而容器迁移看似简单，实际上真的这么简单。

<!-- next page -->
<!-- next page -->

储存卷也由容器驱动，因而也可以被替代，被迁移，但是当他遇上云储存，又能产生有意思的组合。

Chromebook 普遍只有16G的储存环境，作为一款云计算驱动的设备，自然成为云储存的大户。

同样容器卷也能轻松的接入各种云服务商和储存环境。

<!-- next page -->

<!-- next page -->
CoreOS 是来源于 chromeos 的云服务底层系统。

<!-- next page -->

* 体积小，保证容器运行的最小环境
* 只读的系统分区和双分区引导

<!-- next page -->
Lattice os
<!-- next page -->

<!-- next page -->
基于以上技术和方案， 我们拼和了一个完全容器化的操作系统，并采用 coreos 的只读和双分区引导，集群管理。

<!-- next page -->
<!-- next page -->
这是运行时的截图，包含窗口管理器/桌面，libreoffice 和 vscode

实际上完全可以删去桌面容器，那样开机产生的只是一个libreoffice 或者 vscode，一般做到这种需求是通过全屏化应用，置顶并禁用一些操作。

这是用加法在做减法。而完全组件化之后，所有部件都是可分离，可替代的，但是相对镜像级的定制，更为轻量。

<!-- next page -->

为了验证容器化的可行性，第一个服务就是启动自生，在开发阶段，我们一直用 docker-compose up 来启动容器组，但是在完成之后，我们将 docker-compose 也同时封装入容器内部，自然而然的兼容了各种环境，包含难以运行 docker-compose 的 coreos。

<!-- next page -->

这里是上传到 YouTube 的安装过程，因为时间有限，不在此赘述。

<!-- next page -->

这是 workspace 的开发工作区，采 nodejs + vue + vscode

因为容器互相继承，每个应用可以公用 data 卷提供的本地或者云储存。并且可以自行引入新的储存介质。

<!-- next page -->
接下来是 workspace ide 的使用，以及容器隔离性的展示

* 拉取 workspace 的开发镜像，这是基于 jess/vscode  拓展的 IDE，镜像地址和名称可能会被更新，具体参见文档说明
* vscode 启动了
* 在文件拾取器中可以发现，从desktop 共享出来的目录和文件
* 安装 vue 的相关插件
* vscode 会要求重载，但是这并不影响容器内的数据，这只是容器下进程级的重载。
* 这时 vue 的插件已经安装完成，至此我们可以对当前镜像做 commit 构造一个原生支持 vue 的 IDE
* 接下来说明容器内外的隔离特性
* 在 desktop 容器内创建一个文件夹和文件
* 然后打开 vscode 的文件拾取器， 查看变化
* 对应位置并没有出现对应文件
* 接下来在共享目录中写入文件
* 文件已经出现在 vscode 容器中了

<!-- next page -->

对此，部分厂商也早有自己的尝试，eclipse 的 Che 项目，基于容器等实现的 Workspace/DevBox（有各种不同的叫法，但实际上差不多是同一个东西，就是一个运行环境），很方便地一键创建运行环境， 先不说环境和隔离等好处，单说免去开发人员搭环境，就很值得推荐，让开发人员专注于开发。也减少了新用户搭建环境的时间和精力。

![](https://www.eclipse.org/community/eclipse_newsletter/2016/january/images/flow.png)

https://www.eclipse.org/community/eclipse_newsletter/2016/january/article1.php

或许这些例子侧重于开发，我们也尝试过 chromium 和 libreoffice， 实际上 linux 的所有软件，基本都是可以正常打包过来的。

<!-- next page -->

实际上在准备这ppt 时，我们发现了 Ubuntu core 有个类似的架构。

https://www.ubuntu.com/core
<!-- next page -->

再看这几项技术这几年的社区热度，除了 chromeos 可能因为已经普及，热度略有下降，docker 和 coreos 一路飙升。

<!-- next page -->
至于本项目的适用群体，从设计来说，所有人都很适合，但是现实上游戏厂商对于 Linux 的支持就说明暂时难以广泛推进。

但是如同 ChromeOS 提供教育市场一样，这种稳定，灵活的系统或许更适合教育，这是一张技术和行为的映射表

<!-- next page -->

双分区引导 — 滚动更新，免维护

容器化 — 运行环境分发，分发学习配套服务的环境

分层文件系统 — 资料的差异更新

远程储存卷 — 协作，共享

集群控制 — 集中式教学

<!-- next page -->
<!-- next page -->

但是我认为，应该先让传统用户习惯容器化

* 兼容的集成环境镜像，构建生态

* 作为远程教育，环境分发的解决方案，解决时间和空间上的不一致问题
* 最小可引导设备，为传统 PC 提供最廉价，最灵活，最轻量的使用方案
* 提供完整的在线教育解决方案