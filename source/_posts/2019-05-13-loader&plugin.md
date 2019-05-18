---
layout:     post
title:      "Webpack Loader 和 Plugin"
date:       2019-05-13
author:     "Gitai"
tags:
  - 笔记
---

想写个插件解析 JS 生成 JSON 的配置文件，其实就是 `JSON.stringify(require('./manifest.js'))`。这个简单的操作。

找了个 SO 上面的回答，[How do I build a JSON file with webpack?](https://stackoverflow.com/questions/44232366/how-do-i-build-a-json-file-with-webpack)

里面大概有 3 种看起来可行的方法，但是 `CopyWebpackPlugin` 这种太丑了，其实是没怎么用到 `webpack` 的东西（到最后就发现这才是最好用的方法

那就看第一个 `manifest-loader.js`，相比他的 JSON to JSON，我们的 JS to JSON  是不是更复杂一点。

```js
{
	test: /manifest\.js$/,
	use: 'js2json-loader'
}
```

<!-- more -->

但是这个 JS 可能存在 ES6 甚至更高的语法，所以不能直接 `JSON.stringify`，那如何套一个 `babel`，之前的知识告诉我们，它的 Loader 会组合成一个洋葱模型，先 `pitch` 后 `loader` ，那等 `babel` 完成获取结果，并导出不就好了。

```js
{
    test: /manifest\.js$/,
    use: [
        './src/js2json-loader',
        'babel-loader',
    ]
}
```

很不幸输出的内容，还是没法直接运行，因为 `js2json-loader` 得到的内容虽然经过 `babel` 处理但是，依然无法执行。即使执行成功了，生成文件之后会发现完全不符合预期。

```js
/***/ "./src/manifest.js":
/*!*************************!*\
  !*** ./src/manifest.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {
  ...
/***/ })
```

或许会想到有个分离 CSS 的 Loader，为什么它可以那么操作？

因为它有 Loader 和 Plugin 2 个部分，Loader 抽取 `require(xxx.css)` 这样的内容，通过 Plugin 合并导出为独立的样式表。

简而言之就是之前对 Loader 和 Plugin 里理解有问题，Loader 是加载文件，转化成 JS 可以操作的内容（对象，字符串或者流）；而 Plugin 是提供了一个对流程的控制，甚至产生一个新的流程。

所以这里还是简单的用 `CopyWebpackPlugin`  这种操作，因为这和 Webpack 正常的打包流程没啥关系。

但是直接用实在不优雅，而且没法用上 `webpack` 的 Loader，尤其是 `babel` 转化。

所以只能用 `babel-node` 替换 node，然后通过 `require` 引入模块，来解决这个问题。

```json
{
  "scripts": {
    "build": "npx babel-node ./node_modules/webpack/bin/webpack",
    "watch": "npx babel-node ./node_modules/webpack/bin/webpack --watch"
  }
}
```

然后用 `CopyWebpackPlugin` 这个插件。

```js
new CopyWebpackPlugin ([{
    from: 'src/manifest.js', to: './manifest.json',
    transform: function (_, path) {
        return JSON.stringify(require (path), null, 2)
    }
}])
```

勉强算是解决了，虽然好丑啊