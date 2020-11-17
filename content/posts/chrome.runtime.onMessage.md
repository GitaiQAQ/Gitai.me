---
layout:     post
title:      "Chrome 插件&离线应用开发的坑"
date:       2019-05-11
author:     "Gitai"
tags:
    - 记录
    - Chrome
---

因为 Chrome 的那些接口又臭又长，而且都是异步回调，所以很适合练手 Promise/async 这些东西，但是遇到一个很奇怪的问题

```js
const onMessage = (asyncFunc) => chrome.runtime.onMessage.addListener ((msg, sender, sendResponse) => {
    sendResponse (msg);
});
```

上面是一般操作，但是要是给这个 `asyncFunc` 实现异步阻塞就麻烦了。

```js
const onMessage = (asyncFunc) => chrome.runtime.onMessage.addListener (async (msg, sender, sendResponse) => {
    let data = await asyncFunc (msg, sender);
    sendResponse (data);
});
```

一般来说这样写都是没问题的，`await` 会被转化成状态机，等 `asyncFunc` 运行完成，把再继续执行，但是在这个方法上就出幺蛾子了。

必然会返回，如下错误

![The message port closed before a response was received.](https://i.loli.net/2019/05/12/5cd799305f690.png)

<!-- more -->

于是做了如下测试，我们知道事件循环的几个截断，最早是原生 Promise。

```js
const onMessage = (asyncFunc) => chrome.runtime.onMessage.addListener ((msg, sender, sendResponse) => {
    Promise.resolve().then(() => {
        sendResponse ({msg});
    })
});
```

很幸运的报错了，所以这个接口只支持同步的任务，会在当前栈完成之后，直接关闭消息端口。

[SO 上面有了解释和解决方法](https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent)。

事件监听器会在方法执行完成直接返回，除非 `return true`。这样会被转换成一个异步事件。

那么理想中的写法如何插入 `return true`，这是不可能的，函数被 `return` 就没然后了。所以只能用 Promise 改写。

```js
const onMessage = (asyncFunc) => chrome.runtime.onMessage.addListener (async (msg, sender, sendResponse) => {
    new Promise(async (resolve) => {
        resolve(await asyncFunc (msg, sender))
    }).then(data => {
        sendResponse ({
            msg: data
        });
    }, err => {
        sendResponse ({
            err
        });
    });
    return true;
});
```

之后再精简一下

```js
const onMessage = (asyncFunc) => chrome.runtime.onMessage.addListener ((msg, sender, sendResponse) => {
    Promise.resolve(asyncFunc (msg, sender))
        .then(
            data => sendResponse ({ msg: data }),
            err => sendResponse ({ err }));
    return true;
});
```

`Promise` 注册一个异步事件回调，而函数返回 `true`，等执行完成在返回，然后 Chrome 关闭消息端口。

这种接口太魔幻了，很有意思的是同样的接口设计在 `Webpack` 中也有。

![](https://ask.qcloudimg.com/http-save/yehe-1687375/me5z2miubc.jpeg?imageView2/2/w/1620)

估摸着这是同时具有同步和异步操作的接口的一种优秀设计？？？为啥不强制都转化为异步，大概是历史遗留问题？