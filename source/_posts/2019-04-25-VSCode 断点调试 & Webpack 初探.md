---
layout:     post
title:      "VSCode 断点调试 & Webpack 初探"
date:       2019-04-25
author:     "Gitai"
tags:
    - Webpack
---

```
  webpack
  |- package.json
  |- webpack.config.js
  |- /src
  |  |- index.js
  |- /dist
    |- index.js
```

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

这是一个最简单的 Webpack Demo，如果参照官方的教程（写的一塌糊涂），可能还在 `package.json` 的 `script` 定义了 `build` 命令。

从 `webpack build` 开始都发生了什么，来从 `node_modules/webpack/bin/webpack` 开始看。

<!--more-->

因为里面没写啥，主要就是检查 `webpack-cli` 是否存在，然后调用它。

从 `webpack` 的 `package.json` 也能发现最后暴露出来的的是 `lib/webpack.js`，所以`webpack-cli`做了执行目录下`webpack.config.js`的读取和转化，然后初始化编译器实例。

在`lib/webpack.js`下通过`console`输出上面那个文件的转化结果，可见如下输出：

```shell
$ npm run build

> transer@1.0.0 build C:\Users\Administrator\Desktop\transer
> webpack --config webpack.config.js

{ mode: 'development',
  entry: './src/index.js',
  output:
   { filename: 'index.js',
     path: 'C:\\Users\\Administrator\\Desktop\\transer\\dist' },
  context: 'C:\\Users\\Administrator\\Desktop\\transer' }
```

也就提供了个执行上下文而已。

为了更优雅的调试，先修改一点配置，增加个断点。

或许有人不知道，webpack 的各项配置都是支持 Promise 的，所以可以给初始化加个延迟，然后通过 VSCode 的 Debugger 注入调试器。

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Attach by Process ID",
            "processId": "${command:PickProcess}"
        }
    ]
}
```

这段是 VSCode 自动生成的，通过

![1556529871964.png](https://i.loli.net/2019/04/29/5cc71eb78a42a.png)

运行之后会探查所有进程，将可被注入的进程显示出来，让用户选择，也就是这个命令的操作 `command:PickProcess`

![1556529883371.png](https://i.loli.net/2019/04/29/5cc71eb80ed39.png)

但是因为可能运行多个 node 进程，所以建议开始执行 `npm run build` 之前先关闭或检视一下。

然后在 `webpack.config.js` 中用 Promise + setTimeout 包裹起来，给定一个合适的延迟。

```js
const path = require('path');

module.exports = new Promise(resolve => {
    setTimeout(() => {
        resolve({
            mode: 'development',
            entry: './src/index.js',
            output: {
                filename: 'index.js',
                path: path.resolve(__dirname, 'dist')
            }
        })
    }, 5000);
});
```

或者用 `stdin` 阻塞一下

```js
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

module.exports = new Promise(resolve => {
    readline.question(`Are you ready?`, () => {

        resolve({
            mode: 'development',
            entry: './src/index.js',
            output: {
                filename: 'index.js',
                path: path.resolve(__dirname, 'dist')
            }
        })
        
        readline.close()
    })
});
```

自然第二种优雅一点。

![1556529644042.png](https://i.loli.net/2019/04/29/5cc71df9478f4.png)

趁着被阻塞，赶快点击 Debugger 的 `Run Attach by Process ID` ，选中那个名字最奇葩的如果通过全局的 webpack 启动，这里的路径是不同的。

![1556529669333.png](https://i.loli.net/2019/04/29/5cc71df95f71e.png)

等变成这样就是注入成功了，至于问什么不用 `Launch via NPM` 之类的方法，因为他们简单啊。（其实是我从来没启动成功过）

![1556529678123.png](https://i.loli.net/2019/04/29/5cc71df960817.png)

然后回车触发 `readline` 的回调，继续执行，但是很神奇的结束了。

![1556529688570.png](https://i.loli.net/2019/04/29/5cc71df965de5.png)

因为没有设定调试器打断的条件，也没有手动暂停程序的运行。点击暂停可以实现，然后再触发上面的 `readline`回调。

![1556529737104.png](https://i.loli.net/2019/04/29/5cc71df95aaa0.png)

但是正如上图的文件名称，所示，根据时机不同，可能会被暂停在任意位置，不如手动触发调试器。

这需要在 `node_modules/webpack/lib/webpack.js` 中加上 `debugger` ，然后继续上面的操作，等回车之后就会暂停了。

```js
/**
 * @param {WebpackOptions} options options object
 * @param {function(Error=, Stats=): void=} callback callback
 * @returns {Compiler | MultiCompiler} the compiler object
 */
