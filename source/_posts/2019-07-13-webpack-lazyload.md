---
layout:     post
title:      "Webpack 动态 import 实现原理 —— 附：蹭个 PR"
date:       2019-07-13
author:     "Gitai"
tags:
	- JavaScript
	- Webpack
	- 优化
---

本文主要因为以下这段代码并不符合预期，chunk 名字，没有生效

```ts
// @ts-ignore
import(
    /* webpackChunkName: "[request]" */ 
    "../docs/parcel.md"
).then(
    ({ default: html }) => {}
);
```

但是下面这样就可以生效了

```ts
let parcel = "parcel";
import(
    /* webpackChunkName: "[request]" */
    "../docs/" + parcel + ".md"
).then(
    ({ default: html }) => {}
);
```

但是这样又无法生效了？

```ts
import(
    /* webpackChunkName: "[request]" */
    "../docs/" + "parcel" + ".md"
).then(
    ({ default: html }) => {}
);
```

那么本文就要抛开深究其源码，看看到底咋回事

<!-- more -->

如果连上面第二种都无法生效，劳烦检查 `tsconfig.js` 和 `webpack.config.js`，主要是这几点

```json
// tsconfig.json
{
    "module": "ESNext",
    "removeComments": true
}
```

这是为了保留上面的注释和原样的 `import` 语句

```js
// $ tsc --module esnext src/index.ts
var parcel = "parcel";
import(/* webpackChunkName: "[request]" */ "../docs/" + parcel + ".md").then(function (_a) {
    var html = _a["default"];
});
```

至于不加会发生啥，就得自己测试了。

先拿着关键词去源码搜，[Github 的搜索真好用](https://github.com/search?q=org%3Awebpack+webpackChunkName&type=Commits)

> ### [Add specify chunk name feature for `import()`](https://github.com/webpack/webpack/commit/b65432a2f1d0c807da4ed3bf4afcfff25b4683dd)
>
> Add specify chunk name feature for `import()` by following special comment block after the param:
>
>   import('./foo' /* webpackChunkName = "myChunkName" */)
>
> Thus we can use chunk name like `requre.ensure` and avoid conflicts with the specification.

通过版本控制记录，能发现[`evaluate AssignmentExpression`](https://github.com/webpack/webpack/blob/b65432a2f1d0c807da4ed3bf4afcfff25b4683dd/lib/dependencies/ImportParserPlugin.js#L24)钩子，然后在  [`call System.import`](https://github.com/webpack/webpack/blob/b65432a2f1d0c807da4ed3bf4afcfff25b4683dd/lib/dependencies/ImportParserPlugin.js#L31) 解析注释。

然后关键来了

```js
if(chunkNameAssignment) {
    const chunkNameExpr = parser.evaluateExpression(chunkNameAssignment.right);
    if(chunkNameExpr.isString()) {
        chunkName = chunkNameExpr.string;
    } else {
        throw new Error(`\`webpackChunkName\` expected a String, but received: ${comment.value} .`);
    }
}
```

表达式的右侧会作为一个表达式进行计算，所以我们别人肉分析，debugger 看看

![1562998644430](https://i.loli.net/2019/07/13/5d2981e1129fa58467.png)

但是发现最新版的以及没有上面的代码了，所以继续 debugger，跟踪 `chunkName` 的转移。

但是后面跟踪太麻烦，观察传递出去的结构是个对象，于是全局搜了一下 `chunkName` 很巧的是刚刚好找到要的东西。

```js
if (chunkName) {
    if (!/\[(index|request)\]/.test(chunkName)) {
        chunkName += "[index]";
    }
    chunkName = chunkName.replace(/\[index\]/g, index++);
    chunkName = chunkName.replace(
        /\[request\]/g,
        Template.toPath(dep.userRequest)
    );
}
```

原来是正则表达式换的，而且只支持 `[request]` 和 `[index]`，那我在公司用的 `[filename]` 哪来的？还是我记错了？周一去看看

但是这并没解决为什么不会被替换的问题，于是给他加个断点，发现并不一定会走到这来。在 `lib\dependencies\ImportParserPlugin.js` 有可能就直接结束了，那重新分析之前那个文件。

发现有个分支，[ImportParserPlugin.js#L161](https://github.com/webpack/webpack/blob/master/lib/dependencies/ImportParserPlugin.js#L161)

```js
if (param.isString()) {
    const depBlock = new ImportDependenciesBlock();
	parser.state.current.addBlock(depBlock);
} else {
    const dep = ContextDependencyHelpers.create();
    parser.state.current.addDependency(dep);
}
```

通过上面的抽象不难发现，会判断 `param` 是否为字符串，如果不是则认为是动态产生的，需要通过上下文分离并动态导入；否则只是普通依赖。

而 `param` 对象我们可以在 debugger 下看看里面的细节

![1563000182303](https://i.loli.net/2019/07/13/5d2981f7750a422805.png)

他是对 `expr.arguments[0]` 的编译产生的结果，所以当**最终**编译结果为字符串时，就会被当作静态依赖加载。

那么问题就变成了，最开始的三段代码，引用模块的编译后内容是啥？

* `"../docs/parcel.md"` => 字符串
* `"../docs/" + parcel + ".md"` => 模板字符串（表达式）
* `"../docs/" + "parcel" + ".md"` => 优化会被合并，最后变成字符串

 如下图所示

![1563000592083](https://i.loli.net/2019/07/13/5d2982072e0de96141.png)

所以这也是一个优化点，在需要使用动态加载的特性时，必须将导入路径的表达式写成上下文依赖的，不会被优化成单一字符串的表达式。

反观第二种能成功的或许也是现有编译器的优化点，**常量**为何不会被合并进字符串内？

注意上一句的**常量**，我们声明的 `parcel` 是满足我们需求的常量嘛？并不是，那用 `const` 声明会怎么样？

```ts
const parcel = "parcel";
import(/* webpackChunkName: "[request]" */ "../docs/" + parcel + ".md").then(
    ({ default: html }) => {
    }
);
```

![1563000952766](https://i.loli.net/2019/07/13/5d29821416d7c36810.png)

还是不会被优化，看来并不会区分 `let` 和 `const` 来对其进行优化。

那原因在哪？我们打印 `param` 的属性看看

![1563001081270](https://i.loli.net/2019/07/13/5d29821f56a4e67218.png)

`BasicEvaluatedExpression` 并没有实现是否检测其是否为静态的方法，所以有以下几个问题

* 有没有给 AST 上加上这个的必要性？
* 加上是否能提高运行效率？
* 是否于已有的规范冲突？
* 是否会产生负优化？
* 是否符合开发者预期？

如果都没问题？那谁去提 PR？