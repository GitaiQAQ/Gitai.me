---
layout:     post
title:      "使用 Promise 实现的单元测试框架"
date:       2019-04-25
author:     "Gitai"
tags:
  - Promise
  - 单元测试
  - 造轮子
categories:
  - 轮子
---

写完才发现，到底是单元测试框架还是单元测试函数，是个问题？毕竟才

不到 50 行。

上一篇看 Webpack 源码的然后写了个仿 `tape`，这里来理理如何用 Promise 实现单元测试。

```js
test('A passing test', (assert) => {
    assert.pass('This test will pass.');
    assert.end();
});
```

例子是这样的，有那么一个 `test` 方法，接受一个 Label 和函数作为参数。

<!--more-->

并且有如下约束，`end` 必须执行，且前面的所有断言均为真，那就需要一个变量来储存这个状态。

### 单元测试函数

```js
function test(label, fn) {
  let handle = (err, msg) => {
    console.log(label);
    if (err) {
      console.log(`[err]`, err);
      return;
    }
    console.log(`[ok] ${msg}`);
  };
    
  return new Promise((resolve, reject) => {
    let ok = false;
    let data = null;
    let assert = {
        pass: (msg) => (ok = true, data=msg),
        throw: (err) => (ok = false, data=err),
        end () {
          ok ? resolve (data) : reject (data);
        }
    };
    fn (assert);

    ok = false;
    assert.end();
  })
  .then((msg) => handle(null, msg), (err) => handle(err))
}

test('A passing test', (assert) => {
  assert.pass('This test will pass.');
  assert.end();
});

test('Throw a error', (assert) => {
  throw new Error('Bomb.');
  assert.end();
});
```

运行一下，会获得如下结果

```shell
$ node ./src/test.js
A passing test
[ok] This test will pass.
Throw a error
[err] Error: Bomb.
    at test (C:\Users\Administrator\Desktop\transer\src\test.js:35:9)
    at Promise (C:\Users\Administrator\Desktop\transer\src\test.js:21:5)
    at new Promise (<anonymous>)
    at test (C:\Users\Administrator\Desktop\transer\src\test.js:11:10)
    at Object.<anonymous> (C:\Users\Administrator\Desktop\transer\src\test.js:34:1)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
```

完美，但是比起 `tape` 似乎少了什么，来对比一下。

```shell
$ node ./src/test.js
TAP version 13
# A passing test
ok 1 This test will pass.
# Throw a error
C:\Users\Administrator\Desktop\transer\src\test.js:8
  throw new Error('Bomb.');
  ^

Error: Bomb.
    at Test.test (C:\Users\Administrator\Desktop\transer\src\test.js:8:9)
    at Test.bound [as _cb] (C:\Users\Administrator\Desktop\transer\node_modules\tape\lib\test.js:77:32)
    at Test.run 
```

哦，他居然不能捕获 `throw`，那我们换个例子。

```js
test('Throw a error', (assert) => {
  assert.fail('Bomb');
  assert.end();
});
```



```shell
$ node ./src/test.js
TAP version 13
# A passing test
ok 1 This test will pass.
# Throw a error
not ok 2 Bomb
  ---
    operator: fail
    at: Test.test (C:\Users\Administrator\Desktop\transer\src\test.js:8:10)
    stack: |-
      Error: Bomb
          at Test.assert [as _assert] (C:\Users\Administrator\Desktop\transer\node_modules\tape\lib\test.js:226:54)
          at Test.bound [as _assert] (C:\Users\Administrator\Desktop\transer\node_modules\tape\lib\test.js:77:32)
          at Test.fail 
  ...

1..2
# tests 2
# pass  1
# fail  1
```

相比他，我们的实在是太完美了，就差个报告。

首先是最前面的 `TAP version 13` 我们要写个方法，让他只出现一次。必须写在一个全局唯一的实例里面，还不能污染其他环境。

JavaScript 的左查询（赋值操作）有个特性，会先再作用域里面查找，然后替换，常用于惰性求值。于是有了如下代码，用个子函数作为执行体，外部通过闭包保存全局数据。

```js
function test (label, fn) {
  console.log('TinyTest version 0.1');
  function rawTest (label, fn) {
    let handle = (err, msg) => {
      // ...
    };
      
    new Promise((resolve, reject) => {
      // ...
    })
    .then((msg) => handle(null, msg), (err) => handle(err));
  }
  test = (label, fn) => rawTest(label, fn);
  test(label, fn);
}
```

运行到结束时，会用箭头表达式，生成匿名函数覆盖上面定义的 `test`。

这样就能保证 'TinyTest version 0.1' 只会输出一遍。

接下来，既然有了闭包，我们可以在里面存全局变量，那么 id 就可以放进去。

```js
function test (label, fn) {
  let id = 0;
  console.log('TinyTest version 0.2')
  function rawTest (label, fn, id) {
    let handle = (err, msg) => {
      console.log(id, label);
      // ...
    };
      
    new Promise((resolve, reject) => {
        // ...
    })
    .then((msg) => handle(null, msg), (err) => handle(err));
  }
  test = (label, fn) => rawTest(label, fn, ++id);
  test(label, fn);
}
```

这样就可以得到自增 id，输出如下结果。

```shell
$ node ./src/test.js
TinyTest version 0.1
1 'A passing test'
[ok] This test will pass.
2 'Throw a error'
[err] Error: Bomb.
    at test (C:\Users\Administrator\Desktop\transer\src\test.js:41:9)
    at Promise (C:\Users\Administrator\Desktop\transer\src\test.js:24:7)
```