const webpack = (options, callback) => {
	
	debugger;
	...
}
```

断点成功长这样

![1556529745344.png](https://i.loli.net/2019/04/29/5cc71df98631e.png)

接下来瞅瞅里面咋写的，先是对传入的参数对象进行模式验证，通过在 `schemas/WebpackOptions.json` 定义好的约束， `ajv` 这个库，会根据它进行校验，输出优雅的错误提示。但是不知道为啥，一般开发中，并没人用它来做参数校验，可能因为前端组件化之后，这种完整的数据结构的校验难以整合，或者为了几行校验，引入这种专业性极强的库，没有太大收益？

>  曾经在 [Swagger Editor](https://swagger.io/tools/swagger-editor/) 见过这种东西，它是使用 Yaml 定义接口，然后生成相关的 SDK，文档和测试工具

不过还是写个 Hello World 试试看，毕竟复杂的我也不会。

```js
// src/test.js
// 引入单元测试
const test = require('tape');

const Ajv = require('ajv');

// 定义模式
const schema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      maxLength: 64,
      minLength: 6
    },
    username: {
      type: 'string',
      minLength: 5
    }
  }
};

// 初始化验证实例
const validate = new Ajv().compile(schema);

// 错误的电子邮箱格式验证
test('Email format', (assert) => {

    const valid = validate({
        email: 'email'
    });

    assert.false(valid, validate.errors.map(err => err.message));
    assert.end();
});

// 缺少必要的参数验证
test('Required property', (assert) => {

    const valid = validate({
        email: 'email@example.com'
    });

    assert.false(valid, validate.errors.map(err => err.message));
    assert.end();
});

// 字段长度越界
test('Too longer password', (assert) => {

    const valid = validate({
        email: 'email@example.com',
        password: ''.padEnd(65, '0'),
    });

    assert.false(valid, validate.errors.map(err => err.message));
    assert.end();
});

```

执行 `node src/test.js` 会得到如下结果；

```shell
$ node src/test.js
TAP version 13
# Email format
ok 1 should match format "email"
# Required field
ok 2 should have required property 'password'
# Too long password
ok 3 should NOT be longer than 64 characters

1..3
# tests 3
# pass  3

# ok
```

`tape` 的输出好像没有 `mocha` 好看，讲道理是不是自己包装一下，实现一个类似的东西。

轮子喜 +1，Promise 真好用，25 行包装一个[单元测试](https://gist.github.com/GitaiQAQ/51cd10d1ef03305cc52b70d9b46a1562)出来，实际上最后完善一下，多了不少行。具体内容，再写一篇细说。

完了到这里，以及忘了初衷是什么。哦 好像是看看 Webpack 源码。

一串下一步，发下一个 `compiler` 实例，来源于 `MultiCompiler` 或者 `Compiler`，估摸着对整体流程没啥影响，所以只看 `Compiler` 即可。

在 `Compiler.js` 开始注册了很多钩子，在执行到对应的位置，会触发这些钩子，这也就是继承自 `Tapable` 的原因。`Tapable` 提供了整套事件注册和调用机制，实际上就是普通的注册-发布模型，参考 [webpack4.0源码分析之Tapable][1]。

```js
const {
	Tapable,
	SyncHook,			// 最基本的钩子
	SyncBailHook,		// 同时执行队列的所有回调，出现结果直接返回
	AsyncParallelHook,	// 异步并向
	AsyncSeriesHook		// 异步串行
} = require("tapable");

