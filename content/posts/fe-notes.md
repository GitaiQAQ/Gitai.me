---
layout:     post
title:      "前端杂谈"
date:       2019-01-22
author:     "Gitai"
tags:
    - JavaScript
    - CSS
---

> 作用域和闭包：你知道JavaScript的词法作用域是基于编译器（而非解释器！）语义的吗？ 你能解释词法作用域和作为值的函数这两者的直接结果之一就是闭包吗？ 

> this 和对象原型：你能复述 this 绑定的四条基本原则吗？你是否还在用 JavaScript 的 “伪”类应付了事，而没有采用更简洁的“行为委托”设计模式？你听说过连接到其他 对象的对象（objects linked to other objects，OLOO）吗？ 

> 类型和语法：你了解 JavaScript 中的内置类型吗？更重要的是，你了解如何正确安全地使 用类型间强制转换吗？对于 JavaScript 语法 / 句法中的微妙细节，你的熟悉程度又如何？ 

> 异步和性能：你还在使用回调管理异步吗？你能解释 promise 是什么以及它为什么 / 如 何能够解决“回调地狱”这个问题吗？你知道如何应用生成器来使得异步代码更加清晰 吗？对 JavaScript 程序和具体运算的深度优化到底由哪些方面构成？ 

<!-- more -->

实际上 《你所不知的的 JavaScript》的每一个小结整理下来就是 JS 入门到精通的关键点，也是面试能问的全部问题。《JavaScript 高级程序设计》虽然事无巨细，但是总感觉欠缺了点什么，或许是详略不够的当。《JavaScript 权威指南》看了就不如看 MDN，而很多细节看一下标题就够了。

这部分选书的原则是，通识 JS 的基本操作，能讲清楚**作用域**，**原型链**和**控制流**这三个要点。

所以个人感觉，先找个 Hello World 学会客户端的 JS 操作，然后写个 Express 的项目了解异步，之后过度到 Koa 会用生成器的洋葱模型。这时候开始看《你所不知的的 JavaScript》来解决前面遇到的各种疑问，会突然感觉之前 JS 都白学了，但是如果没前面试错的过程，直接看书会有种迷迷糊糊的感觉。等弄明白 JS 的基本类型，对象，异步和 ES6 ，这时候就得看看《JavaScript 高级程序设计》或者《JavaScript 权威指南》，因为 Web APIs 这部分只能在这看到。

不过看完这些也不过是弄明白了个 JS，之后得去弄明白 CSS；哦对了，看本文之前假设都已经明白了 HTML，如果没明白，就去看看 《HTML5与CSS3权威指南》的前半部分。

这时候网页能写，但是会对浏览器的渲染逻辑迷迷糊糊的；好了，《CSS 世界》或许适合现在的我（之前按推荐看了《CSS 揭秘》，但是这时候还不用不上这些技巧），目前我就到这了。。。

而上面 CSS 阶段，主要是速记常用属性，之后理解**盒模型**和**流布局**。

因为有几年陆陆续续的基础，看完 JS 那部分大概用了一个月，HTML 就没看了，毕竟都用过，CSS 打算用一周把之前遗留的问题解决。

前端初级阶段大概就是这样，弄明白浏览器的渲染机制就行了；但是这只是前端巨坑的沧海一粟；先计划着，待我慢慢添加。

## CSS Tips

1. 锚点定位到元素的 border-box

2. padding 百分比值相对于宽度计算

3. 如果使用数值作为line-height的属性值， 那么所有的子元素继承的都是这个值；但是，如果使用百分比值或者长度值作为属性值，那么所有 的子元素继承的是终的计算值。

4. Facebook 的工程师 Stoyan 在他的博客中曾提过， 浏览器是聪明的，为了节约资源、不频繁触发 Repaint（重绘）、Reflow（重排），它会将一系列脚本中需要执行的 UI 改动放在一个队列中一起执行，而不是每个改动都单独执行从而引发无数次的 Repaint、Reflow。BUT！有一些操作会打乱它原有的 plan 和秩序：

   1. offsetWidth，offsetHeight，offsetTop，offsetLeft
   2. scrollTop, scrollLeft，scrollWidth, scrollHeight
   3. clientlTop, clientLeft，clientWidth, clientHeight
   4. getComputedStyle()，or currentStyle in IE

   浏览器对于这些操作，会“ 非常及时地 ”给予最准确实时的答案，因此会触发 Reflow，例如重新计算样式、更新图层等。要知道 Reflow 相比 Repaint 对渲染的影响更大、损耗更多。

5. 点太多。。。忘了

大佬整理的 CSS 技巧&布局 [^css-inspiration]