最后就是那个成功失败数量的报告了，通过变量覆盖确定第一次执行容易，但是确定最后一个执行就难了。

这里可以用  Node.js 生命周期里面的，`exit` 事件。

最终实现如下：

```js
function test (label, fn) {
  let id = 0;
  let success = 0;
  process.on('exit', () => {
    console.log(`# pass ${success}/${id}`);
    console.log(`# fail ${id - success}/${id}`);
  });
  console.log('TinyTest version 0.2')
  function rawTest (label, fn, id) {
    let handle = (err, msg) => {
      console.log(id, label);
      if (err) {
        console.log(`[err]`, err);
        return;
      }
      success++;
      console.log(`[ok] ${msg}`);
    };
      
    new Promise((resolve, reject) => {
      let ok = false;
      let data = null;
      let assert = {
          pass: (msg) => (ok = true, data=msg),
          throw: (err) => (ok = false, data=err),
          end () {
            ok ? resolve (data) : reject (data);
          }
      };
      fn (assert);
  
      ok = false;
      assert.end();
    })
    .then((msg) => handle(null, msg), (err) => handle(err));
  }
  test = (label, fn) => rawTest(label, fn, ++id);
  test(label, fn);
}
```

测试如下：

```shell
$ node ./src/test.js
TinyTest version 0.2
1 'A passing test'
[ok] This test will pass.
2 'Throw a error'
[err] Error: Bomb.
    at test (C:\Users\Administrator\Desktop\transer\src\test.js:47:9)
    at Promise (C:\Users\Administrator\Desktop\transer\src\test.js:30:7)
    at new Promise (<anonymous>)
    at rawTest (C:\Users\Administrator\Desktop\transer\src\test.js:20:5)
    at test (C:\Users\Administrator\Desktop\transer\src\test.js:37:25)
    at Object.<anonymous> (C:\Users\Administrator\Desktop\transer\src\test.js:46:1)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
# pass 1/2
# fail 1/2
```

其实这得算 0.2 了，之前那个版本在这 [使用 Promise 实现的单元测试框架？？函数](https://gist.github.com/GitaiQAQ/51cd10d1ef03305cc52b70d9b46a1562)，逻辑一样，但是长了好多。

### 单元测试框架

既然称之为框架，自然要有自己的 Cli 接口，能对项目级的测试进行处理。

所以需要拓展上面的测试函数为如下内容

```js
#!/usr/bin/env node

function test(label, fn) {
	...
}
    
module.exports = (label, fn) => test(label, fn);

if (!module.parent) {

    const cwd = process.cwd();
    const fs = require('fs');
    const path = require('path');

    delete require.cache[module.filename];
    let _nodeModulePaths = module.__proto__.constructor._nodeModulePaths;
    module.__proto__.constructor._nodeModulePaths = (...args) => {
        let paths = _nodeModulePaths(...args);
        paths.unshift(module.path);
        return paths
    }

    process.argv
        .slice(2)
        .map(p => fs.readdirSync(p).map(file => path.join(cwd, p, file)))
        .flat()
        .map(tests => require(tests));
}
```

一方面，`module.exports` 将其导出，可以通过 `require('../path/test')` 调用；另一方面，`module.__proto__.constructor._nodeModulePaths` hack 了 node 的模块加载机制，将当前文件加入模块目录，可以通过 `require('test')`；而之后调用 `require` 方法，执行传入目录下所有测试项目。

![1558061315454.png](https://i.loli.net/2019/05/18/5cdf9850d594337861.png)

对于如上目录结构的项目，可以这样进行测试

```shell
$ node ./bin/test.js ./tests
TinyTest version 0.2

1. Fail
 [err] Error: fail
    at Object.fail (C:\Users\Administrator\Desktop\transer\bin\test.js:27:83)
    at C:\Users\Administrator\Desktop\transer\tests\fail.js:4:12
    at C:\Users\Administrator\Desktop\transer\bin\test.js:32:13
    at new Promise (<anonymous>)
    at rawTest (C:\Users\Administrator\Desktop\transer\bin\test.js:22:9)
    at test (C:\Users\Administrator\Desktop\transer\bin\test.js:39:27)
    at test (C:\Users\Administrator\Desktop\transer\bin\test.js:40:5)
    at module.exports (C:\Users\Administrator\Desktop\transer\bin\test.js:43:33)
    at Object.<anonymous> (C:\Users\Administrator\Desktop\transer\tests\fail.js:3:1)
    at Module._compile (internal/modules/cjs/loader.js:759:30)

2. A passing test
 [ok] This test will pass.

3. Throw a error
 [err] Error: Bomb.
    at C:\Users\Administrator\Desktop\transer\tests\throw.js:4:11
    at C:\Users\Administrator\Desktop\transer\bin\test.js:32:13
    at new Promise (<anonymous>)
    at rawTest (C:\Users\Administrator\Desktop\transer\bin\test.js:22:9)
    at test (C:\Users\Administrator\Desktop\transer\bin\test.js:39:27)
    at module.exports (C:\Users\Administrator\Desktop\transer\bin\test.js:43:33)
    at Object.<anonymous> (C:\Users\Administrator\Desktop\transer\tests\throw.js:3:1)
    at Module._compile (internal/modules/cjs/loader.js:759:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:770:10)
    at Module.load (internal/modules/cjs/loader.js:628:32)

# pass 1/3
# fail 2/3
```

