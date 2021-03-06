---
layout:     post
title:      "遇上一个反直觉的 BUG"
date:       2019-01-16
author:     "Gitai"
tags:
    - Python
---



```python

app = Celery('tasks', backend='redis://localhost:6379/0', broker="amqp://guest:guest@localhost:5672")
```

官网的 Demo 就是这样写的，但是突然发现如果正式使用中，接口没做好兼容处理，比如增加一个新的异步任务，但是没有在旧的 worker 进行更新。就会遇到一个查找不到的错误；或者压根不知道放在那个主机上，就发现任务分配总是有规律的漏了几个。

这时候可以随便找个 worker 目录，用 `celery -A tasks status ` 快速查看配置状态。

比如 `Connection.open: (530) NOT_ALLOWED - vhost v2 not found` 是因为这个虚拟主机不存在，需要去 RabbitMQ 后台增加这个 vhost；同样的，这个接口也能发现之前遗留的 worker，然后手动更新或者删除来修复这个问题。

但是这次要吐槽的不是这些，是个更 emmm 的问题。。。

<!-- more -->

常见的配置存放方法都有个优先级。比如：硬编码高于配置文件，而配置文件不如环境变量，这样的用于多处重复定义进行覆盖。

但是硬编码一般优先级都是最高的，直到这次用 Celery，怎么调上面的 `broker` 都和最后运行的不一样；

![](https://i.loli.net/2019/01/16/5c3ea2c5d9967.png)

我甚至产生了。。。是不是 Celery 不支持 vhost 或者有其他命名空间啊这样的配置。然后照着源码找到了 `celery.app.utils` 的`Settings` 对象。

![](https://i.loli.net/2019/01/16/5c3ea2671a14c.png)

emmm，为啥硬编码的 `broker_write_url` 和 `broker_url` 会被环境变量覆盖。。。这个逻辑不是很能理解。。。吐槽结束。。。

哦 对了，还有个`async`命名冲突的问题，4.x 不打算修，5.x 才修。。。