---
layout:     post
title:      "简单的搜索框"
subtitle:   "从 DSL 到 IDE"
date:       2019-09-13
author:     "Gitai"
tags:
    - 前端

---

首先这几年各家都喜欢弄自己的 DSL（*domain-specific language*），尤其在大数据这块蛋糕上。

比如：

**SQL-on-Hadoop**: 查询分析是大数据要解决的核心问题之一，而SQL作为查询分析中使用最简单、最广泛的的语言之一，必然而然的催生了许多支持在Hadoop上使用SQL的系统，这就是所谓的SQL-on-Hadoop系统，其中大众熟知的 Hive 就是最早的 SQL-on-Hadoop 系统。[开源SQL-on-Hadoop系统一览](https://yq.aliyun.com/articles/690141)

**Ad hoc**: 简易查询，用命令行进行即席查询（ad-hoc）是非常有用的。 比如：[轻量查询 —— ElasticSearch](https://www.elastic.co/guide/cn/elasticsearch/guide/current/search-lite.html)

于是我们就有了这么一个需求，弄个日志检索的 DSL 出来，大概张这个样子。姑且称之为 XQL。

```sql
SEARCH db.table | fiilter NOT max(col1)>1,col2 | sort col1 | limit 100
```

好了，怎么定义这个 DSL，我什么都不知道，也不敢问，这是大佬干的事。好好做个切图仔，只要实现下图这个 SearchBox 就行了。

[![SearchBox](https://i.loli.net/2019/09/30/xfNm6w57CDUWyZQ.png)](https://www.figma.com/file/UuDdlAqs8m5D24tf8Y6buD)

说起来是 SearchBox，我们从开发的角度来看，更像是一个编辑器。

一个提供了 *IntelliSense* 和 *语法高亮* 的单行编辑器。有了这个目标之后，我们就可以去找轮子了，CodeMirror 好像满足了这些需求，体积也不大。

<!-- more -->

## CodeMirror

提供了代码编辑功能的组件，有着丰富的 API 和生态。

![1570585098943](https://i.loli.net/2019/10/15/CsZySt1cKg2HwnN.png)

在 CodeMirror 中，有很多可以拓展的地方，基于这次的业务需求，只需要修改其分析器和补全提示就行了。

分析器被定义成 `mode`，使用 `defineMode` 写入单例中。

```typescript
import CodeMirror from "codemirror";

CodeMirror.defineMode(XQL.ID, function() {
    return new XQL();
});
```

因为有了 TS 的类型定义支持，基本上不需要查 API 文档，就能知道这里的 `defineMode` 接收一个实现了  `Mode<?>` 接口的对象，暂时就实现以下方法 `token` 就行了，用于处理字符串流，标记分类。

```typescript
interface Mode<T> {
    name?: string;

    /**
     * This function should read one token from the stream it is given as an argument, optionally update its state,
     * and return a style string, or null for tokens that do not have to be styled. Multiple styles can be returned, separated by spaces.
     */
    token?: (stream: StringStream, state: T) => string | null;
}
```

又因为 Class 是种语法糖，而 JavaScript 又是鸭子类型的。所以实际写出来的大概可以是这样。

```javascript
const XQL = {
    token: (stream, state) => {
        // 逐个字符，循环调用，标记子串类型
        return "string";
    }
}
```

或者这样子

```typescript
class XQL implements Mode<StateStack> {
    public token(stream: StringStream, tokenizes: any): string | null {
        // 逐个字符，循环调用，标记子串类型
        return "string";
    }
}
```

具体这里需要如何实现，可以参照 CodeMirror 下面的 mode 文件夹，简单的比如 `shell.js`，只实现了简单的关键词高亮。至于其他高级写法，比如写个语法分析树或者和三方语法分析库（Anklr）整合。

而另一个暂时有用的接口是 `hint` ，这是通过 `show-hint` 插件引入的，用于实现弹出提示。

```typescript
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';

CodeMirror.registerHelper('hint', 'custom', function(editor: CodeMirror.Doc & CodeMirror.Editor, options: any)
    : ListCreated | undefined {
    return {
        list: [
            "hint"
        ],
        from: CodeMirror.Pos(cur.line, curr.start),
        to: CodeMirror.Pos(cur.line, curr.end),
    };
});
```

这个也简单，拿到当前的字串片段，然后在列表里面过滤一下就行了。如果要更高级的模糊搜索，塞个 `fuse.js` 进去；比如按照类型, 描述加权排序。

## 分析器

一般来说讲到语法啊，AST，源码分析什么的；都得从词法分析开始，但是我觉得词法分析和语法分析并没有明确的隔断，并且实现的时候坑定会越界。直到我直到有种语法分析叫**无扫描语法分析器**，详细参见[《词法分析器和语法分析器的界线 —— ANTLR 4简明教程》](https://www.bookstack.cn/read/antlr4-short-course/line-between-lexer-and-parser.md)

无扫描语法分析器可以把字符当作记号，使用语法分析器去把语法结构应用到字符流。

![1570634145428](https://i.loli.net/2019/10/15/MlPwtz8ZEsVYyKq.png)

上图就是个简单的例子，对目标字符串进行拆分，然后再对符合模式的字串进行拆分，这样递归下去；最后把整个字符串拆分成符合需求的原始类型序列。

在此定义原始类型如下：`str`,  `func`,  `number`,  `keyword`,  `op`

但是因为没有语法分析，需要对类型的定义需要更精确，增加一些对原始类型的继承类型；比如：`field(str)`,  `search(keyword)`, `limit(keyword)`

这样我们可以得到一个 Token 集合，如下图，实际上也就是处理方法的集合。

![1570689026791](https://i.loli.net/2019/10/15/BHbTJdxaiVv3XDS.png)

在橙色的预测方法中，决定后续的处理方法，并入栈等待处理。上图中最终得到的待处理序列就是最后一行的处理方法序列，处理方法序列执行的结果包含处理的字串和类型标记。

```typescript
[
    {
        string: 'search',
        type: TOKEN.COMMAND,
    },
    {
        string: ' ',
        type: null,
    },
    {
        string: 'base.index',
        type: TOKEN.TABLE_NAME
    }
]
```

但是上图中按照绘制的流程走，必须先有预测方法，将处理方法入栈，之后再走处理流程；不难发现预测和处理会有一些重叠的部分，比如：`CommaBlock` 已经把 `,` 分离出来了，但是我们还是得写入 `,` 处理的逻辑进后面的处理序列中，所以需要将 2 个阶段融合起来，减少无意义的损耗。

## 任务队列

对上图的预测和分解流程，应该按照如下执行顺序（框框里面彩色的编号）。

![1571133912470](https://i.loli.net/2019/10/15/LOjtXr9KFJNdgih.png)

 首先是程序串行的执行顺序， 应该是 FIFO 即按照插入顺序（紫色）①②③④⑤⑥⑦⑧⑨⑩ ⑪⑫ 

但是因为在 ⑦⑧ 执行时，⑨⑩ ⑪⑫ 所对应的  `count(col1)` 没有执行完成，就会出现异常。

那如何调整插入顺序，让插入的东西可以先执行，分解这个问题；观察可能有那些种组合情况。

![1571134803763](https://i.loli.net/2019/10/15/gpe2hfWlqkn6U8D.png)

一般来说就这种预测和处理相间的情况，而这里也和上面一样，不会按照预期的 ①②③④⑤⑥⑦⑧⑨ 执行，而是 ①②③⑧⑨④⑤⑥⑦

那如何让插入和执行顺序不一致，即把 ⑧⑨ 调到 ④⑤⑥⑦ 后面；不难注意到这部分和 JavaScript 的宏任务很像，所以可以构造宏微队列来处理这个问题。

将 ⑧⑨ 这种塞到宏队列里，那就可以等待 ④⑤⑥⑦ 完成才会被调用。

但是还有可能出现下面这种情况，嵌套型的预测任务。

![1571135477755](https://i.loli.net/2019/10/15/zciLlUvubgrdSma.png)

我们期望的调用顺序是 ①②③④⑤⑥⑦

但是实际上却是 ①⑦②⑤⑥③④，基本上和乱序无异了

而且即使用上宏微队列，其执行顺序也不正确 ①②③④⑦⑤⑥，因为按照 JavaScript 的设计，其宏队列也和微队列一样都是 FIFO 的，⑦ 因为先插入，也必然先于 ⑤⑥ 执行。

如果没有 ⑥ 的话，我们可以通过翻转宏队列，让其 FILO 来做到 ⑤ 先于 ⑦ 执行，但是明显不能这么做。

换个思路，如果  ⑤⑥ 内部有序，但是外部翻转？那不就符合需求了？

于是加多一个抽象层，我们叫它 [⑤⑥]，并把宏队列翻转未 FILO。

![1571136059410](https://i.loli.net/2019/10/15/MfOn4lmC13tXbAa.png)

这样将 [②③] 插入的 [⑤⑥] 打包为**虚拟**的宏任务，这样最后调用时，[⑤⑥] 内部能够维护其顺序。

而虚拟的宏任务 [⑤⑥] 也不过是宏任务，并且其作用是插入 ② 和 ③ 到微任务队列。

这样我们就能通过宏微队列调整插入和执行的顺序，让程序符合我们的设计运行。

## 补全提示

这个其实是个非常简单的功能，但是会非常有用。

首先我们在开始介绍了 `show-hint` 这个插件，它能够获得我们上面分析生成的 TOKEN 序列，既然有了 TOKEN 序列，补全提示还有什么难度嘛？

补全提示是什么？通过现有的用户输入来推测用户接下来的输入，比如简单的单词补全提示应该包含以下内容。

1. 获取用户输入的当前单词片段
2. 去字典中进行模糊搜索
3. 将返回的结果序列通过频度或者匹配精度进行重排
4. 显示在界面的弹出层上

那么我们的是不是也是这样？不过我们还需要根据语义调整字典集，比如 `field` 中明显不应该输入 `keyword`。

所以定义如下映射关系

* `keyword` -> `field`
* `keyword` -> `comma`
* `keyword` -> `number`
* `keyword` -> `function`

上面的意思就是，如果前一个元素是 `keyword` 那后一个应该是 `field`, `comma`, `number` 或者 `function`。

这样我们就能获得上面说的字典集合，预先定义上面这些类型的集合，当用户输入的前一个 TOKEN 为 `keyword` 时，便将对应的 `field`, `function` 集合合并，构造字典。

随后时模糊搜索，因为用户可能输入的内容不只是待补全的内容，所以对上面字典的定义应该入开始的那张图。

 ![SearchBox](https://i.loli.net/2019/09/30/xfNm6w57CDUWyZQ.png)

比如描述，当用户输入的时候，对提示列表的数据进行加权模糊搜索，用 fuse.js 就行了，在此不进行赘述。

这一步也顺便解决了重拍的问题，因为通过加权搜索，本身就带上了优先级。

显示层可以复用原有的，但是我们的包含图标和提示，简单地说，复杂度比原来的高，而且可能有成千上万个。所以用 JSX 预渲染做一些优化，并在构造时缓存结果到内存中，只是在显示时将其插入。

到此，一个简单的搜索框框就完成了。



