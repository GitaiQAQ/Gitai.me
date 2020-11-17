---
layout:     post
title:      "NodeJS 沙盒技术一览"
date:       2019-12-30
author:     "Gitai"
tags:
  - JaveScipt
  - V8
  - 不可信运行环境

---

| Module                                                       | Secure | Memory   Limits | Isolated | Multithreaded | Module Support | Inspector Support |
| :----------------------------------------------------------- | ------ | --------------- | -------- | ------------- | ---------------- | ------------------- |
| [vm](https://nodejs.org/api/vm.html)                         |        |                 |          |               | ✅                | ✅                   |
| [worker_threads](https://nodejs.org/api/worker_threads.html) |        |                 | ✅        | ✅             | ✅                |                     |
| [vm2](https://github.com/patriksimek/vm2)                    | ✅      |                 |          |               | ✅                | ✅                   |
| [napajs](https://github.com/Microsoft/napajs)                |        |                 | ✅        | ✅             | Partial          |                     |
| [webworker-threads](https://github.com/audreyt/node-webworker-threads) |        |                 | ✅        | ✅             |                  |                     |
| [tiny-worker](https://github.com/avoidwork/tiny-worker)      |        |                 | ✅        |               | ✅                |                     |
| isolated-vm                                                  | ✅      | ✅               | ✅        | ✅             |                  | ✅                   |

- Secure:      Safely run untrusted code
- Memory      Limits: Possible to set memory limits / safe against heap overflow DoS      attacks
- Isolated:      Is garbage collection, heap, etc isolated from application
- Multithreaded:      Run code on many threads from a single process
- Module      Support: Is require supported out of      the box
- Inspector      Support: Chrome DevTools supported


来自 <https://github.com/laverdet/isolated-vm#examples> 

<!-- more -->

## 概览

这是《如何运行不可信代码？》系列的第一篇，简述 JS 常见的沙盒，并选其一进行分析。

先是简要分析头表

`vm` 只是改变了运行环境的上下文，所以官网说是不能用于执行不安全的代码

`vm2` 做了一些简单的覆盖，提升了安全性，因为公用同一个上下文，所以 loader 相同，存在对全局模块的修改问题

https://github.com/Houfeng/safeify/blob/master/DOC.md

随后就是多线程的实现

`webworker-threads` 早期的社区实现，无法 `require`

`worker_threads` 官方实现的多线程，线程间的确是隔离的，但是无法对 io 操作进行限制

`tiny-worker` 对上面的一个包装

最后就是

`napajs` 微软的并行计算环境，以后再分析

`isolated-vm` 下面要分析的

至于闭包，Function或者 Proxy 这种就不赘述了

## 如何使用 ivm 

```js
// 创建一个内存限制 128MB 的隔离虚拟机
const ivm = require('isolated-vm');
const isolate = new ivm.Isolate({
    memoryLimit: 128
});

// 每个隔离虚拟机的上下文相互隔离
const context = isolate.createContextSync();

// 解除 global 的引用，传递给上一步创建的上下文
context.global.setSync('global', context.global.derefInto());

// 在上述上下文中执行，并解构结果
const {
    result
} = context.evalSync(`(() => "Hello world")()`);

// > hello world
console.log(result);

```

划重点，这里有个多进程数据共享的模型，除了所有者可以直接修改，其他线程只能通过 `set` 代理进行修改，防止数据竟态。

```ts
readonly global: Reference<Object>;
```

`context` 的 `global` 是个引用对象，是由 `context` 创建的，属于 `context` 线程的对象；所以我们在主实例中修改需要使用 `set` 方法。

我们剥离他的实现，从最基本的引用对象（指针类型）来看这个问题，不过不同的是，现在的 `global` 所有权在主实例上，所以 `ivm` (`isolate-vm`) 中需要使用 `set` 方法修改，`get` 来读取。

```js
// 引入当前环境的对象
const global = {};

// 创建对 global 的引用，传递给隔离虚拟机
context.global.setSync('global', new Reference(global));

// 在上述上下文中执行，并解构结果
const {
    result
} = context.evalSync(`(() => {
    // global: Reference<Object>
    global.setSync("name", "setSync");
    global.name = "assignment";
    return global;
})()`);

// 输出 Global 对象
console.log(global);
// => Object {name: "setSync"}
```

因为上面的原因，在外部是**原始对象**，而传递进 `ivm` 内的是对其的引用，非原始类型在多个隔离区域内的传递，只能传递其引用，并且其存在的上下文，依然是创建时所在的环境。

比如下面这个对于函数引用的例子

```js
// 引入当前环境的h函数
const global = () => {
    debugger; // 没有这个 debugger 可能啥都看不到
    process.exit()
};

// 创建对 global 的引用，传递给隔离虚拟机
context.global.setSync('exit', new Reference(global));

// 在上述上下文中执行，并解构结果
context.evalSync(`(() => {
    // exit: Reference<Function>
    exit.applySync();
})()`);
```

![](https://i.loli.net/2020/01/01/gbBf3TO6cGdemt9.png)

经过几分钟的尝试，不难发现 ivm 只支持基本的 ES 特性，node 对 V8 的修改基本都是用不了的。

比如当你使用 Buffer 的时候会发现

```js
const buf = new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```shell
发生异常: ReferenceError
ReferenceError: Buffer is not defined 
```

类似的 CMD 加载器也是用不了的，[**Access node's I/O from any Isolate**](https://github.com/laverdet/isolated-vm/issues/27)

```shell
发生异常: ReferenceError
ReferenceError: require is not defined 
```

分析过 Webpack 或者用过 [rollup](https://gitai.me/2019/06/rollup/) 的也许能想到 CMD 和 UMD 都是可以被[自己封装](https://gitai.me/2019/07/webpack-lazyload/)出来的，比如 Webpack 的异步加载，或者 rollup 的单文件打包，这的确是个非常好的方法，并且 ivm 实现了一个叫 Module 的东西，恰好可以加载 rollup 生成的单文件包。

```js
// rollup.config.js

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default {
    input: 'index.js',
    output: {
        format: 'esm',
        name: "uuid",
        file: 'dist/uuid.js'
    },
    plugins: [
        resolve(),
        commonjs(),
    ]
}
```

先用啥上面的 `rollup.config.js` 构造单文件的 ESM 模块，将生成的 `dist/uuid.js` 放到合适的位置

但是没想到简简单单的 **uuid** 都有 **crypto** 的引入，不过好在就一个 `crypto.randomBytes` 

替换为 `[0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef]`

随后按照 global 的挂载方式进行挂载 

```js
const uuid = isolate.compileModuleSync(
	fs.readFileSync(require.resolve("./uuid.js")).toString()
);

uuid.evaluateSync();

// 挂在 UUID
context.global.setSync('uuid', uuid.namespace.derefInto());
```

随后就可以在代码中使用

```js
// 在上述上下文中执行，并解构结果
let {
    result
} = context.evalSync(`(() => {
    // uuid: { default: { v1: ..., v4: ... } }
    return uuid.default.v1();
})()`);

console.log(result);
// >= 0eb78440-2afa-11ea-afef-efefefefefef
```

这里 Module 还有一个方法 `instantiateSync` 可以对 Module 的依赖进行注入，比如上面的 `crypto.randomBytes` 可以被下面的代码处理

 ```js
uuid.instantiateSync(context, function (spec) {
    if (spec == 'crypto') {
        return isolate.compileModuleSync(`
        export default {
            randomBytes: () => {
                return [0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef, 0xef];
            }
        }
        `);
    }
});
 ```

所以类似 Webpack 需要实现的 Loader 一样。

但是这样有一个根本问题难以解决，恰好上面遇到了 **crypto** 这种内建依赖。什么是内建依赖？

在 **node** 的 [`require`](https://github.com/nodejs/node/blob/e4e5a835b8ced02ca6d08d7f44826e7617ec5e9e/lib/internal/bootstrap/loaders.js) 所导入的依赖中，存在以下几类

以 **crypto** 为例，先是外部通过 `require` 引入 `lib/crypto.js` ，而其中又通过 

`internalBinding` 和 C++ 实现的 **crypto** 实现绑定。

再看看 **fs**，在 `lib/fs.js` 中通过 `require` 引入必要的内建（build-in）工具类，又通过 `internalBinding` 绑定到 `libuv` 实现的 `fs`。详细参见：[《nodejs是如何和libuv以及v8一起合作的？》](https://juejin.im/post/5dd0b1fff265da0bae519ed4)

所以这里的问题就是，ivm 中无法绑定到 `libuv`，无法实现对底层的控制；这里的话，就有了几种设想。

- 隔离区域内调用主实例的方法，然后在主实例中完成对 `libuv` 的调用
- 修改 ivm 的实现，看看能否在 C++ 层面绑定 `node.cc` 进去，因为前面已经分析过，v8 初始化之后加载 node 的绑定，以及各种依赖，构成的 node 环境，但是存在安全隐患。

所以的确有人实现过这种东西，**fly.io** 也就是 ivm 下面的例子说的哪个，但是官网说明看起来已经切换到 [Firecracker microVMs](https://github.com/firecracker-microvm/firecracker).

但是 fly 上代码明明用的是 ivm，而且在 `packages/core/src` 中实现了部分 node 和隔离区的桥，实现各种 io 操作。

比如这个 [digestHash](https://github.com/superfly/fly/search?q=digestHash&unscoped_q=digestHash)，就是在主实例和 ivm 中，构造了一个桥，完成数据交换。

## napajs 简单尝试

最后看一个 napajs 的例子

```js
const napa = require('napajs');
var zone1 = napa.zone.create('zone1', {
    workers: 10
});

// Broadcast code to all 4 workers in 'zone1'.
zone1.broadcast(`
    // process.exit(0);
    const fs = require("fs");
    fs.name = (~~fs.name) + 1;
    console.log("Zone end", fs.name);
`);

setTimeout(() => {
    console.log("Main end")
}, 1000);
```

经过不完善不彻底的简单测试，`process.exit` 挂了。

## V8 Isolate 是啥东西？

> A V8 Isolate is something that Node.js uses to run JS code.
> It consists (mostly) of a single JS heap, that is, JS values and code inside a single `Isolate` can refer to other values and pieces of code inside that `Isolate`, but not values from another `Isolate`.
> Practically speaking, Node.js uses 1 `Isolate` per thread; one, if you are only running the main thread, and an additional `Isolate` for each new Worker thread instance. That allows the different threads to run in parallel, but has the disadvantage that it forbids them from accessing each other’s contents directly.

> Maybe to disambiguate; when talking about the “heap”, there’s two things you could be referring to:
> * The JS heap. This is a memory full of JS objects (and some JS-related objects, e.g. Contexts in V8, the microtask queue, etc.) – basically everything managed through the JS engine’s garbage collector. This is what people are usually referring to when talking about the “heap” in a Node.js context.
> * The native heap. This is memory allocated directly C++ using e.g. malloc() or new Foo(). A lot of metadata that is about managing code, such as the V8 Isolate object itself, is allocated this way.

上面一大段最重要的就是 Isolate 的确能构造安全的沙盘，然后我们通过对比 `node-worker`, `napajs` 和 `isolate-vm` 来理解 Isolate 用法以及实现的 JS 运行时差异。

```cpp
// Node v13.5.0
// node_worker.cc
// https://github.com/nodejs/node/blob/v13.5.0/src/node_worker.cc#L228
static void Worker::Run() {
    // WorkerThreadData
    {
        Isolate::CreateParams params;

        Isolate* isolate = Isolate::Allocate();
        Isolate::Initialize(isolate, params);
    }

    context = NewContext(isolate_);

    // 绑定 libuv 并加载 node 的环境
    env_.reset(new Environment(data.isolate_data_.get(),
                                   context,
                                   std::move(argv_),
                                   std::move(exec_argv_),
                                   Environment::kNoFlags,
                                   thread_id_));

    env_->set_env_vars(std::move(env_vars_));
    env_->set_abort_on_uncaught_exception(false);
    env_->set_worker_context(this);

    env_->InitializeLibuv(start_profiler_idle_notifier_);

    env_->RunBootstrapping()
}
```

上面这是 Node 的环境初始化过程，先是创造 `Isolate` 环境，随后是绑定上下文，最后绑定 libuv 并通过 RunBootstrapping 绑定 JS 环境和 C++ 的底层操作，然后加载内置 JS 模块，对外用于用户使用。

```cpp
// Isolate-VM
// environment.cc
// https://github.com/laverdet/isolated-vm/blob/v2.0.2/src/isolate/environment.cc#L610
void IsolateEnvironment::IsolateCtor () {
    Isolate::CreateParams create_params;

    isolate = Isolate::New(create_params);
    PlatformDelegate::RegisterIsolate(isolate, &scheduler);

    default_context.Reset(isolate, Context::New(isolate));
}
```

而这里的 `Isolate-VM`，只有上面的前 2 个阶段，并没有对于 libuv 和 C++ 绑定，加载 JS 依赖。

所以我们使用的 Node.JS 环境实际上就是 v8 执行器 + libuv 的底层封装，然后加个 JS 接口层来弱化对底层的强依赖。

```cpp
// napajs
// worker.cpp
// https://github.com/microsoft/napajs/blob/0.2.3/src/zone/worker.cpp#L112
static void Worker::WorkerThreadFunc() {
    // CreateIsolate
    {
        v8::Isolate::CreateParams createParams;

        static napa::v8_extensions::ArrayBufferAllocator commonAllocator;
        createParams.array_buffer_allocator = &commonAllocator;

        // Set the maximum V8 heap size.
        createParams.constraints.set_max_old_space_size(settings.maxOldSpaceSize);
        createParams.constraints.set_max_semi_space_size(settings.maxSemiSpaceSize);
        createParams.constraints.set_max_executable_size(settings.maxExecutableSize);

        isolate = v8::Isolate::New(createParams);
    }

    v8::Local<v8::Context> context = v8::Context::New(isolate);

    // We set an empty security token so callee can access caller's context.
    context->SetSecurityToken(v8::Undefined(isolate));
    // v8::Context::Scope contextScope(context);

    NAPA_DEBUG("Worker", "(id=%u) V8 Isolate created.", _impl->id);
}
```

最后我们看看 `napajs` 是怎么实现不完整的 `require`。(不完整的原因我也不知道是啥，是在头表，也就是 isolate-vm 中说的部分实现)

```cpp
// napajs
// napa-zone.cpp
// https://github.com/microsoft/napajs/blob/0.2.3/src/zone/napa-zone.cpp#L75
NapaZone::NapaZone(const settings::ZoneSettings& settings) : 
    _settings(settings) {

    // Create the zone's scheduler.
    _scheduler = std::make_unique<Scheduler>(_settings, [this](WorkerId id) {
        // Initialize the worker context TLS data
        INIT_WORKER_CONTEXT();

        // Zone instance into TLS.
        WorkerContext::Set(WorkerContextItem::ZONE, reinterpret_cast<void*>(this));

        // Worker Id into TLS.
        WorkerContext::Set(WorkerContextItem::WORKER_ID, reinterpret_cast<void*>(static_cast<uintptr_t>(id)));

        // Load module loader and built-in modules of require, console and etc.
        CREATE_MODULE_LOADER();
    });
}
```

经过一系列调用，最后会在这里出现 [`napa-binding.cpp`](https://github.com/microsoft/napajs/blob/0.2.3/src/module/core-modules/napa/napa-binding.cpp#L51)

然后 `require` 实际上在这里 [`ModuleLoader::CreateModuleLoader`](https://github.com/microsoft/napajs/blob/0.2.3/src/module/loader/module-loader.cpp#L113) —> [`ModuleLoader::ModuleLoaderImpl::SetupRequire`](https://github.com/microsoft/napajs/blob/0.2.3/src/module/loader/module-loader.cpp#L362) 实现。

THE END.

