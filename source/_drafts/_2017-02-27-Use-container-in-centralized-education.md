---

layout:     post
title:      "Use container in centralized education"
date:       2017-02-27
author:     "Gitai"
categories:
    - Docker
tags:
    - 记录

---


====

## Project Design Preliminary Summary：

本方案采用虚拟化和容器化技术，对传统平台进行资源整合优化。

This solution uses virtualization and containerization, for optimize resource in the traditional platform.

传统集中式教育中，各类开发和学习总以环境配置为起点。而滞后的资源和新的运行环境不断被开发，致使环境配置难度日益增大，而管理投入低和维护人员能力的不统一，也无力支撑配套系统的升级。部分机构还原精灵及相关方案才刚刚被类似 BXP 等方案代替取代。但是镜像的制作也非易事。

Traditional centralized education, all kinds of development and learning always take the environment as a starting point. And the lagging resources and the new operating environment has been developed, resulting in increasing the difficulty of environmental configuration, and management of low investment and maintenance personnel level of the missing, but also unable to support the upgrading of supporting systems. Part of the agency's program has just been replaced by a similar program such as BXP. But image generation is not easy.

即使引入 BXP 等方案，镜像的制作也难以支持项目的变化。而且冗杂的系统环境也分散使用者精力，对配套的网络环境也有极大要求。

Even if the introduction of BXP and other programs, image generation is also difficult to support the project changes. And the complexity of the system environment is also decentralized user effort, the network environment also has special requirements.

### 传统虚拟化：[^3]

### Traditional Virtual Machines：[^3]

1999 年 VMware 所推出的 VMware workstation 以及随后推出了ESX Server，它可以运行在裸机上并且不需要宿主操作系统。为现代商业环境下的虚拟化提供启发。

The VMware workstation, powered by VMware in 1999, and the subsequent launch of ESX Server, runs on bare metal and does not require a host operating system. Providing inspiration for virtualization in a modern business environment.

而众多云计算服务商也基于 XEN-HVM 和 KVM 等方案充分利用闲置资源，降低企业基础服务成本。

And many cloud computing service providers are based on XEN-HVM and KVM and other programs to make full use of idle resources, reduce the basic cost of business services.

服务端虚拟化是以已经树立业界地位的VMware，Microsoft，以及Citrix等公司为代表的虚拟化业界里最活跃的部分。运用服务器虚拟技术，一个物理的机器可以被分成多个虚拟的机器。—— 虚拟化导论[^1]

Server-side virtualization is the most active part of the virtualization industry, represented by companies such as VMware, Microsoft, and Citrix, which have established industry status. Using server virtualization technology, a physical machine can be divided into multiple virtual machines. - Introduction to virtualization [^1]

但是虚拟化不仅仅是一个关于服务端的概念。这一技术可以被应用于广泛的计算领域，包括各种虚拟化：

But virtualization is not just a concept about the server. This technology can be used in a wide range of computing areas, including a variety of virtualization:

* 整个机器，包括服务器和客户端两者
* 应用程序/桌面
* 存储
* 网络

* Server
* Software/Desktop
* Storage
* Network

优点：

Advantages：
* 提升硬件利用率——带来的结果是硬件的节省，减少了管理的开销,并节约了能源。
* 安全——干净的镜像可用来重建受损的系统。虚拟机也同样可以提供沙盒和隔离来限制可能的攻击。
* 开发——调试和性能监控的用例能够以可重复的方式方便的搭建起来。开发者也可以容易的访问平时在他们的桌面系统上不易安装的操作系统。

* Reduced spending. For companies with fewer than 1,000 employees, up to 40 percent of an IT budget is spent on hardware. Purchasing multiple servers is often a good chunk of this cost. Virtualizing requires fewer servers and extends the lifespan of existing hardware. This also means reduced energy costs.

* Easier backup and disaster recovery. Disasters are swift and unexpected. In seconds, leaks, floods, power outages, cyber-attacks, theft and even snow storms can wipe out data essential to your business. Virtualization makes recovery much swifter and accurate, with less manpower and a fraction of the equipment – it’s all virtual.

