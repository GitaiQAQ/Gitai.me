---
layout:     post
title:      "HTMLWebpackPlugin 增加新模板会遇到的坑"
date:       2019-07-25
author:     "Gitai"
tags:
	- JavaScript
	- Webpack
---

想用 Webpack 作为静态站点生成器，其优点不必多说，生态好。举个例子

* 多种多样的模板引擎，互相嵌套
* JS/CSS 的各种预处理
* 资源文件的统一化？无论远程还是本地资源，都能以合适的方式进行打包

但是 Webpack SPA 用的比较多，MPA 这种传统用法，轮子还真少。要想生成静态页，还要带模板特性的比登天还难。故踩了几天坑，留下此文。

首先理一下需求，多页的静态站，比如这个 Blog，自然没必要用 SPA 那种 JS 组件化和运行时生成 HTML 的方案，无意义的资源浪费。

或许稍微看过文档的都知道，有多 Entry 的实现方式，配合对应的导出插件，可以实现多页的 SPA；为啥叫多页的 SPA，因为虽然有多个 HTML 入口，但是其依然是万物都来自 JS 的思想，使用 JS 组件化的相关方案；和传统后端写模板页面的逻辑完全不是一码事，传统模板页面组件细化程度，没这么夸张。但是它的每个页面都是一个静态的 URL 地址，比如：`/model/resID` 然后会出现对应的 ID 地址下的 HTML 文件。

至于为什么要实现这个鬼东西，因为这是一套几年前的旧项目，抽离组件化太困难了，还是求其次，弄模板化和预编译进来比较省事。

<!-- more -->

## 预研

所以抽象到 Webpack 有以下 2 种方案

* 多 entry + 模板，最后输出多个 HTML 入口，引用自身需要的 chunk
* SSR，对 SPA 做预渲染，结果导出来

而 SSR 没玩过，暂时不去尝试，而且也需要框架支持，不适合这个老项目。

那么默认 Webpack 把模板也打包在 JS 文件中，这就得借助 ExtractTextPlugin 或者 HtmlWebpackPlugin 实现了。

这里我们需要提个非常重要的概念，和 Gulp 不同的是，Webpack 的文件实体在处理过程中均是作为 JS 模块来处理的。比如下面这个例子

```markdown
# Test
Just a test
```

如果上面内容，通过 raw-loader 导入就会变成下面这个对象

```js
module.export = {
	default: "# Test\nJust a test";
}
```

若通过 markdown-loader 导入则会变成 

```html
<h1 id="test">Test</h1>
<p>Just a test</p>
```

所以会提示 `You may need an additional loader to handle the result of these loaders.`

因为上面的内容是 HTML，自然我们需要一个把 HTML 转化成 JS 模块的 Loader，也就是 html-loader

```js
module.exports = "<h1 id=\"test\">Test</h1>\n<p>Just a test</p>\n";
```

这样这个 HTML 或者其他杂七杂八的模板文件就能被 JS 调用了，并且通过 import 进来的还是个字符串，能直接进行其他操作的。

同理 CSS 也是这么个操作，但是我们一般还会用 ExtractTextPlugin 把 CSS 单独抽离成文件，那也只是把这个返回内容暂存，loader 链置空，并在 HTMLWebpackPlugin 生成一个资源引用。

而 url-loader 会读取文件，如果小的转化成 base64 可以直接读取，要不转化为 url，并转存文件；实际上 base64 编码的也是一个 URL，被称之为 DataUrl。

说到这里最重要的就是 loader 最终需要返回一个可以让链继续下去的格式，于是有 html-loader 和 apply-loader 这对互逆操作。

apply-loader 会把函数求值，对于上面的 html-loader 生成的就会把 html 取出来。

然后回到开始的 ExtractTextPlugin 和 HtmlWebpackPlugin 

* ExtractTextPlugin 可以把对应 entry 下所有符合规则的文件都合并导出到目标文件，不能产生符合预期的文件
* HtmlWebpackPlugin 则和传统的后端模板渲染一样，但是还包括了 JS/CSS 等资源的预处理

到此就是方案的初步设计了，但是后面全是坑

