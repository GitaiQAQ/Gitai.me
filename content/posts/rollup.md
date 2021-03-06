---
layout:     post
title:      "前端打包常见工具 - rollup"
date:       2019-06-16
author:     "Gitai"
tags:
    - JavaScript
---

年出写了 [Gulp 和 Webpack 的介绍](https://gitai.me/2019/01/gulp&webpack/)，侧重讲了 Webpack 的原理，一个插件系统和一堆钩子。

之前看 unpkg 发现还有第三个常用的打包工具 rollup；把这 3 类放做个简单的比较就能很明确的确定每种打包工具的适用范围。

<!-- more -->

![Gulp](https://i.loli.net/2019/06/16/5d05ee7e8d58e81722.png)

Gulp 的只是文件流处理工具，操作起来非常的简单粗暴；输入输出一一对应，而合并其实是全局变量暂存，然后关闭其他流。

所以用他实现 HTML 模板的插入是在 JS 和 CSS 编译完成，文件生成完成之后；读取模板，替换对应的占位符，这也是和 concat 类似。

![Webpack](https://i.loli.net/2019/06/16/5d05f7e96dec786125.png)

而 Webpack 需要指定 entry，然后由其调用各种 loader，生成依赖图；并同时做解析和用 Plugin 转化的相关处理；因为只有一个入口所以生成的也就一个对应的文件；至于 HTMLPlugin 和 CSSPlugin 生成的也是类似 Gulp 的 concat，也是储存在全局变量，不过 Webpack 不用自己生成文件，而是有个挂在自身的 `emitFile` 方法。

最后是 rollup，因为和 Webpack 上面的流程高度重合，所以就不画了；其最主要的差别是钩子覆盖范围和数量；相比 [Webpack 130+ 个钩子]([https://gitai.me/2019/04/VSCode%20%E6%96%AD%E7%82%B9%E8%B0%83%E8%AF%95%20&%20Webpack%20%E5%88%9D%E6%8E%A2/](https://gitai.me/2019/04/VSCode 断点调试 & Webpack 初探/))，而 rollup 只有不到 10 个；Webpack 的钩子从环境、编译器生命周期和插件生命周期等，定义插件互相注入的极为复杂的但是又完全解耦和的调用流程；而 rollup 基本没有插件件的调用钩子，他就自己有个调用流程，所以每个插件都是相对独立的，插件开发的时候难度相比 Webpack 低一些。

所以看起来 rollup 比较像 Webpack 的依赖图，Gulp 的流程设计组合出来的恰好能用的工具。

~~但是 Gulp 之后的打包工具，都是 JS 为主导的，连 [RAW 输出都不行](https://gitai.me/2019/05/loader&plugin/)。~~

~~Webpack 还能放钩子，强行生成一个，只是比较麻烦；rollup 能生成的都[写在这了](https://github.com/rollup/rollup/tree/master/src/finalisers)，非常的 JS，完全没有留个可定制的钩子；所以设计理念不同，产出也完全不同。~~

最后按照之前 Webpack 文章给的模式来个 rollup 的例子，以及上面划掉的问题被解决了

```js
const manifest = {
    input: 'src/manifest.ts',
    output: {
        file: 'dist/manifest.json',
        format: 'json'
    },
    plugins: [
        json(),
        {
            name: 'rollup-plugin-json-output',
            generateBundle(outputOptions, bundles) {
                if (outputOptions.jsonOutput) {
                    Object.keys(bundles).forEach(key =>
                        bundles[key].code =
                        new Function("define", "return " + bundles[key].code)(func =>
                            JSON.stringify(func(), null, 4))
                    );
                }
                debugger;
            },
            outputOptions(outputOptions) {
                if (outputOptions.format === "json") {
                    outputOptions.format = 'amd';
                    outputOptions.jsonOutput = true;
                }
                return outputOptions;
            }
        }
    ]
}
```

类似 Webpack 可以用函数作为插件，同样 rollup 也可以，其实这都是模块化的用法；但是剥离模块化的单文件更直白。