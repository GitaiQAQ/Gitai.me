---

layout:     post
title:      "Docker 运行 Spark 集群"
date:       2017-05-03
author:     "Gitai"
categories:
    - Docker
tags:
    - Docker
    - Spark

---


![][1]

<!-- nore -->

## 安装 docker 环境

参见之前的容器化系统的初始化教程。

```shell
# curl -sSL get.docker.com | bash
# pip install docker-compose
```

```
$ git clone https://github.com/gettyimages/docker-spark.git
```

```shell
.
├── conf
│   ├── master
│   │   └── spark-defaults.conf
│   └── worker
│       └── spark-defaults.conf
├── data
├── docker-compose.yml
├── Dockerfile
├── LICENSE
└── README.md
```

```
master:
  image: gettyimages/spark
  command: bin/spark-class org.apache.spark.deploy.master.Master -h master
  hostname: master
  environment:
    MASTER: spark://master:7077
    SPARK_CONF_DIR: /conf
    SPARK_PUBLIC_DNS: 112.74.108.69
  expose:
    - 7001
    - 7002
    - 7003
    - 7004
    - 7005
    - 7006
    - 7077
    - 6066
  ports:
    - 4040:4040
    - 6066:6066
    - 7077:7077
    - 8080:8080
  volumes:
    - ./conf/master:/conf
    - ./data:/tmp/data

worker1:
  image: gettyimages/spark
  command: bin/spark-class org.apache.spark.deploy.worker.Worker spark://master:7077
  hostname: worker1
  environment:
    SPARK_CONF_DIR: /conf
    SPARK_WORKER_CORES: 2
    SPARK_WORKER_MEMORY: 1g
    SPARK_WORKER_PORT: 8081
    SPARK_WORKER_WEBUI_PORT: 8081
    SPARK_PUBLIC_DNS: 112.74.108.69
  links:
    - master
  expose:
    - 7012
    - 7013
    - 7014
    - 7015
    - 7016
    - 8881
  ports:
    - 8081
  volumes:
    - ./conf/worker:/conf
    - ./data:/tmp/data
```

> 修改一下端口，要不单机模拟扩容会冲突，但是这样端口就无法在 master 节点更新了

> - [ ] TODO +1

启动容器集群

```
# docker-compose up
```

```
# docker ps --format  "{{.Image}}\t{{.Names}}\t{{.Ports}}"
gettyimages/spark       dockerspark_worker_1    7012-7016/tcp, 8881/tcp, 0.0.0.0:32769->8081/tcp
gettyimages/spark       dockerspark_master_1    0.0.0.0:4040->4040/tcp, 0.0.0.0:6066->6066/tcp, 0.0.0.0:7077->7077/tcp, 0.0.0.0:8080->8080/tcp, 7001-7006/tcp
```

弹性伸缩

```
# docker-compose scale worker=3
```

```
# docker ps --format  "{{.Image}}\t{{.Names}}\t{{.Ports}}"
gettyimages/spark       dockerspark_worker_2    7012-7016/tcp, 8881/tcp, 0.0.0.0:32771->8081/tcp
gettyimages/spark       dockerspark_worker_3    7012-7016/tcp, 8881/tcp, 0.0.0.0:32770->8081/tcp
gettyimages/spark       dockerspark_worker_1    7012-7016/tcp, 8881/tcp, 0.0.0.0:32769->8081/tcp
gettyimages/spark       dockerspark_master_1    0.0.0.0:4040->4040/tcp, 0.0.0.0:6066->6066/tcp, 0.0.0.0:7077->7077/tcp, 0.0.0.0:8080->8080/tcp, 7001-7006/tcp
```

容器 shell

```
# docker exec -it dockerspark_master_1 /bin/bash
root@master:/usr/spark-2.1.0# 
```

spark-shell
```
# docker exec -it dockerspark_master_1 spark-shell
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
17/05/16 01:45:59 WARN util.NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Spark context Web UI available at http://112.74.108.69:4040
Spark context available as 'sc' (master = spark://master:7077, app id = app-20170516014601-0000).
Spark session available as 'spark'.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 2.1.0
      /_/
         
Using Scala version 2.11.8 (Java HotSpot(TM) 64-Bit Server VM, Java 1.8.0_112)
Type in expressions to have them evaluated.
Type :help for more information.

scala> 
```

Example: SparkPi
```
# docker exec -it dockerspark_master_1 run-example SparkPi 100
17/05/16 01:47:22 INFO spark.SparkContext: Running Spark version 2.1.0
...
17/05/16 01:47:40 INFO scheduler.TaskSetManager: Finished task 88.0 in stage 0.0 (TID 88) in 124 ms on 192.168.0.3 (executor 0) (88/100)
...
Pi is roughly 3.1419671141967114
...
17/05/16 01:47:41 INFO spark.MapOutputTrackerMasterEndpoint: MapOutputTrackerMasterEndpoint stopped!
...
17/05/16 01:47:41 INFO util.ShutdownHookManager: Deleting directory /tmp/spark-f7c78546-8dbe-4f1b-a31a-ee1d554b86e7
```


## 构造 sbt 编译环境

```
FROM java

RUN wget https://dl.bintray.com/sbt/debian/sbt-0.13.15.deb \
    && dpkg -i sbt-0.13.15.deb \
    && mkdir -p /root/.sbt \
    && echo "[repositories]"  >> /root/.sbt/repositories \
    && echo "  local"  >> /root/.sbt/repositories \
    && echo "  aliyun: http://maven.aliyun.com/nexus/content/groups/public/"  >> /root/.sbt/repositories \
    && echo "  central: http://repo1.maven.org/maven2/"  >> /root/.sbt/repositories

VOLUME /data
WORKDIR /data

CMD ["sbt package"]
```

编译

```
# docker run --rm -it -v ~/source_of_scala_project:/data sbt-package bash
root@3c97d3254fcc:/# cd data
root@3c97d3254fcc:/# sbt package
[info] Loading project definition from /data/project
[info] Set current project to Simple Project (in build file:/data/)
[info] Updating {file:/data/}data...
...
[info] Done updating.
[success] Total time: 116 s, completed May 16, 2017 1:58:13 AM
```

```
# ls target/scala-2.10
README.md  classes  simple-project_2.10-1.0.jar
```

然后切换到 `spark_master` 节点运行这个例子

```
# docker exec -it dockerspark_master_1 spark-submit --class "SimpleApp" --master local[4] /tmp/data/simple/target/scala-2.10/simple-project_2.10-1.0.jar
```

[^getting-started-with-spark-and-docker]: [Getting started with Spark and Docker](https://sparktutorials.github.io/2015/04/14/getting-started-with-spark-and-docker.html)

[^running-spark-on-docker-swarm]: [Running Spark on Docker Swarm](http://ninjacatz.hatenablog.com/entry/2017/01/11/224503)

[^docker-spark]: [docker-sparkインストール手順](https://medium.com/@aoc/running-spark-on-docker-swarm-777b87b5aa3)


  [1]: https://sparktutorials.github.io/img/posts/sparkDocker/sparkdocker.png