* Better business continuity. With an increasingly mobile workforce, having good business continuity is essential. Without it, files become inaccessible, work goes undone, processes are slowed and employees are less productive. Virtualization gives employees access to software, files and communications anywhere they are and can enable multiple people to access the same information for more continuity.

* More efficient IT operations. Going to a virtual environment can make everyone’s job easier – especially the IT staff. Virtualization provides an easier route for technicians to install and maintain software, distribute updates and maintain a more secure network. They can do this with less downtime, fewer outages, quicker recovery and instant backup as compared to a non-virtual environment. 

* Maximize resources — Virtualization can reduce the number of physical systems you need to acquire, and you can get more value out of the servers.  Most traditionally built systems are underutilized. Virtualization allows maximum use of the hardware investment.

* Multiple systems — With virtualization, you can also run multiple types of applications and even run different operating systems for those applications on the same physical hardware.

* IT budget integration — When you use virtualization, management, administration and all the attendant requirements of managing your own infrastructure remain a direct cost of your IT operation. 

缺点：

Disadvantages： 

* 性能——虚拟技术将有效地划分一台物理机器上的资源，比如RAM和CPU等。再加上hypervisor的开销，对于追求性能最大化的环境而言可能这并不是最理想的结果。    

* Upfront costs. The investment in the virtualization software, and possibly additional hardware might be required to make the virtualization possible. This depends on your existing network. Many businesses have sufficient capacity to accommodate the virtualization without requiring a lot of cash. This obstacle can also be more readily navigated by working with a Managed IT Services provider, who can offset this cost with monthly leasing or purchase plans.

* Performance - Virtual technology will effectively divide resources on a physical machine, such as RAM and CPU. Coupled with the overhead of the hypervisor, this may not be the ideal result for an environment that pursues a maximum performance.

## Docker[^2]

相对于传统虚拟化 Docker 采用共用内核和 UnionFS 有效降低镜像空间，采用 cgroup 和 namespace 控制权限并将服务进程化，使单机运行海量微服务成为可能。

Compared to traditional virtualization, Docker uses a shared kernel and UnionFS to effectively reduce the mirror space, using cgroup and namespace control permissions and service processes. Making it possible to run mass micro services.

本方案充分运用以上技术，以 Linux 内核和服务必要的基础环境构造微服务化的操作系统，运用 UnionFS 技术保证镜像时效性，和环境的标准化。而基于 Docker 的底层架构又能更方便的接入标准外部服务。

This program makes full use of the above technology, the Linux kernel and the necessary basic environment to construct a micro-service operating system, the use of UnionFS technology to ensure mirror timeliness, and environmental standardization. And Docker-based infrastructure can be more convenient access to standard external services.

# 请从市场、使用场景、创新性等角度对项目进行描述。

本方案适用于各类集中式教育场景，如：学校和培训机构等
主要解决以下几点问题：
1. 教育时环境的轻量化，提高物理设备的有效利用
2. 逐层构造的镜像可以便于项目或者任务特殊环境的搭建
3. 终端数据采用数据卷储存，第三方储存服务或者架设私有云储存服务，一键迁移
4. 基于 docker 技术，可以充分利用现有资源如： 
    1. 算法测试（Openjudge）
    2. 支持数据处理和大数据展示的云笔记（Jupyter Notebook）

# 请重点描述项目中Windows Azure的相关功能

继承并加入特定 Docker 的中心 Registry 以及项目主页将运行于 Azure 平台上。

# 团队各成员是如何分工的？

独立全栈开发，广泛运用现有开源技术并遵守相关开源协议

[^1]:[虚拟化导论](http://www.infoq.com/cn/articles/virtualization-intro)

[^2]: [Docker源码分析（一）：Docker架构](http://www.infoq.com/cn/articles/docker-source-code-analysis-part1)

[^3]: [微软虚拟化技术——构建高效开发与测试环境](http://www.infoq.com/cn/articles/xl-microsoft-virtualization)

[^4]: http://www.infoq.com/cn/articles/docker-source-code-analysis-part1

