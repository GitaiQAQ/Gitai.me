---

layout:     post
title:      "Docker 下运行 Apache Beam 的例子"
source: https://medium.com/@0x0ece/a-quick-demo-of-apache-beam-with-docker-da98b99a502a
date:       2017-04-23
author:     "Gitai"
categories:
    - Docker
    - 翻译
tags:
    - 记录

---

Apache Beam 是一个标准的编程模块，用于创建批处理和流式数据处理管道。

简言之,这是一个 Java SDK，我们可以使用它来开发分析管道，如计算用户或事件，提取热门话题，或者分析用户会话。

在这篇文章中，将说明如何在数分钟内启动一个 Apache Beam 的 demo ，得益于 docker 预打包的 Apache Flink 和 Beam。

开始创建梁管道的 demo 也可以在 [Github](https://github.com/ecesena/beam-starter) 上找到。

为了运行这个 demo， 我没需要 docker 和 docker-compose，为了运行 Beam 我们还需要 Java 和 Maven。

<!--more-->

## 在 docker 中部署 Flink 和 Beam

首先 clone 最新的 repo， 包好我们需要使用的全部 [docker-compose.yml](https://github.com/ecesena/docker-beam-flink/blob/master/docker-compose.yml) 文件。



```shell
$ git clone https://github.com/ecesena/docker-beam-flink.git
$ cd docker-beam-flink
```

运行一个集群，我们也可以缩放他


```shell
$ docker-compose up -d
$ docker-compose scale taskmanager=2
```

我们现在有一个运行中的 Flink 集群：

```shell
$ docker ps
CONTAINER ID IMAGE      ... NAMES
3d59d952d152 beam-flink ... dockerbeamflink_taskmanager_2
4cce6219be80 beam-flink ... dockerbeamflink_taskmanager_1
3b7b6b32b4de beam-flink ... dockerbeamflink_jobmanager_1
```

启动脚本上传一个预打包 Beam 自定义的 JAR。在集群上的更多技术细节，参考[Repo](https://github.com/ecesena/docker-beam-flink.git)

## 运行 HelloWo — ehm, WordCount

打开 Flink 管理页面，开放与于 48080 端口。比如在 Mac 和 Windows 上

```shell
$ open http://$(docker-machine ip default):48080
```

## 按照以下步骤

1. 在左侧菜单，点击 `Submit new Job` — 我们将发现 `beam-starter-0.1.jar` 已经被上传。
2. 选中 `beam-starter-0.1.jar` 旁边的复选框
3. 点击 `Submit` 或者 `Show Plan` ，不需要额外的参数。

![](https://cdn-images-1.medium.com/max/1000/1*HXjlgfjDZRt9EmsG9vNgbg.png)

祝贺你,我们现在运行了的第一个管道！

接下来分析以上流程，JAR 文件是从[starter repo](https://github.com/ecesena/beam-starter)。通过默认运行 WordCount 类，从 `/tmp/kinglear.txt` 输入文件，并输出于 `/tmp/output.txt`。输入文件已经被预载入于 Docker 镜像中，所以所有的 Flink 任务管理器可以读取到它。

我们可以连接到任务管理器来检查结果，并查看输出文件的内容。注意输出是从 `/tmp/output.txt` 开始的多个文件。


```shell
$ docker exec -it dockerbeamflink_taskmanager_1 /bin/bash
$ cat /tmp/output.txt*
...
live: 13
long: 15
look: 14
lord: 90
lose: 6
...
```

## 构建 Beam 管道

最后，让我们来看如何构建我们自己的 JAR 文件。

这个 repo 被用于 WordCount demo 是构建于 [Flink 运行器的 Beam 文档](https://github.com/apache/incubator-beam/tree/master/runners/flink) 的微小变化，克服一些不精确。这是一个好的开始来构建任何 Beam 管道。

只需要 Clone 这个起始 repo 并且构造它：

```shell
$ git clone https://github.com/ecesena/beam-starter
$ cd beam-starter
$ mvn clean package
```

最后一个命令将创建一个 JAR 文件在目标目录中。我们能上传 JAR 通过 Flink 网页并且从上面的例子我们看到运行它。

从这里，它应该很容易调整文件 [WordCount.java](https://github.com/ecesena/beam-starter/blob/master/src/main/java/com/dataradiant/beam/examples/WordCount.java) 和创建其他管道。

作为一个具体的例子,[分析Twitter上的热门话题奥斯卡](http://oscarsdata.github.io/)。你可以计划一个项目,也许通过使用这个初始化 repo 或者 Docker 镜像。

