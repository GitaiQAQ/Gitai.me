---

layout:     post
title:      "通用项目容器化小记"
date:       2017-08-28
author:     "Gitai"
tags:
    - Docker
    - 记录

---

Linux 容器(LXC) 和 Docker 技术可以提供一致的和可扩展的环境。

低损耗的运行环境带来微服务化和云端迁移的快速普及。但是多数应用和所属生态并不能直接迁移到容器中来。对此，以下将简单阐述一些一己之见。

 * **运行时** 环境构建
 * 数据 **持久化**（无状态）

<!-- more -->
 
## 诡异的接口

微服务首先需要对系统进行解耦，然后暴露通用接口进行调度。但是总有那么些作品将一切进行高度封装，自成体系。简单用起来尚且算是优雅，想二次封装就较为繁琐。

用 Flarum 和 Octobercms 来解释说一下容器封装

[mondediefr/docker-flarum](https://github.com/mondediefr/docker-flarum) 是一个 Flarum 的封装镜像。

这个镜像姑且算是不错了，首先打理一下他的运行时环境:

 * `nginx-php:7.1` 这个基础镜像基于 `Alpine` 缩小了整个镜像的体积。并且采用 `PHP 7.1`，性能也是非常好的，不过预设 `Nginx` 算是败笔，对于测试使用这样并没什么大碍，但是对于整个包含数据库，前端负载均衡，多个服务的大型环境来说 `Nginx` 复数存在对性能必然造成损害，对此 `Wordpress` 官方提供的构建方案[^wordpress]就是非常完美的，存在只暴露 `fpm` 接口的 `Apline` 方案。

 * 下载安装一气呵成，之后将自定义的配置模板文件覆盖在 `rootf` 路径，这一步的模板将在 `run` 时被覆写，看起来非常简单好用，实际上也是可圈可点，毕竟脚本不能面面俱到，就像百度 gcc 被三体人锁死 3.4.5 一样，只能重建镜像或者通过外部卷覆盖上去，但是既然要使用外部卷，那这模板又有何用？

 * 自定义 `run` 和 `extension`，这个封装就是非常 nice 的，首先在 `extension` 会记录用户操作，把这个记录持久化，之后在 `run` 中会读取这个记录，自动安装 `extension`，但是这个操作建立在 `flarum` 完全契合 `composer` 和 `composer` 有个优秀的 `cli` 组件的基础之上。

之后我们再来看看如何把上述经验运用到 October CMS 上

同样基于 `Laravel PHP Framework` 却抛弃了 `composer` 转而采用古老的 `plugins` 文件夹，至此 `composer` 近似于残废。

不过 October 提供了优秀的拓展管理系统和仓库，但是 GUI 本身就是会使机器可读性和 KISS 原则产生冲突，而仅仅提供一套并不完全通用（无法直接安装第三方包，官方仓库更新慢了不止一年），也无机器可读性的管理工具，实在无力吐槽，好在储存结构单一，可以自行写个脚本完全这些工作。

## 杂乱的文件树

Andrew Phillips 是 Xebia Labs 产品管理部门的副总裁将容器储存这个问题放在了第一位。[^1]

然后持久化数据，这个问题不做讨论，毕竟除了市场上那几个持久化方案，我也啥都不知道。

我们一直在尝试新的引用结构，但是文件树越来越乱。需要持久化的和静态运行时加载的都堆在一起，这给容器化带来相当多的不便。

于是可能出现光外部维护的配置卷，就能写一页，就更加麻烦了。

如：
```Dockerfile
  volumes:
    - ./dokuwiki/conf:/var/www/html/conf
    - ./dokuwiki/data/pages:/var/www/html/data/pages
    - ./dokuwiki/data/meta:/var/www/html/data/meta
    - ./dokuwiki/data/attic:/var/www/html/data/attic
    - ./dokuwiki/data/media:/var/www/html/data/media
    - ./dokuwiki/data/media_meta:/var/www/html/data/media_meta
    - ./dokuwiki/data/media_attic:/var/www/html/data/media_attic
    - ./dokuwiki/lib:/var/www/html/lib
```

以上还存在部分不需要持久化的资料，但是挑拣出来太费劲了。

目前看来容器化最麻烦的就是这几个问题，解决了这些也就能很容易的迁移了。所以即使不用容器技术，对于日常的架构来说，用容器的思想来规范和约束，或许能增加系统的鲁棒性。

[^1]: [8 Questionsneed Ask Microservices Containers Docker 2015](http://blog.xebialabs.com/2014/12/31/8-questions-need-ask-microservices-containers-docker-2015/)

[^wordpress]: [Docker Official Image packaging for WordPress](https://github.com/docker-library/wordpress)