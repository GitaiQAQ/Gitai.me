---
layout:     post
title:      "前端中的欧·亨利式笔法"
date:       2020-03-21
author:     "Gitai"
tags:
	- 骚操作
---

简道云是帆软旗下的一个表单 SaaS，几年前调研自定义表单的时候发现的，在此之前还没人把 BaaS 和表单融合在一起；虽然基础原理简单，如果想实现 Demo 的话，一个工作流引擎和 From 生成工具就能实现 50% 的功能；但是其余 50% 可就厉害了，云 Excel ？大概就是这么个立意，大部分人 Excel 的用法也都能被他代替。

至于写这篇文章，只是突然发觉这种打印实现形式非常新颖，以前咋就没想到？类似的用 performance 计算资源加载时间也一样，虽然很简单，但是想不到还真是垃圾。

![image-20200321155157391.png](https://i.loli.net/2020/03/21/pimuSoFbBqLyteA.png)

<!-- more -->


在简道云的打印中会发现这样一个神奇的东西，打印的内容的旁边的页面完全不一样。

好吧，这是个正常需求，也不是很奇怪。

但是神奇的是 Ctrl+P 也是这个结果？这就不那么常见了

一般情况下前端对于打印这个操作的处理有 iframe，构造 PDF 的 data-url，以及服务器生成，这几种常见方法。

服务器的话就可以用 Headless browser 来打印 PDF，然后把这个地址丢回客户端。

从浏览器技术的发展历史来看这个问题

最早的是直接 `window.print`，这是 DOM Level 0 实现的内容，这个时代为了实现局部打印只能把当前页面的 HTML 暂存起来，然后通过修改 body 实现所谓的局部打印，实际上是一个新的临时页面。

```js
var HTML_Backup = window.document.body.innerHTML;
window.document.body.innerHTML = printed_HTML;
window.print();
window.document.body.innerHTML = HTML_Backup;
```

显而易见的这种方式性能是非常底下的，但是正如早期的 HTTP 1.0 协议一样，都是基本能用的水平。

随后是 [HTML 4.01](https://www.w3.org/TR/html401/present/frames.html#h-16.5) 的时代，这时候 iframe 出现了，开发者可以通过对子 iframe 的操作来构造子页面，并且不会影响当前页面。下面的代码直接用 window.open 也是可以的，甚至银行的账单还是这个方式。。。

```html
<iframe id="printf" name="printf"></iframe>
```

```js
var newWin = window.frames["printf"];
newWin.document.write('<body onload="window.print()">dddd</body>');
newWin.document.close();
```

但是毕竟构造 iframe 还是很麻烦，如果和当前页面一致性非常高，这样做的成本还是很高的。

在这段时间还出现了 jsPDF 这种库，通过直接构造二进制的 PDF 内容实现这个需求，极其硬核。

到了 CSS 3 的时代，我们可以通过媒体查询来屏蔽部分区块

```css
@media print{
  body{
    background: #fff;
  }
}
```

或者可以通过 Canvas 对 HTML 的部分支持，直接把 HTML 丢进 Canvas 然后通过 Canvas 导出媒体数据，打包进 PDF？3年前我还这样干过，这种方法也是主流，因为 jsPDF 对中文支持不是那么友好，光字库文件就几十兆了，虽然可以通过 fontmini 这类的方式进行裁剪，但普适性远不如直接 Canvas 生成图片在融进 PDF里。

上面说了这么多没用的，今天要说的这个用例，就有种欧·亨利式的感觉。

如果现在有上面这种需求，你需要打印一个完全不一样的页面出来，你会怎么处理？估计大部分都想到构造塞 iframe 里面。Ok，这是一个非常好的方法，但是问题来了，如果又加了这样一个需求，对 Ctrl + P 也要能够响应。

完了这个时候，上面这些方案全军覆没，还剩一个令人没想到的，把 `@media` 反过来用，我们再来看看媒体查询的相关说明。

>  @media CSS @规则 可根据一个或多个 媒体查询 的结果应用样式表的一部分。

一般也是这样理解的，一个或者多个只在需要隐藏的时候用。但是如果我们把整个页面隐藏了，然后把需要打印的内容显示出来？就和最早期的 `innerHTML` 替换一模一样，只是哪个会影响到浏览器的渲染流程，而这个完全按照标准的规范在走。

![image-20200321163320760.png](https://i.loli.net/2020/03/21/FjHcynwuVzUq8X5.png)
![image-20200321163700415.png](https://i.loli.net/2020/03/21/s2vYtHJE1x5XpRT.png)

是不是有那么一种这样也行的感觉？