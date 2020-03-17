---
layout:     post
title:      "JavaScript 萌新指北"
date:       2018-12-21
author:     "Gitai"
categories:
	- JavaScript
---

> 发现一个比我写的还多的文章[^interview]
>
> 顺手塞个大纲进来[世界顶级公司的前端面试都问些什么](https://juejin.im/post/5c414bbe518825247c724268)

首先我要好好批判批判，是谁给我的勇气，3月份写了个 [JavaScript 原型和继承](http://gitai.me/2018/03/js-prototype/) 这篇智障文章出来。（大概就和每次重构代码一样的感觉。

经过前些日子 BAM 的面试，发现我的确是个假前端，知识储备不足，经验也不够。真是浪费了大好的面试机会，不过经验还是有滴。至少知道了面经这种东西，只能作为提纲，如何细化还得自行揣度。

写这篇文章的时候，发现各种资料都不管用，各种 Spec，解释器源码和 Demo 才是实际的。还有前端发展比较缓慢，09 才有 ES5，所以大到虚拟机，小到控制流基本都是借鉴系统或者啥服务的特性弄出来的，本身 JS 就这么点东西，而那些背景才是大头，大概优秀的前端er也是深入理解各种底层，分布式balabala的，而且因为和用户最近，还不能过于偏激；总的来说，挺难的。

在吹这篇文章的时候看到了这么一张图，突然觉得有那么一点合适。[^js_works]

![The Runtime](https://cdn-images-1.medium.com/max/1000/1*4lHHyfEhVB0LnQ3HlhSs8g.png)

<!-- more -->

## 数据类型 & 内存堆（Memory Heap）

先是数据类型，基本的 `boolean`，`number` 大家都有，被吐槽为设计失败的 `null` [^null]，被误以为可以修改而实际上只能重新分配的 `string`，还有无比强大的 `object`，以及在变量提升时会反复出现的`undefined`，和ES6 增加的表示独一无二的 `symbol`。类型检查使用 `typeof`，对象类型检查需要使用 `Object.prototype.toString` 因为如同 `Array` 会对从 `Object` 继承下来的该方法进行重写这样，大多数子对象都是无法通过`toString` 直接返回 `[object XXX]` 这样的类型标识的。

让我们从内存模型来看这几个类型，先明确以下几点：

1. 所有对变量的赋值操作都是值复制
2. 栈是连续的，所有储存的都是**定长**数据；而堆是动态分配的，需要手动回收（JS 由 GC 回收）。
3. `object` 是唯一的引用类型

```js
let s1 = "s1";
let s2 = s1; // 在这里是对 "s1" 这个基本类型的复制
let o1 = {}; // o1 是对 {} 的堆地址的引用，姑且把这个引用也理解成基本类型
let o2 = o1; // 所以这里的 o2 也是 o1 即 {} 的引用
```

![复制之前](https://i.loli.net/2019/01/07/5c335ab098486.png)

```js
s2 = "s2"; // s1 依然是 s1
o2 = []; // 这里对 o2 下 o1 的引用进行修改，变成堆内 [] 的引用，而 o1 无变化
```

![复制之后](https://i.loli.net/2019/01/07/5c335ab084e37.png)

```js
o2 = o1; // 重新将 o2 的值修改为对 {} 的引用
o2.s1 = "s1"; // 通过 . 操作符修改 o2，增加 s1 属性为 "s1"
console.log(o1); // o1.s1 也同样被添加为 "s1"
```

![堆内对象的修改](https://i.loli.net/2019/01/07/5c335ab0831db.png)

上面这个例子是内存模型中最重要的几点。

在 JS 中，存在字面量这一类写法，将会被直接转化为对应原始类型。

```js
typeof "字符字面量" // string
typeof false // boolean
typeof 1 // number
typeof null // object ???
typeof undefined // undefined
```

那上面有个反直觉的 `null`，为什么会是 `object`？

> 原理是这样的，不同的对象在底层都表示为二进制，在 Javascript 中二进制前三位都为 0 的话会被判断为 Object 类型，null 的二进制表示全为 0，自然前三位也是 0，所以执行 typeof 时会返回"object"。《你不知道的 Javascript》

> 从逻辑角度来看，null值表示一个空对象指针，而这正是使用typeof操作符检测null值时会返回“object”的原因。《JavaScript高级程序设计》

实际上这是个历史遗留的 BUG，参见 [JavaScript 中 typeof 原理探究？](https://segmentfault.com/q/1010000011846328)

之后看看 `const` 这个在 ES5 中增加的特性，为了弥补 var 的一些缺陷而设计出来的。

```js
const s1 = "s1";
s1 = "s2"; // Uncaught TypeError: Assignment to constant variable.

const o1 = {};
o1.s1 = "s1";
// {s1: "s1"}

const o2 = {};
o2 = 01; // Uncaught TypeError: Assignment to constant variable.
```

结合上面的内存模型不难发现，`const` 仅仅会约束栈内存的值和地址，而 `object` 类型因为只在栈内存了对堆的引用，所所以可以修改其 “内容”，如果要保护堆内对象的数据，则需要使用 `seal`，`freeze` 这 2 个方法。

在 [jsobject_fwd.h#L113](https://github.com/Constellation/iv/blob/64c3a9c7c517063f29d90d449180ea8f6f4d946f/iv/lv5/jsobject_fwd.h#L113) 中有这 2 个方法的实现原理，就是调用了 [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 来修改对象的 `configurable` 和 `writable` 属性，按照 MDN 的介绍还有 `get` 和 `set` ，这 2 个属性就是现在广泛用于`react`, `vue`这类 MVVM 框架，通过 Hook 这对象的这 2 个方法来监测数据变化并触发对应的动作。

因为栈中的资源会通过 LIFO 被清理，而堆中的对象在物理上不具有连续性，没法这样被清理而容易产生内存泄漏。于是有了各种各样的垃圾回收算法，最简单但是昙花一现的引用计数算法，和广泛使用的标记-清理算法，这段发展史还是从 R 大的虚拟机介绍[^r]上看到的，所以细节我也不复制了。

`number`, `string`, `boolean` 这三种基本类型都有对应的包装对象，用于增强这些基本类型的功能，所以在诸如 `"s".startsWith` 这样的方法被调用时，是对 `new String("s").startsWith` 的调用，并且在调用完成后，会销毁这个包装对象，所以 `"s".prop = "test";`，这条语句没有效果但是的确生效了，只是作用的对象在调用完成之后就被销毁了。

Function 通过其 object 的属性进行拓展，而 object 又通过 Function 进行构造，这个构造流程就需要了解 JS 里面对于构造器的实现。

```js
function TestObj(name) {
    this.name = name;
}
console.log(new TestObj("testObj"));
```

![Chrome DevTools - console](https://i.loli.net/2019/01/10/5c3707f3110d2.png)

显而易见的就是个普通对象，但是原型的构造器是上述函数，所以可以这样手动构造。

```js
function TestObj(name) {
    this.name = name;
}
let testObj = new Object();
testObj.__proto__ = new Object();
testObj.__proto__.constructor = TestObj;
TestObj.call(testObj, "testObj");
console.log(testObj);
```

![Chrome DevTools - console](https://i.loli.net/2019/01/10/5c3707f3110d2.png)

然后来把他们塞到 TestObj 里，也就是 jQuery 的无 new 构造。

```js
function TestObj(name) {
	// 无 new 调用的函数内 this 指向 Global，即 window 或者 global，在严格模式下为 undefined
    let _this = new Object();
    _this.__proto__ = new Object();
    _this.__proto__.constructor = arguments.callee; // TestObj，arguments.callee 在严格模式下会报错
    
    _this.name = name;
    return _this;
}
console.log(TestObj("testObj"));
```

但是 \_\_proto\_\_ 并不是标准的方法，虽然被现代的浏览器支持了，在 ES 6 增加了 `setPrototypeOf`；顺手加上对 new 构造的判断。

```js
function TestObj(name) {
    let _this = this === window?Object.setPrototypeOf({}, {
        constructor: arguments.callee
    }):this;
    _this.name = name;
    return _this;
}
console.log(TestObj("testObj"));
console.log(new TestObj("testObj by new"));
```

上面已经构造了一个这样的继承链 `testObj` -> `{constructor}` -> Object

现在弄个 ChildObj 覆盖父对象的 `name`

```js
function ChildObj(name) {
    this.name = name;
}

ChildObj.prototype = new TestObj();
ChildObj.prototype.constructor = ChildObj;
console.log(new ChildObj("childObj"));
```

使用 `new TestObj()` 来构造原型是有问题滴，应该使用 `Object.create(TestObj.prototype)`，最好直接用 `Object.setPrototypeOf`（出自《你所不知的的 JavaScript》5.3 （原型）继承）

![Chrome DevTools - console](https://i.loli.net/2019/01/10/5c373da4971cc.png)

蓝色线表示直接原型，而红色则是通过原型链产生的间接原型。其 instanceof 是通过递归检查原型链来判断继承关系的。

> 插播：如何理解 prototype 和 \_\_proto\_\_
> 
> 我们已经知道 JS 所有的对象都有 \_\_proto\_\_ 来标记原型，形成原型链。那么 prototype 又是干啥的？直接看 ES Spec [^sec-4.3.4]写的明明白白，函数创建的对象需要写明继承关系，而这个继承关系就是通过  prototype 来约定的；所以我们可以修改函数的 prototype 让生成的对象都继承自某个对象。

接下来看看鸡和蛋的问题，Function 和 Object 错综复杂的继承关系。

```js
let obj = new Object();
let fn = new Function();
// 理所应当
console.log(obj instanceof Object); // True
console.log(fn instanceof Function); // True 

// 自然而然
console.log(obj instanceof Function); // False
console.log(fn instanceof Object); // True 除了基本类型，一切都是对象

// 鸡和蛋的问题
console.log(Object instanceof Function) // True
console.log(Function instanceof Object) // True
```

首先 Object 是所有对象的父级，所有的非基本类型都是 instance 于它的；而 Object 本身是个函数，这个函数自然继承了 Function 所以有了互相继承的关系；而 Object 生成的实例是不具备再次被调用的能力的，自然不是继承自 Function；而 fn 继承自 Function，自然也继承自 Object。

至此，JS 的原型和继承就结束了，之前文章写的又杂又乱，啥都有就是自个都看不懂；尤其那张原型关系图，实际上就是几条规则，阐述一下就是上面这几个 Demo。（小声 BB，就假装我现在已经完全理解了。

作用域链是个大坑，自个都没整明白，最简单的就是 `var` 声明的变量会绑定到最近的作用域，而相对于 `var` 没有块级作用域，只有函数作用域；其次 `let` 对块级作用域提供了支持。以及 JS 使用的是静态词法分析作用域，其静态是相对于动态作用域而来的，详细参见《你所不知道的 JavaScript》的第二部分 1.3

闭包即使立即执行，只有一个入口和返回值，通过匿名函数隔离外部环境，并且可以通过延申作用域来作为函数工厂生成函数。在 ES 5 增加的 `Function.prototype.bind` 就是把前一次传入的参数延申到闭包里面，生成一个构造方法；而其本质就是闭包 + `Function.prototype.call/apply`。

```js
function BindTest() {
    this.bind = "ok"; 		// 增加新的属性作为测试，这里的 this 是下面 bind 传入的 obj
    return this;			// 因为不是构造方法，不会默认返回 this
}
let bindFn = BindTest.bind({name:"test"});// this = {name:"test"};
console.log(bindFn());		// {name:"test", bind:"ok"}
```

用闭包 + `Function.prototype.apply` 实现一下这个小东西；

```js
BindTest.__proto__.customBind = function (ctx) {
	// 这个 return 会把匿名函数丢出去
    return (function() {
    	// 外部作用域会被缓存在这
        return BindTest.apply(ctx, arguments);
    })
}
let customBindFn = BindTest.customBind({name:"test"});
console.log(customBindFn());		// {name:"test", bind:"ok"}
```

![Chrome DevTools - console](https://i.loli.net/2019/01/10/5c374adeb2043.png)

打印 `customBindFn` 看看会发现，输出的就是上面 return 的匿名函数，但是因为作用域的延申 `ctx` 被我们上面传入的 `{}` 取代了；闭包最重要的特性就是**内部作用域**导出，就是把构造闭包时的作用域打包了给其他地方用。

// TODO: 暂时没想到还有啥可以瞎BB的，本节暂时结束

## 并行 & 事件循环（Event Loop）

> 理解不足，建议去看【朴灵评注】JavaScript 运行机制详解：再谈Event Loop

先来了解程序的运行流程，有调度系统之前的程序设计就是个大 loop，可以参照一些单片机在 NoOS 下的写法，一个 sleep 就是多少个时钟周期的空循环，而这段时间内整个系统都停止不动了，这就是发生了阻塞。在这段 sleep 时的 CPU 资源就被浪费了；于是有了分时复用，在上面这个 sleep 发生时，将 CPU 资源交给另一个程序，而把 sleep 转化为定时器，由上层系统维护，其中 NoOS 则交由硬件定时器维护；等定时器清零，重新把 CPU 交给第一个程序。

平时开发也可能调用到各种资源，比如读取一个文件，这个文件可能是在 6GB/s 读写的 PCIE/NVMe 的本地磁盘上，也可能通过 56Kbps 的拨号上网获取，总不能让系统吊死在这。

于是我们可以开启一个子线程慢慢的从 TCP 中读取，写入缓冲区，等 EOF 的出现，并在下一个 loop 的开始检查子线程任务是否完成。

JS 引擎只是浏览器这个 loop 的一部分，所以浏览器会负责调度各子系统，检测各种事件是否完成，并在合适的事件回收动态分配的内存。

程序本身都是同步的，只是局限于特定的时空观下呈现出异步的特性[^bnsa]。

异步的也不是 JS，是为了保障用户体验，将耗时操作交给浏览器，并由在结束时将控制权重新交给 JS。

当算法复杂度足够高或者是个黑盒的时候，我们是无法简单的预测解决的时间，当这个算法被托管给浏览器，浏览器也不能保证其完成的时间，于是无法在程序上合适的位置作出处理，一不小心还会打乱现有的程序流程。

为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，重新安排上面这些不可控流程，防止主线程的阻塞，Event Loop 的方案应用而生。

这个事件循环机制涉及到调用栈，任务队列，现在最为广泛的说法是

> 从全局上下文进入函数调用栈开始，直到调用栈清空，然后执行所有的`micro-task（微任务）`，当所有的`micro-task（微任务）`执行完毕之后，再执行`macro-task（宏任务）`，其中一个`macro-task（宏任务）`的任务队列执行完毕（例如`setTimeout` 队列），再次执行所有的`micro-task（微任务）`，一直循环直至执行完毕。
>
> 作者：梁音 https://juejin.im/post/5bc1adc45188255c82553921

![The event loop](https://camo.githubusercontent.com/a12555cbe873831500e20955075d50558735a5f8/68747470733a2f2f706963312e7a68696d672e636f6d2f76322d61643161323531636239316433373632353138356134666238373434393466635f622e706e67)

细节可以从从 WHATWG SPEC[^processing_model] 上面看，不过新版本的已经没有`microtask` 这种说法，现在被称之为 `task`， 这里还有个动态演示[^tasks-microtasks-queues-and-schedules]。

macrotasks: Script,  setTimeout, setInterval, setImmediate\*, requestAnimationFrame, I/O, UI rendering
microtasks: process.nextTick\*[^nextTick], Promises, ~~Object.observe~~, MutationObserver

1. 每个循环有一个或者多个任务，任务实际上就是宏任务（macrotask）
2. 每个循环都只有一个微任务队列（microtask）
3. 浏览器只保证各队列 FIFO，但是多个队列会交替执行，来保证用户体验
4. 只有当前任务完成才会进行下一个
5. 不是所有的 Event 都通过任务队列

> 小贴士： Node.js 的 `process.nextTick` 会通过 `process.maxTickDepth` 设置打断 microtask 的运行，其他浏览器在实现上也会对过多的 microtask 做出处理。

知乎上有个优先级顺序[^priority]的测试，来简单分析一下

```js
setImmediate(function() {
    console.log(1);
}, 0);
setTimeout(function() {
    console.log(2);
}, 0);
new Promise(function(resolve) {
    console.log(3);
    resolve();
    console.log(4);
}).then(function() {
    console.log(5);
});
console.log(6);
process.nextTick(function() {
    console.log(7);
});
console.log(8);
```

程序主体是当前栈的，在结束之前都不会执行任何异步任务；
`setImmediate` 无论何时都是最后的，它需要等宏任务，微任务，JS 调用栈全部清空才会执行；`setTimeout` 会被加入宏队列，至少在所有的微任务和 JS 调用栈都完成，并且达到要求的延迟才会执行，其中最小的间隔为 4ms；
`process.nextTick` 会插入下一个任务队列开头的位置；
Promise 其实是一种语法糖，下面来用回调重新编写一下。

```js
function fn(resolve) {
    console.log(3);
    setTimeout(resolve, 0);
    console.log(4);
}
fn(function() {
    console.log(5);
})
```

Promise 实现了一个状态机，但是可以简单的这样理解上述情况。不难发现 fn 被立即调用，而 `resolve` 即传入的回调，被 `setTimeout` 延迟到最后执行。

综合上述，输出顺序为 3, 4, 6, 8, 7, 2, 5, 1

但是实际上，原生 Promise.then 的优先级高于 `setTimeout`，所以应该输出 3, 4, 6, 8, 7, **5, 2**, 1

除了这些常见事件，还有一个之前广泛运用的 `requestAnimationFrame`，因为浏览器均未实现 `setImmediate` ，所以在浏览器上将其替换，并删除 Node.js 私有的 `process.nextTick` 。

```js
requestAnimationFrame(function() {
    console.log(1);
});
setTimeout(function() {
    console.log(2);
}, 0);
new Promise(function(resolve) {
    console.log(3);
    resolve();
    console.log(4);
}).then(function() {
    console.log(5);
});
console.log(6);
```

测试输出：3, 4, 6, 5, 2, 1

`requestAnimationFrame` 是个比较奇怪的事件[^requestAnimationFrame]，不过就当`setImmediate`用吧。

写完这些东西，突然觉得之前听说的虚拟 DOM 比直接操作 DOM 快估计是谣言，于是求证了一下[^v-dom]；所以 v-dom 应该有其他价值，那就是加一层抽象，提供了跨平台这一特性；比如 Flipboard 的 `react-canvas` 为了提高移动端的用户体验；为什么不提 RN，因为官方的无论在哪一层做处理都不奇怪；但是优秀的解耦合可以让社区轻易的开发出对应的功能，这就厉害了。

之后就得说说浏览器和 Node.js 环境的差异，Node.js 使用 libuv 作为事件驱动模型。

![libuv & JavaScript](https://cdn-images-1.medium.com/max/1600/1*lkkdFLw5vh1bZJl8ysOAng.jpeg)

上图只包含之前说的那些微队列，而没有微队列的处理时机。在网上广泛的说法[^emmm]是上述 6 个阶段（Idle, prepare 合并）的每个阶段之前会检测微队列，并及时处理。还有一种说法是他们的处理发生在 idle 阶段[^requestAnimationFrame]。

对此我只能设法写个黑盒测试或者去翻翻 Node.js 的源代码，源码和官方的说明没看明白[^nodejs]。

```js
let fs = require("fs");

process.on("exit", function () {
    console.log(1);
});

fs.readFile(__filename, () => {
    console.log(2);

    Promise.resolve().then(function () {
        console.log(3);
    });
});

setTimeout(function () {
    Promise.resolve().then(function () {
        console.log(4);
    });
    
    console.log(5);
}, 0);

Promise.resolve().then(function () {
    console.log(6);
});

process.nextTick(function() {
    console.log(7);
});

console.log(8);
```

于是写了这么一个黑盒测试，来推测一下输出结果，假定每个阶段之后会执行 `process.nextTick` 和 其他 microtask 。

`process.on("exit")` 发生在 close callbacks 阶段，所以应该在最后；
`fs.readFile` 的回调应该发生在 I/O poll 阶段，等待 I/O 的读取；
`setTimeout` 发生在 timers 阶段，应该在当前脚本，即 JS 栈和 microtask 全部清空之后执行；
`promise.then` 在 `nextTick` 之后被调用[^nextTick]，而 `nextTick` 会被插入当前队列的结尾，microtask 的开头；

所以上面的运行结果应该是：8, 7, 6, 5, 4, 2, 3, 1

由此可以印证，官方文档[^nodejs]写的每个阶段都有一个微队列，每个队列完成才会进入下一个阶段。

再回去看看这绕来绕去的事件循环机制，以及那些官方和三方的流程控制库，在《七周七并发》里面介绍过一种 CSP 模型，golang 就是借用了一部分实现非常好用的 go 块。而 JS 也一直有对打破这种诡异控制流程的尝试，诸如 Promise[^promises-book]和 `async/await`，以及 Generator 。

Promise 是将 then 注册的方法缓存，然后等待当前流程结束，在取出执行，由此循环来进行链式调用；而 `async/await` 这个语法糖可以将异步方法，转化成同步，实际上是将同步的写法重新组合成异步。

```js
function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms)
    });
}

async function main() {
	console.time("sleep");
    await sleep(10);
    console.timeEnd("sleep");
}
```

上面的语句块运行时会被转化成这样

```js
function main() /* Thenable */ {
    console.time("sleep");
    return sleep(10).then(() => console.timeEnd("sleep"));
}
```

同样的可以把 then 也给转化成回调

```js
function sleep(ms, callback) {
    setTimeout(callback, ms);
}

function main(callback) {
    console.time("sleep");
    sleep(10, () => {console.timeEnd("sleep");callback();})
}
main(() => console.log("end"));
```

又见到了许久未见的回调地狱，而 Promise 和  `async/await` 的好处不止如此，为了应对错误，还要在回调每一层加上错误处理，但是 Promise 内部已经将其封装在 `then` 的第二个方法，或者通过链式调用传递到最后的 `catch`。

Generator 语法已经许久不见人提，当年 Koa 上可是风生水起，把程序通过 `yield` 拆分成几块，逐步递归调用，巧妙的实现了异步的同步写法。而随着  `async/await` 的出现，已经没有必要通过 Generator+Promise[^co] 这种方法来处理了。一直觉得生成器和迭代器有关系，毕竟接口一样，受到某本书的提点，果然有关系。[^Iterators_and_Generators]

## Web APIs

这些 API 是浏览器（Browser）或者（Document），提供给 JS 引擎调用的，所以被称之为 BOM 和 DOM。

而浏览器实际上是对硬件和主机的一层抽象，加上对窗口这一实体的状态控制，所以大概有这么几类接口。

* 环境信息（系统，浏览器和插件的相关接口`screen`，`navigator`）
* 窗口管理（窗口可能是标签或者 `frame`，`window`）
* 浏览状态（`location`， `history`，`performance`）

其中`screen`是和显示有关的一堆只读属性； `navigator` 常用于兼容性检查；`window`是环境，所有对象都是它的属性；`location` 是 URL 对象；`history` 是浏览过程的抽象，SPA 的路由就是框架操作他；`performance` 是性能监测的接口，用于分析，但是支持情况还不太好。

而主要的就是 DOM（文档对象模型），用于操纵 DOM 和 CSSOM，从而影响渲染树，触发 `reflow` 和 `reprint`；所以盲目的修改 DOM 和 CSSOM 会导致性能急速下降。

学习过 Java 的可能了解，Java 有非常详细的接口文档生成工具；但是暂时我还没找到类似的接口文档，只在 VSCode/WebStrom 上，使用 TypeScript 时会调用 TypeScript 的库，而它有个 `d.ts` 的定义文件，包含了接口，结构和函数的定义，在 IDE 上还可以使用 `Ctrl` 进行跳转。暂时也没弄明白 JS 的继承关系图咋生成，所以就直接看别人的吧。

![对象继承关系](https://img-blog.csdn.net/20170621090720130?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaXRwaW5wYWk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

[`EventTarget`](https://github.com/Microsoft/TypeScript/blob/v3.2.2/lib/lib.dom.d.ts#L5058) 是所有浏览器内部对象的根对象，前面已经知道 JS 的原型链，通过反查也能发现这套继承关系。（有空整个脚本出来，生成继承关系图）

![window 的原型链](https://i.loli.net/2019/01/13/5c3ac6f69742d.png)

在此以 `window` 为例，它被封装了几层，暂时不知道干嘛的，其他只包含了一堆从其他对象上弄过来的 shortcode；然后从根元素开始看起。（UML 类图真方便，假装这里有图）

[`EventTarget`](https://github.com/Microsoft/TypeScript/blob/v3.2.2/lib/lib.dom.d.ts#L5058) 提供了一个非常方便的，订阅/发布模型，通过 `addEventListener` 绑定监听器，并通过 `dispatchEvent` 触发事件；事件流（event-flow）有 2 个调用阶段，捕获的自上而下，冒泡的自下而上；因为继承自这个对象，浏览器中的所有对象都支持事件绑定。

> `addEventListener` 的第三个参数是是否在捕获阶段调用，为 `false` 时，等效于 `attachEvent` 或者 `on*`。
>
> 但 `on*` 事件是 DOM 0 级，其只能定义一个回调，但是具有极好的兼容性。
>
> 这也是事件冒泡在 IE 和标准浏览器差异。

事件委托其实就是只绑定父元素，让子元素的事件通过冒泡被父元素捕获，来减少资源使用；

在 TS 的 `dom.d.ts` 里面搜索 `extends EventTarget` 会得到非常多的结果，只要是 JS 和其他东西有点交互的都有这东西；不过其中最为重要的可能是 `Node` 对象；这是生成节点树的基础，之后的 `Document`，`Element` 都是继承自它。

它也提供了最基础的节点属性和操作方法，先是节点关系，有这么一张图

![DOM 树关系](https://image-static.segmentfault.com/866/502/866502812-59e4b8fd9ec4e)

`nodeName` 是节点的名字，后面继承会对其通过原型链进行覆盖，而 `nodeType` 是个枚举结构；包含定义的全部 Node 类型。

Node 被 `CharacterData`，`Document`，`Element` 等对象继承； `CharacterData` 为后面的字符类型（`Text`，`Comment`）的对象定义了接口；`Document` 是对文档的抽象，包含了文档具有的属性和操作方法，以及必要的事件回调；`Element` 由于解析后的语法 差异分为 `HTMLElement` 和 `SVGElement`；`HTMLElement` 是所有 HTML 标签的原型对象，其增加了显示和交互上的属性；之后的节点就不必细说，上面提供的文档写的清清楚楚，MDN 介绍的更为详细。

## 总结

本文不过是通读《JavaScript 高级程序设计》，《你所不知道的 JavaScript》的粗俗总结。

目前觉得弄明白这几点，对于前端本身只是唯手熟而了；但是这只是其他领域知识的在前端的运用，那么前端自己究竟有啥？

之前的一个统计，名校的走前端的比较少，因为难度没那么高嘛？可能是因为前端本身被浏览器和服务器夹在中间，又因为底子不够厚实，所以偏向工程化，主要就是协调浏览器，服务器和用户。估计今年 WASM 得大火，先把 Rust 弄熟了再说。

还有这几年特别流行加一层，为了抢占原生市场，RN和小程序啊都是前端的子集，加个抽象层处理跨平台问题。只说 JS 的预编译器和新语言能转化的 JS 轮子就是一堆，TS 已经站在风口，Dart 估计也快了。。。不过都是工程实践，切图仔已经变成泛前端，要是算上 WebGL ，WebRTC 这些东西。。。坑越来越大，慢慢学吧

安利入门阅读顺序

1. 《HTML5与CSS3权威指南》（通识）
2. 《你不知道的JavaScript（下卷）》（配合其他 2 卷）
3. 《JavaScript 高级程序设计》
4. ...CSS + HTML 进阶的还没看

## 参考

[^null]: https://en.wikipedia.org/wiki/Tony_Hoare  Speaking at a software conference called QCon London in 2009
[^js_works]: https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf How JavaScript works: an overview of the engine, the runtime, and the call stack
[^stack&]: http://blog.jobbole.com/75321/ 什么是堆和栈，它们在哪儿？
[^ToNumber]: https://github.com/v8/v8/blob/b586b64276f94f4fcae9d22d7d0657f1dc6bb7bc/src/compiler/operation-typer.cc#L268 OperationTyper::ToNumber
[^ultimate-guide]: https://blog.hhking.cn/2018/10/24/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript [译]JavaScript 终极指南之执行上下文、变量提升、作用域和闭包
[^r]: https://hllvm-group.iteye.com/group/topic/37596 JavaScript引擎的简介，及相关资料/博客收集帖
[^bnsa]: http://aju.space/2016/09/20/blocking-nonblocking-sync-async.html 阻塞、非阻塞、同步、异步
[^processing_model]: https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model 8.1.4.2 Processing model
[^tasks-microtasks-queues-and-schedules]: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/ Tasks, microtasks, queues and schedules
[^nextTick]: http://howtonode.org/understanding-process-next-tick 理解 Node.js 里的 process.nextTick()
[^priority]: https://www.zhihu.com/question/36972010 Promise的队列与setTimeout的队列有何关联？
[^requestAnimationFrame]: http://www.alloyteam.com/2016/05/javascript-timer/ JavaScript定时器与执行机制解析
[^handing_io]: https://jsblog.insiderattack.net/handling-io-nodejs-event-loop-part-4-418062f917d1 Handling IO — NodeJS Event Loop Part 4
[^emmm]: https://segmentfault.com/a/1190000016022069 微任务、宏任务与Event-Loop
[^nodejs]: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/ The Node.js Event Loop, Timers, and process.nextTick()
[^nextTick]: https://zhuanlan.zhihu.com/p/35039878 Node.js源码解析：深入Libuv理解事件循环
[^promises-book]: https://www.kancloud.cn/kancloud/promises-book/44233 4.4. Deferred和Promise
[^co]: http://www.ruanyifeng.com/blog/2015/05/co.html co 函数库的含义和用法
[^sec-4.3.4]: https://www.ecma-international.org/ecma-262/5.1/#sec-4.3.4 4.3.4 constructor
[^v-dom]: https://www.zhihu.com/question/67479886 既然用 virtual dom 可以提高性能，为什么浏览器不直接自带这个功能呢？
[^Iterators_and_Generators]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators 迭代器和生成器
[^interview]: https://juejin.im/post/5ba34e54e51d450e5162789b 2万5千字大厂面经