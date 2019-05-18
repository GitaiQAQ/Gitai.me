---
layout:     post
title:      "前端打包常见工具"
date:       2019-01-31
author:     "Gitai"
tags:
	- JavaScript
---

之前简单提到前端工程化的工具，Gulp 和 Webpack。

这里整几个例子来详细理解一下，[hexschool/gulp-demo](https://github.com/hexschool/gulp-demo)

## Gulp

![](https://i.loli.net/2019/01/31/5c52667e884af.png)

<!-- more -->

```javascript
// production || development
// # gulp --env production
const envOptions = {
  string: 'env',
  default: { env: 'development' }
};
const options = minimist(process.argv.slice(2), envOptions);
console.log(options);
```

从参数读取必要的配置，这里还可以放个 `dot-env`；可以从 `.env` 文件读取配置。

```javascript
gulp.task('clean', () => {
  return gulp.src(['./public', './.tmp'], { read: false }) // 選項讀取：false阻止gulp讀取文件的內容，使此任務更快。
    .pipe($.clean());
});
```

这个参数还是第一次用，以前都是直接调用 `fs.rmdir` 这种反模式的。

```javascript
gulp.task('jade', () => {
  return gulp.src(['./source/**/*.jade'])
    .pipe($.plumber())
    .pipe($.data(function (file) {
      var json = require('./source/data/data.json');
      var menus = require('./source/data/menu.json');
      var source = {
        data: json,
        menus: menus
      }
      return source;
    }))
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
```

通过 `gulp-load-plugins` 自动加载 `package.json` 的模块也是第一次见；`plumber` 这个错误处理模块，也很方便，之前多打一次符号，`gulp` 就得重启一次；其余的都是很常见的模块。

`babel` 任务也是很日常的操作，`main-bower-files` 自动引入 `bower` 又是没见过的操作

JS 打包的 `order` 也是没见过的，调整处理顺序；CSS 的 `PostCSS` 只在 Webpack 用过，之前直接用 `gulp-autoprefixer` 处理的。

最后是上次面试才知道的 `sequence`，用 `trunk.js` 调整控制流，现在可以用原生的 Promise 替代。

Gulp 还是非常直白的，是面向过程的工具；然后看看插件规范，写个 [Demo](https://gulpjs.org/zh/writing-a-plugin/dealing-with-streams.html)。

```javascript
let PluginError = require('gulp-util').PluginError;

let PLUGIN_NAME = 'gulp-example';
// 插件级别函数 (处理文件)
function gulpTest(...kwargs) {
  // 定义时，处理参数

  // 创建一个让每个文件通过的 stream 通道，返回文件 stream
  return through.obj(function(file, encoding, callback) {
    // Vinyl 文件可以通过三种不同形式来访问文件内容
    // 第一种 Buffer
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
    }
    // 第二种 Stream
    else if (file.isStream()) {
      // 定义转换内容的 streamer
      var streamer = prefixStream(prefixText);
      // 从 streamer 中捕获错误，并发出一个 gulp的错误
      streamer.on('error', this.emit.bind(this, 'error'));
      // 开始转换
      file.contents = file.contents.pipe(streamer);
    }
    
    // 其余为 Null，file.isNull()
    // 告诉 stream 转换工作完成
    cb(null, file);
  });;
}

// 暴露（export）插件的主函数
module.exports = gulpTest;
```

最后这里有一份，[插件指南](https://github.com/lin-xin/blog/issues/2) 和[原理解析](https://segmentfault.com/a/1190000003770541)

## Webpack

相比 Gulp 处理打包的流程，Webpack 侧重依赖的管理，Gulp 是面向过程的自动化工具，而 Webpack 则是[约定优于配置，配置优于实现的设计思想](https://zhuanlan.zhihu.com/p/32886546)，通过配置实现预设的自动化流程。所以巨 tm 难学，因为文档不完善，模块多，不理解思路没法玩，但是别人配好的，就非常好用。

所以还是从咋使用入手，部分学 Webpack 的说明上手就是 `config.js`，这就很丧心病狂了，就和 Linux 编译 `.cpp` 单文件，直接来了个 CMake。

```shell
$ webpack a.js # 打包生成 dist/main.js，约定优与配置，默认生成的就是经过优化压缩的 release
$ webpack --mode=development a.js # 打包生成 dist/main.js，为经过优化的
```

优化压缩的完全不能看，所以看看没压缩的，毕竟注释那么完整。

```shell
$ webpack --mode=development
Hash: bd7a94dc49f8a83831f3
Version: webpack 4.29.0
Time: 88ms
Built at: 2019-01-31 15:54:28
  Asset     Size  Chunks             Chunk Names
main.js  4.9 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/a.js] 62 bytes {main} [built]
[./src/b.js] 20 bytes {main} [built]
[./src/c.js] 21 bytes {main} [built]
```

先是一堆 `/******/` 强调的 webpackBootstrap，提供了对模块导入和缓存。然后用 IIFE 传入，之前通过分析得到的文件名-代码对象。对这里有个 ES6 和 CommonJS 规范导入的差异。

ES6 模块会调用 `__webpack_require__.r` ，会写入 `Object.prototype.toString` 调用的 `Symbol.toStringTag` 属性；并设置 `__esModule` 标记。然后将 `export` 转化为对象，`default` 将被 后面的 `getDefault` 调用，而 CommonJS 会被 `getModuleExports` 调用。而 AMD 规范的模块会被转化成 CommonJS，因为最为主要的前置依赖加载，被 Webpack 处理好了。

现在看看 `webpack.config.js`，等效于上面那行命令的就是最简短的配置。

```js
module.exports = {
    entry: './src/a.js',
};
```

源码有个这样的文件 `WebpackOptionsValidationError` 用来和定义的模式匹配，自动检查参数是否符合要求，所以这里的 `entry` 如果写错字符，或者写了一个未定义的属性，加载时都会被检测出来。参照错误报告也能快速弄明白咋配置。

Webpack 还有 2 个部分，Loader 和 Plugin；`module.rules` 数组定于 Loader，这里写个加载列表的 Loader，通过它导入的文件都会被拆分处理成 Array。

原始文件
​```txt
e 1 2 3 4
```

Loader: e.arr
```javascript
module.exports = function(source) {
    return "module.exports = " + JSON.stringify(source.split(" "));
};
```

webpack.config.js
```javascript
module.exports = {
    entry: './src/a.js',
    module: {
        rules: [
            {
                test: /.arr$/, // 过滤后缀为 arr 的文件
                use: ['./loaders/arr.js']
            },
        ]
    }
};
```

运行之后会把这个 arr 转化成一个导出 Array 对象的模块。

```javascript
/*!*******************!*\
  !*** ./src/e.arr ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = [\"e\",\"1\",\"2\",\"3\",\"4\"]\n\n//# sourceURL=webpack:///./src/e.arr?");

/***/ })
```

而 Plugin 只是一个包含 `apply(compiler)` 接口的对象，在里面通过 [Tapable](https://webpack.docschina.org/api/tapable/) 注册进 Webpack 的[处理流程](https://webpack.docschina.org/api/compiler-hooks/)里面。

这里写个插件作为编译完成通知。

```javascript
plugins: [
    {
        apply: function (compiler) {
            compiler.hooks.done.tap('DoneNotifyPlugin', () => {
                console.log('Done!');
            });
        }
    }
]
```

其余的就参见[深入浅出 Webpack](http://webpack.wuhaolin.cn/)



## 总结

对于工程化的这些东西，和前端本身一样广泛，但是难以深入。学不动了，学不动了。。。