## 完备的模板引擎

因为 HtmlWebpackPlugin 是使用 Webpack 的 loader 处理模板，但是正如上面说的 Loader 有返回[文本或者模块的形式](https://github.com/jantimon/html-webpack-plugin/blob/master/index.js#L263)；而在 HtmlWebpackPlugin 中对于返回为文本的引擎，会直接作为模板导出，也就只包含注入标签的过程；而对于返回为函数的引擎，则会以一个特定上下文作为参数进行再次渲染。

但是能完全兼容 HtmlWebpackPlugin 的默认 Loader 特性

* 上下文
* 配合 html-loader 实现资源抽取

但是默认的引擎又没有提供继承，包含等常见引擎的语法，虽然有个 require 但是非常反人类的写法。其实也有简单的方法，通过默认的 loadsh 加载其他模板引擎的方式；或许可以简单实现，但是那不就没有造轮子的理由了吗？

以上需求的模板引擎，我是一个都没看见，但是自己造轮子也得分析原因

常见的模板引擎，ejs/jade 什么的，至于我为什么选了 njk，因为 egg.js 默认使用它，又发现是火狐的，觉得或许没什么坑；实际上，这是预研不够完善，这个模板引擎坑还是很多的，最后使用起来还不如 ejs 的感觉，但是最好用的还是 jade，如果不是无法兼容现有模板，不如自动转化一下？

对比 njk 官方的 loader 能发现，问题其实就在于官方 loader 并没有实现导出为模块的支持。

```js
// nunjucks-loader
compiledTemplate += `
    let tmpl = shim(nunjucks, env, nunjucksPrecompiled["${name}"] , dependencies);
    let htmlPluginRender = function (templateParams) {
        return tmpl.render(templateParams);
    };
    tmpl.__proto__.__proto__.__proto__ = htmlPluginRender.__proto__;
    htmlPluginRender.__proto__ = tmpl;
    module.exports =  htmlPluginRender;`;

return compiledTemplate;
```

就上面这段简单的代码就能完成需求，开始希望定制其他诸如 `nunjucks-webpack-loader` 这样的插件，但是发现实现模式都不一样。要点在于

* Webpack 每个模块返回的只能是模块的源码
* 模块引用的复杂对象可能无法被序列化，所以只能储存在全局中
* 最后是作为函数返回的模块，如果不保留原有的返回结构，会导致无法实现原有的导入语法，也就是上面一堆原型操作

这样我们就能得到一个支持上面大多数特性的模板引擎。

## 资源预处理

因为开发阶段的资源可能不是合理的组织的，比如图片通过外连引入，但是最后我们需要产生一个对外发布的新地址，这时候就得用上 webpack 的 url-loader 之类的东西。

但是上面实现的模板引擎并无法支持，比如下面这段源码

```html
<img src="../ggg.gif"/>
```

如果直接编写 HTML 是可以被 html-laoder 处理的，但是因为这里的 HTML 会被 njk-loader 转化成返回 HTML 的函数。

```js
ERROR in   Error: Child compilation failed:
  Module not found: Error: Can't resolve './\"../ggg.gif\"/' in 'C:\Users\gitai\Desktop\wp\src\pages\b':
  Error: Can't resolve './\"../ggg.gif\"/' in 'C:\Users\gitai\Desktop\wp\src\pages\b'
```

所以 fastparse 无法对其解析出合适的结果，中间包含了一次转义，或许需要对解析器的规则进行一定的优化？增加双引号的情况进行处理？

但是全部用单引号就能姑且算是解决了这个问题，那就不管它了，只要能识别出来，就能合理的做预处理了。

## 生成的是 JS 文件

这是因为 html-loader 会给前面模板引擎生成的字符串再次通过 exportsString 这个前缀包装一层，所以如果需要能被直接调用，需要 require 2 次。

或者自己实现一个 html-loader，不进行包装，把 require 融入原有的编译阶段。

```js
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

console.log(requireFromString('module.exports = { test: 1}'));
```

这样又会遇到另一个问题，当第一层模块被解析引入的时候，会触发 html-loader 实现的静态导入，

// TODO: 暂时未解决的问题