this.hooks = {
    /** @type {SyncBailHook<string, Entry>} */
    entryOption: new SyncBailHook(["context", "entry"])
    
    /** @type {AsyncSeriesHook<Stats>} */
    done: new AsyncSeriesHook(["stats"]),

    /** @type {SyncHook<CompilationParams>} */
    compile: new SyncHook(["params"]),
    
    /** @type {AsyncParallelHook<Compilation>} */
    make: new AsyncParallelHook(["compilation"])
};
```

在这里就用到这 4 个钩子，类似的插件机制其实很早就有了，最早在 WordPress 里面见到过，也是它为什么那么灵活的原因。把整个系统通过事件模型分散成小部件，这种解耦方式在在分布式，解决数据竟态问题，工作流上面都有运用。

初始化完成之后就开始调用定义的钩子了，`environment/afterEnvironment` 刚刚初始化环境完成，可以[修改编译器的配置](https://github.com/acrazing/webpack-amd-plugin/blob/97fbd2d972901d7bbee1da166855b8d9dfca2130/src/AmdPlugin.ts#L28)。

接下来陆续执行的是 `Compiler.js` 中定义的钩子，也穿插了一些 `Compilation.js` 定义的钩子。

![1556529782917.png](https://i.loli.net/2019/04/29/5cc71df98b916.png)

虽然知道会走钩子来回跳，但是阅读起来太麻烦，你看上面梳理一下就这么点钩子，整体流程虽然跑完了，咋感觉啥都没发生（其实还是太菜，于是在 `Compilation.js` 的 `addEntry` 打断点。

![1556529792077.png](https://i.loli.net/2019/04/29/5cc71df9796b7.png)

获取了这么个鬼东西，原来走了内部注册的 `SingleEntryPlugin` 插件。

```js
exportPlugins(exports, {
    // ...
	SingleEntryPlugin: () => require("./SingleEntryPlugin"),
    // ...
}
```

通过上面的调用栈，还能发现所有的 Hook 都会走 `lazyCompileHook` 这个方法，相比给所有的方法打断点，不如给它来一个，重新运行。

每次到了断点的地方，看左侧的调用栈或者逐行执行下去![1556529801314.png](https://i.loli.net/2019/04/29/5cc71df9683dd.png)

然后得到下面这个插件的调用流程

- Compiler:environment (`webpack\lib\webpack.js:51:30`)
- Compiler:afterEnvironment (`webpack\lib\webpack.js:52:35`)
- Compiler:entryOption (`webpack\lib\WebpackOptionsApply.js:281:30`)
- Compiler:afterPlugins (`webpack\lib\WebpackOptionsApply.js:492:31`)
- Compiler:afterResolvers (`webpack\lib\WebpackOptionsApply.js:530:33`)
- Compiler:beforeRun (`webpack\lib\Compiler.js:275:24`)
- Compiler:run (`webpack\lib\Compiler.js:278:19`)
- Compiler:normalModuleFactory (`webpack\lib\Compiler.js:591:34`)
- Compiler:contextModuleFactory (`webpack\lib\Compiler.js:597:35`)
- Compiler:beforeCompile (`webpack\lib\Compiler.js:612:28`)
- Compiler:compile (`webpack\lib\Compiler.js:615:23`)
- Compiler:thisCompilation (`webpack\lib\Compiler.js:580:30`)
- Compiler:compilation (`webpack\lib\Compiler.js:581:26`)
- Compiler:make (`webpack\lib\Compiler.js:619:20`)
  - Compilation:addEntry (`webpack\lib\Compilation.js:1053:23`)
    - NormalModuleFactory:beforeResolve (`webpack\lib\NormalModuleFactory.js:377:28`)
    - NormalModuleFactory:factory (`webpack\lib\NormalModuleFactory.js:391:40`)
    - NormalModuleFactory:resolver (`webpack\lib\NormalModuleFactory.js:124:39`)
      - ResolverFactory:resolveOptions.for(loader) (`webpack\lib\ResolverFactory.js:59:56`)
      - ResolverFactory:resolver.for(loader) (`webpack\lib\ResolverFactory.js:74:33`)
      - ResolverFactory:resolveOptions.for(normal) (`webpack\lib\ResolverFactory.js:59:56`)
      - ResolverFactory:resolver.for(normal) (`webpack\lib\ResolverFactory.js:74:33`)
      - Resolver:resolveStep (`enhanced-resolve\lib\Resolver.js:227:26`)
      - Resolver:resolve (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:newResolve (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:parsedResolve (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:describedResolve (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:relative (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:describedRelative (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:rawFile (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:file (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:existingFile (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:resolved (`enhanced-resolve\lib\Resolver.js:235:16`)
      - Resolver:result (`enhanced-resolve\lib\ResultPlugin.js:16:26`)
    - NormalModuleFactory:createParser.for(javascript/auto) (`webpack\lib\NormalModuleFactory.js:481:52`)
    - NormalModuleFactory:parser.for(javascript/auto) (`webpack\lib\NormalModuleFactory.js:485:31`)
    - NormalModuleFactory:createGenerator.for(javascript/auto) (`webpack\lib\NormalModuleFactory.js:510:5`)
    - NormalModuleFactory:generator.for(javascript/auto) (`webpack\lib\NormalModuleFactory.js:514:34`)
    - NormalModuleFactory:afterResolve (`webpack\lib\NormalModuleFactory.js:138:29`)
    - NormalModuleFactory:createModule (`webpack\lib\NormalModuleFactory.js:144:50`)
    - NormalModuleFactory:module (`webpack\lib\NormalModuleFactory.js:153:40`)
  - Compilation:buildModule (`webpack\lib\Compilation.js:634:26`)
  - Compilation:normalModuleLoader (`webpack\lib\NormalModule.js:221:40`)
    - Parser:program (`webpack\lib\Parser.js:2134:26`)
    - Parser:statement (`webpack\lib\Parser.js:928:28`)
    - Parser:evaluate.for(`MemberExpression`) (`webpack\lib\Parser.js:1998:25`)
  - Compilation:succeedModule (`webpack\lib\Compilation.js:677:30`)
  - Compilation:succeedEntry (`webpack\lib\Compilation.js:1094:29`)
  - Compilation:finishModules (`webpack\lib\Compilation.js:1163:28`)
  - Compilation:seal (`webpack\lib\Compilation.js:1193:19`)
  - Compilation:optimizeDependenciesBasic (`webpack\lib\Compilation.js:1196:41`)
  - Compilation:optimizeDependencies (`webpack\lib\Compilation.js:1197:36`)
  - Compilation:optimizeDependenciesAdvanced (`webpack\lib\Compilation.js:1198:44`)
  - Compilation:afterOptimizeDependencies (`webpack\lib\Compilation.js:1202:40`)
  - Compilation:beforeChunks (`webpack\lib\Compilation.js:1204:27`)
  - Compilation:afterChunks (`webpack\lib\Compilation.js:1226:26`)
  - Compilation:optimize (`webpack\lib\Compilation.js:1228:23`)
  - Compilation:optimizeModulesBasic (`webpack\lib\Compilation.js:1231:36`)
  - Compilation:optimizeModules (`webpack\lib\Compilation.js:1232:31`)
  - Compilation:optimizeModulesAdvanced (`webpack\lib\Compilation.js:1233:39`)
  - Compilation:afterOptimizeModules (`webpack\lib\Compilation.js:1237:35`)
  - Compilation:optimizeChunksBasic (`webpack\lib\Compilation.js:1240:35`)
  - Compilation:optimizeChunks (`webpack\lib\Compilation.js:1241:30`)
  - Compilation:optimizeChunksAdvanced (`webpack\lib\Compilation.js:1242:38`)
  - Compilation:afterOptimizeChunks (`webpack\lib\Compilation.js:1246:34`)
  - Compilation:optimizeTree (`webpack\lib\Compilation.js:1248:27`)
  - Compilation:afterOptimizeTree (`webpack\lib\Compilation.js:1253:33`)
  - Compilation:optimizeChunkModulesBasic (`webpack\lib\Compilation.js:1256:42`)
  - Compilation:optimizeChunkModules (`webpack\lib\Compilation.js:1257:37`)
  - Compilation:optimizeChunkModulesAdvanced (`webpack\lib\Compilation.js:1258:45`)
  - Compilation:afterOptimizeChunkModules (`webpack\lib\Compilation.js:1262:41`)
  - Compilation:shouldRecord (`webpack\lib\Compilation.js:1264:49`)
  - Compilation:reviveModules (`webpack\lib\Compilation.js:1266:29`)
  - Compilation:optimizeModuleOrder (`webpack\lib\Compilation.js:1267:35`)
  - Compilation:advancedOptimizeModuleOrder (`webpack\lib\Compilation.js:1268:43`)
  - Compilation:beforeModuleIds (`webpack\lib\Compilation.js:1269:31`)
  - Compilation:moduleIds (`webpack\lib\Compilation.js:1270:25`)
  - Compilation:optimizeModuleIds (`webpack\lib\Compilation.js:1272:33`)
  - Compilation:afterOptimizeModuleIds (`webpack\lib\Compilation.js:1273:38`)
  - Compilation:reviveChunks (`webpack\lib\Compilation.js:1277:28`)
  - Compilation:optimizeChunkOrder (`webpack\lib\Compilation.js:1278:34`)
  - Compilation:beforeChunkIds (`webpack\lib\Compilation.js:1279:30`)
  - Compilation:optimizeChunkIds (`webpack\lib\Compilation.js:1281:32`)
  - Compilation:afterOptimizeChunkIds (`webpack\lib\Compilation.js:1282:37`)
  - Compilation:recordModules (`webpack\lib\Compilation.js:1287:30`)
  - Compilation:recordChunks (`webpack\lib\Compilation.js:1288:29`)
  - Compilation:beforeHash (`webpack\lib\Compilation.js:1291:26`)
    - MainTemplate:hash (`webpack\lib\MainTemplate.js:519:19`)
      - ChunkTemplate:hash (`webpack\lib\ChunkTemplate.js:71:19`)
      - ModuleTemplate:hash (`webpack\lib\ModuleTemplate.js:91:19`)
      - ModuleTemplate:hash (`webpack\lib\ModuleTemplate.js:91:19`)
    - MainTemplate:hashForChunk (`webpack\lib\MainTemplate.js:533:27`)
    - MainTemplate:bootstrap (`webpack\lib\MainTemplate.js:387:25`)
    - MainTemplate:localVars (`webpack\lib\MainTemplate.js:395:33`)
    - MainTemplate:require (`webpack\lib\MainTemplate.js:399:47`)
    - MainTemplate:moduleObj (`webpack\lib\MainTemplate.js:188:42`)
    - MainTemplate:moduleRequire (`webpack\lib\MainTemplate.js:455:35`)
    - MainTemplate:requireExtensions (`webpack\lib\MainTemplate.js:403:51`)
    - MainTemplate:assetPath (`webpack\lib\MainTemplate.js:501:31`)
    - MainTemplate:beforeStartup (`webpack\lib\MainTemplate.js:406:55`)
    - MainTemplate:startup (`webpack\lib\MainTemplate.js:407:49`)
  - Compilation:chunkHash (`webpack\lib\Compilation.js:2335:26`)
  - Compilation:contentHash (`webpack\lib\Compilation.js:2339:28`)
  - Compilation:afterHash (`webpack\lib\Compilation.js:1293:25`)
  - Compilation:recordHash (`webpack\lib\Compilation.js:1296:27`)
  - Compilation:beforeModuleAssets (`webpack\lib\Compilation.js:1299:34`)
  - Compilation:shouldGenerateChunkAssets (`webpack\lib\Compilation.js:1301:45`)
  - Compilation:beforeChunkAssets (`webpack\lib\Compilation.js:1302:34`)
    - MainTemplate:renderManifest (`webpack\lib\MainTemplate.js:371:29`)
    - MainTemplate:globalHashPaths (`webpack\lib\MainTemplate.js:545:44`)
    - MainTemplate:globalHash (`webpack\lib\MainTemplate.js:546:33`)
    - MainTemplate:render (`webpack\lib\MainTemplate.js:425:34`)
    - MainTemplate:modules (`webpack\lib\MainTemplate.js:160:25`)
      - ModuleTemplate:content (`webpack\lib\ModuleTemplate.js:59:55`)
      - ModuleTemplate:module (`webpack\lib\ModuleTemplate.js:65:53`)
      - ModuleTemplate:render (`webpack\lib\ModuleTemplate.js:71:53`)
      - ModuleTemplate:package (`webpack\lib\ModuleTemplate.js:77:30`)
    - MainTemplate:renderWithEntry (`webpack\lib\MainTemplate.js:436:40`)
  - Compilation:chunkAsset (`webpack\lib\Compilation.js:2459:28`)
  - Compilation:additionalChunkAssets (`webpack\lib\Compilation.js:1305:37`)
  - Compilation:record (`webpack\lib\Compilation.js:1308:23`)
  - Compilation:additionalAssets (`webpack\lib\Compilation.js:1311:32`)
  - Compilation:optimizeChunkAssets (`webpack\lib\Compilation.js:1315:36`)
  - Compilation:afterOptimizeChunkAssets (`webpack\lib\Compilation.js:1319:42`)
  - Compilation:optimizeAssets (`webpack\lib\Compilation.js:1320:32`)
  - Compilation:afterOptimizeAssets (`webpack\lib\Compilation.js:1324:38`)
  - Compilation:needAdditionalSeal (`webpack\lib\Compilation.js:1325:41`)
  - Compilation:afterSeal (`webpack\lib\Compilation.js:1329:35`)
- Compiler:afterCompile (`webpack\lib\Compiler.js:628:31`)
- Compiler:shouldEmit (`webpack\lib\Compiler.js:230:30`)
- Compiler:emit (`webpack\lib\Compiler.js:441:19`)
- Compiler:afterEmit (`webpack\lib\Compiler.js:432:27`)
- Compiler:needAdditionalPass (`webpack\lib\Compiler.js:244:46`)
- Compiler:done (`webpack\lib\Compiler.js:267:22`)

列表太长一个个断点，还不知道到啥时候，面向 `Debugger` 编程，怎么可以这么菜。于是有了下面这段操作，利用 `Error` 产生调用栈，然后用正则取出需要的方法名。

```js
try {
    let [_, func, file, line, pos] = new Error().stack.split('\n')[2].substr(7).match(/(^[.\w+]*)\s\(.*?node_modules\\?(.*):(\d+):(\d+)\)/);
    let source = require('fs').readFileSync("node_modules/" + file.replace(/\\/g, "/")).toString();
    // 假定每个文件只有一个继承自 Tapable 的类，要不就得引入 AST 了。
    let className = source.match(/class (.*)? extends Tapable/);
    className = className ? className[1] : '[TODO]';
    let hooks = source.split('\n')[line - 1].substring(0, pos - 2).match(/hooks.(.*)/)[1];
    if (hooks.indexOf('(') !== -1) {
        debugger;
    }
    console.log(`${className}:${hooks} (${file}:${line}:${pos})`);
} catch (err) {
    console.log('[TODO]');
}
```

![1556529815438.png](https://i.loli.net/2019/04/29/5cc71df973802.png)

上面的流程没有经过校对，估计肯定有错的，毕竟上面的假设就有问题。更好的处理方法，应该是给 `Compiler`/`NormalModuleFactory`/`ResolverFactory`/`Resolver`/`Compilation`/`Parser`/`MainTemplate`/`ChunkTemplate`/`ModuleTemplate` 的构造方法加上钩子，完成之后生成 Hooks 映射关系表，再用上面获取到的 hooks 方法反查其所属模块，但是这个问题并不是很重要。

上面这个就是截至 `4.30.0` Webpack 工作流程的全部 134 个注入点。官方那个文档在流程这块，写的晦涩难懂，画个流程图不好吗，实在不行整个上面的这种注入点列表也好很多。

透过上面这张表，再来看看例子。

```js
// 在 `Compiler:normalModuleFactory` 进行初始化，获取解析器的 Hooks
compiler.hooks.normalModuleFactory.tap('DemoPlugin', factory => {
    
    // 在 `NormalModuleFactory:parser.for(javascript/auto)` 获取表达式的 Hooks
    factory.hooks.parser.for('javascript/auto').tap('DemoPlugin', (parser, options) => {
        
        // 在 `Parser:evaluate.for(`MemberExpression`)` 注入，获取具体的 statement
        parser.hooks.evaluate.for('MemberExpression').tap('DemoPlugin', statement => {
            console.log(statement);
        });
    });
});
```

在这里用到了 `evaluate` 这个钩子，他需要使用 `for` 传递一个参数进去，然后再遍历 AST 的时候会根据表达式类型进行触发。传递的这个参数是 [ESTree Spec][3] 中定义的表达式类型，但是有删减，只能使用如下几个标签。

- `'ArrowFunctionExpression'` 箭头表达式
- `'AssignmentExpression' ` 赋值表达式
- `'AwaitExpression'` 异步阻塞的语法糖
- `'BinaryExpression'` 二元运算表达式
- `'CallExpression'` 函数调用表达式
- `'ClassExpression'`  类的语法糖
- `'ConditionalExpression'` 条件表达式
- `'FunctionExpression'` 函数表达式
- `'Identifier'` 标识符
- `'LogicalExpression'` 逻辑表达式
- `'MemberExpression'` 成员表达式节点，`obj.xxx` 或者 `obj[xxx]`
- `'NewExpression'` `new` 表达式
- `'ObjectExpression'` 对象表达式，`{xxx: xxx}`
- `'SequenceExpression'` 序列表达式，逗号分隔的一组表达式
- `'SpreadElement' ` `...args` 的迭代展开表达式
- `'TaggedTemplateExpression'`  没明白是啥
- `'TemplateLiteral' `模板字符串
- `'ThisExpression' ` `this` 表达式
- `'UnaryExpression'`  一元运算表达式
- `'UpdateExpression'` 更新运算表达式，i++/--

但是 Webpack 用的 [Acorn 还包含了很多标签][4]，至于为什么没有暴露出来，我也没明白。比如最近想用的 `Literal`。

比起为什么没有暴露出来，更疑惑的是为什么写了钩子缺无法被调用。

```js
initializeEvaluating() {
    this.hooks.evaluate.for("Literal").tap("Parser", expr => {
    });
}
```

继续回到源码，既然上面已经知道 `Parser:evaluate` 在 `Parser.js:1998` 去看看为啥`Literal`不会被触发。

![1556529827255.png](https://i.loli.net/2019/04/29/5cc71eb8137d3.png)

再找一个`Literal`被遍历到的方法

![1556529832456.png](https://i.loli.net/2019/04/29/5cc71eb8174d7.png)

发现在 `walkExpression` 中并不会触发 `evaluateExpression`，所以这种事件也并不会被触发。但是这并不能解释为什么官方最开头定义的那个钩子是如何被调用的。

当测试的脚本如下时：

```js
var test = "test";
```

给上面的 `evaluate.for("Literal")` 加上断点，果然被触发了

![1556529842688.png](https://i.loli.net/2019/04/29/5cc71eb81a46e.png)

直接通过`getRenameIdentifier`被触发，这函数干嘛的，没有注释的代码看的充满了绝望。

估摸着是用来处理字符字面量的，并且还只处理特定情况下的，比如直接赋值，触发的`getRenameIdentifier`，逻辑表达式，二元运算表达式，一元运算表达式，比较运算符，以及部分作为部分方法的参数。大概其他时候字面量并不参与计算，直接原样输出就好了，所以没留钩子。

本来准备用 AST 写个代码汉化的工具，然后想试试 Webpack。发现这封装逻辑，还是得自己从 AST 相关的库开始往上封装，不过这种插件思路可以借鉴。

关于 AST 还有几个小工具，[Esprima](http://esprima.org/demo/parse.html) 高性能的标准 ES 解析器；[AST Explorer](https://astexplorer.net/) 是对多个解析式的整合，并写了个美观的可视化界面。

至于其他阶段的例子，因为我暂时用不上，安利一个 [如何写一个webpack插件](http://www.alloyteam.com/2016/03/how-to-write-a-plug-in-webpack/)，自个看吧。

[1]: https://juejin.im/post/5abf33f16fb9a028e46ec352	"webpack4.0源码分析之Tapable "
[2]: https://link.medium.com/MMqPqLGZbW	"Tape — 除了 Mocha 以外的另一個選擇"
[3]: https://github.com/estree/estree	"The ESTree Spec"
[4]: https://juejin.im/post/582425402e958a129926fcb4	"使用 Acorn 来解析 JavaScript"

[5]: https://imweb.io/topic/5baca58079ddc80f36592f1a	"Webpack揭秘——走向高阶前端的必经之路"
[6]: https://fengmiaosen.github.io/2017/03/21/webpack-core-code/	"webpack之plugin内部运行机制 (配图丢了，去其他站找)"