[^css-inspiration]: [CSS Inspiration -- CSS灵感](https://chokcoco.github.io/CSS-Inspiration/)
[^reflow]: [Webnovel 不用照顾 Edge 浏览器性能？想多了！](https://juejin.im/post/5c499f3cf265da615f77986a)

## 模块化

1. 直接定义依赖，1999，写入全局变量，会被绑定到 windows 的属性上
2. 命名空间模式，2002，将所有方法写入上面的变量里，通过 ns.xxx 调用
3. **闭包模块化模式**，2003，最常见的前端模块化方式，闭包形成内部作用域，防止污染，如：jQuery
4. YUI，命名空间+沙箱，模块开始被拆分，异步加载。
5. **CommonJS规范**，2009，Nodejs 引入，同步阻塞加载模块
6. AMD 规范的 RequireJS，前置加载，直接导入当前作用域
7. CMD 规范的 SeaJS[^cmd]，国内的作品，正则分析代码，按需加载
8. UMD 先判断 exports 对象是否存在，然后看 define 方法是否存在，都没就直接 IIFE
9. **Browserify**，2011，预打包，把 CMD 类似的分析过程提前到开发阶段，不过不是用正则，用 AST
10. **ES 6  Modules**，2015，`import/export` 关键字，原生模块化纳入日程，但是迫于兼容性，需要用下面提到的工程化工具预编译

[^cmd]: [Hello Sea.js](http://tinyambition.com/HelloSea.js/)

## 组件化[^web-component]

1. 工厂模式

2. **Backbone**，模板化

3. angular-directive，自定义标签，双向绑定

4. React，JSX，单项数据流，函数式

[^web-component]: [Web Component：过去、现在和未来](https://tech.youzan.com/web-component/)

## 工程化

1. gulp 主要有任务（task）和文件，剩下的就是监控，把文件转化成 Transform Streams 丢给 task 的 pipe，**并发**执行，然后写出文件；改成同步需要使用 Promise。

2. babel 是个生成 AST，调用插件修改 AST，重新生成兼容代码。

3. webpack 是个打包工具[^webpack-handbook]，内部通过 tapable 实现事件流，插件注册对应的事件。

   调用 babel，scss，tsc，PostCSS 之类的进行编译导入，这里对应 loader；最主要的是对 JS 的模块化处理，统一将 ES6 模块，AMD 转化为 CommonJS，因为 JS 全被打包进内存，所以不会被阻塞（未拆分的情况下）；拆分的话会定义 Promise，然后异步加载回调返回结果[^webpack-commonjs]；plugin 会注册进 webpack 里面的钩子，修改默认实现，比如内嵌 css 生成独立样式文件。

   热更新通过 event-stream 推送，webpack 会在每个模块上包装一个热更新的组件，在接收到推送后冒泡更新。css 直接替换样式表，vue 和 react 直接 hook render 函数。

   如果有 Nodejs 开发经验的，应该很容易发现 webpack 的配置模式，早在服务端广泛运用，不过加了 Promise 更有意思了。

> Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。[^webpack]

[^webpack-handbook]: [Webpack 中文指南](https://zhaoda.net/webpack-handbook/)
[^webpack]: [深入浅出 Webpack](http://webpack.wuhaolin.cn/)
[^webpack-commonjs]: [webpack模块化原理-commonjs](https://segmentfault.com/a/1190000010349749)https://segmentfault.com/a/1190000010349749)
[^webpack-hot]: [webpack热更新流程](https://github.com/kaola-fed/blog/issues/238)

## 前端安全[^web-security]

* XSS(Cross-Site Scripting) 跨站脚本攻击，利用未转义的输入输出运行不安全的脚本获取隐私数据。[^ws2]
* CSRF(Cross Site Request Forgery)，跨站请求伪造，建立在 Cookies 被人拿走了的基础上。[^ws1]
* 点击劫持，你看见的不一定是真的，类似的点击穿透问题是个 BUG。[^w1]
* URL 跳转漏洞，短网址服务了解一下。
* SQL 注入，拼接 SQL 的都是 SB。
* exec 注入，有接口不用用 CMD，还不做权限限制。

基本上都是注入型漏洞，因为前端三大块都是纯文本，有很大的操作空间；永远不要相信其他模块传来的数据。

[^ws1]: [常见六大Web 安全攻防解析](https://segmentfault.com/a/1190000018073845)
[^ws2]: [常见 Web 安全攻防总结](https://zoumiaojiang.com/article/common-web-security/)

## 学习的方向

### AST

因为 JS 非常灵活，前端又都是纯文本，AST 在这大放异彩；最早的模板引擎，CSS 预编译器，JS 方言，兼容性转换。

### 函数式

从后端分布式和前端 React 开始再次火起来的函数式编程，解决了竞态问题，也提供了前端组件组合模式简单实践。

### 响应式（Reactivity）

MVVM，数据驱动，RXJS[^rxjs]；都是响应式编程的一部分，参见附录 4，其实我没弄明白干嘛的

[^rxjs]: [学习 RxJS](https://rxjs-cn.github.io/learn-rxjs-operators/)

### 自动机

对于控制流的改变，协程和解决回调地狱

[^vue]: [Vue 进阶系列（一）之响应式原理及实现](https://qianduan.group/posts/5bd9bc4c9fd64d5a7458a92b)

## 推荐

1. [我如何零基础转行成为一个自信的前端](https://zhuanlan.zhihu.com/p/46401520)
2. [Front-End Developer Handbook](https://frontendmasters.com/books/front-end-handbook/)
3. [Composing Software: The Book](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)
4. [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
5. [聊聊《重学前端》](https://www.w3cplus.com/relearn-the-front-end-techniques.html)
6. [从输入URL到页面加载的过程？](https://juejin.im/post/5aa5cb846fb9a028e25d2fb1)
7. [中高级前端大厂面试秘籍，为你保驾护航金三银四，直通大厂(上)](https://juejin.im/post/5c64d15d6fb9a049d37f9c20)
8. [Margin折叠，站在设计者的角度思考](https://www.kancloud.cn/jaya1992/fe-notes/91190)