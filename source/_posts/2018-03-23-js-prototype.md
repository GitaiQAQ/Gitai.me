---

  layout:     post
  title:      "JavaScript 原型和继承"
  date:       2018-03-23
  author:     "Gitai"
  categories:
      - JavaScript
---

JavaScript 对于具有面向对象语言开发经验的人(Java or C++)来说是非常容易的，只是它是动态的并且不在语言本身提供类(Class) 的支持，在 ES2015 实现了 Class 这个关键字，但是只是个基于原型的语法糖。本质区别是 JavaScript 基于内存结构的描述来实现继承，C++ 基于具体的内存块实现。

<!-- more -->

在准备这个话题[^Inheritance_and_the_prototype_chain]的时候发现几张图。

![javascript_object_layout]($res/javascript_object_layout.jpg)

所以以下内容就大概可以围绕上图种的几个关键词描述。

* `prototype`
* `[[prototype]]`
* `__proto__`
* `this`
* `constructor`


## 必要的小知识

### **ECMAScript** vs **JavaScript**

**ECMAScript** 是 **Ecma International**这个组织制定的一套协议，规范和指导方针。

**JavaScript** 只是其中的一个实现，并且 Google/Firefox/Microsoft 等巨头都有对应的实现差异，这也是前端兼容性的一部分。对此目前最为流行的是 Google 实现的 V8 引擎，国内基本搬运并修改了该引擎进行本地化，Nodejs 也是基于 V8 虚拟机实现。当浏览器厂商完成私有方法的协调之后，就会慢慢并入 **ECMAScript** 协议当中。


## 基本对象创建[^Objct]

来看对象的生成过程，熟悉其他面向对象语言的都基本知道，对象通过构造器/函数生成。

```js
var foo = {
	bar: 1
}
```
本质上上述对象字面量的创建方法和下面的 `new` 方法一致。

```js
var foo = new Object();
foo.bar = 1;
```
但是也有细微的差异，将于下文叙述

## 自定义对象创建[^字面量]

首先使用函数构造对象（原理见原型链章节叙述）

```js
function Foo() {
	this.bar = 1
};

var foo = new Foo();
```
接下来使用 ES6 增加的 `class` 关键字

```js
class Foo {
	constructor() {
		this.bar = 1; 
	}
};

var foo = new Foo();
```
同样 `class` 也只是个语法糖，虽然并不对等，比如 `class` 会在作用域链上增加一层 `Script`


## 原型和继承 - 属性查找

当谈到继承时，JavaScript 只有一种结构：对象。每个对象都有一个私有属性[^__proto__]（称之为隐式原型 `[[Prototype]]`），它指向它的原型对象（**prototype**）。该 prototype 对象又具有一个自己的 prototype ，层层向上直到一个对象的原型为 `null`。根据定义，`null` 没有原型，并作为这个**原型链**中的最后一个环节。[^MDN-prototype]

[^__proto__]: 部分浏览器使用私有属性 `__proto__` 可以访问，并于 ES6 可以通过 `getPrototypeOf` 访问

当通过 `obj.propName` 访问对象的属性时，引擎将会顺着 `__proto__` 递归查找，直到找到 `propName` 或者 `__proto__` 为 `null`，既原型链结束。返回 `undefined`

### 构造函数

构造函数拥有 `prototype` 属性[^MDN-prototype]，这只是函数对象私有的一个属性，被称之为显式原型；因为函数也是一种特殊的对象，用于区分对象的 `[[Prototype]]`。派生对象和函数的 `prototype` 对象之间才存在属性、方法的继承/共享关系。

构造函数的 `prototype` 属性指向需要构造的对象，在构造完新实例之后，会将新实例的 `[[Prototype]]` 指向构造函数的 `prototype`。

并且在这里因为，Object 实现了 Function 的构造方法，但是 Function.prototype 继承了 Object.prototype，产生了一个鸡和蛋的问题。

这个问题只要先构造完 Function.prototype 再产生 Object 就能解释了。

接下来叙述一个对象是如何被建立的，但是在此之前需要作用域链的相关知识。

## 对象创建过程

对象的创建过程，即函数对象的 `[[Construct]]` 方法处理逻辑

1. 创建一个空对象 tObj 作为容器
2. 如果函数存在 `prototype` 即为构造函数，将 tObj 的 `[[Prototype]]` 指向目标对象，以表明继承关系，继承相关属性和方法。若非构造函数，则使用 Object.prototype 作为初始值
3. 将 tObj 作为 this，使用 args 参数调用函数的内部 `[[Call]]` 方法
	3.1 `[[Call]]` 方法创建 **执行环境/执行上下文**(Execution context) 这一临时对象
	3.2 调用函数体
	3.3 销毁当前的执行上下文
	3.4 返回函数体的返回值，如果函数体没有返回值则返回 `undefined`
4. 如果 `[[Call]]` 的返回值是 Object 类型，则返回这个值，否则返回 tObj

## 函数对象创建过程

1. 创建一个空对象 tFn 作为容器
2. 将 tFn 的 `[[Prototype]]` 设为 Function.prototype
3. 设置内部的 `[[Call]]` 属性，它是内部实现的一个方法，处理逻辑参考对象创建过程的步骤 3
4. 设置内部的 `[[Construct]]` 属性，它是内部实现的一个方法，处理逻辑参考对象创建过程的步骤 1,2,3,4
5. 设置 tFn.length 为 args.length，如果函数没有参数，则将 tFn.length 设置为 0
6. 使用 new Object() 同样的逻辑创建一个 Object 对象 fnProto
7. 将 fnProto.constructor 设为 tFn
8. 将 tFn.prototype 设为 fnProto
9. 返回 tFn

## **执行环境/执行上下文**(Execution context)

### 基本原理

进入函数时，JavaScript 引擎在内部创建一个对象，叫做 Variable Object。对应函数的每一个参数，在 Variable Object 上添加一个属性，属性的名字、值与参数的名字、值相同。函数中每声明一个变量，也会在 Variable Object 上添加一个属性，名字就是变量名，因此为变量赋值就是给 Variable Object 对应的属性赋值。在函数中访问参数或者局部变量时，就是在 Variable Object 上搜索相应的属性，返回其值。[^JavaScript-Object-Model-Execution-Model]

1. `[[Scope]]` (Variable Object)
	1.1. **this** tObj
	1.2. args
	1.3. **局部变量**/**具名函数**/**具名形参**
2. `[[Scope]]`作用域链
	2.1. 当前 `[[Scope]]`
	2.2. 上层 `[[Scope]]`

`Activation Object` 只在函数中，实现上和 `Variable Object` 一致，因为只是会在函数进入是创建，并在结束时标记可回收。

## 作用域链和预编译[^js_scope]

形如下代码段：

```js
var a=2, b=-2;
var foo = function foo (c){
    console.log("Before:", a, b);
    var b=-3;
    console.log("After:", a, b);
}
foo();
```
按照其他语言的经验应该输出：

```text
Before: 2 -2
After: 2 -3
```
但是 JS 存在预编译这一特性。会在进入函数时，先将变量抽出来，并赋值 `undefined`。所以在函数体内变量未被开发者定义也会覆盖上级作用域中的同名变量。

> TODO: 是否存在将变量定义在函数体头部规范？

所以正确的应该是

```text
Before: 2 undefined
After: 2 -3
```
在执行 `Before` 时，会创建 `[[scope]]` 如下所示：

![Snipaste_2018-03-26_18-30-57]($res/Snipaste_2018-03-26_18-30-57.png)

当执行到 `After` 时，`b` 已经被赋值

![Snipaste_2018-03-26_18-30-36]($res/Snipaste_2018-03-26_18-30-36.png)

## 闭包 **Closures**[^JavaScript-Object-Model-Execution-Model]

> 闭包是指有权访问另外一个函数作用域中的变量的函数

1. 闭包可以访问当前函数以外的变量[^closure]
2. 即使外部函数已经返回，闭包仍能访问外部函数定义的变量
3. 闭包可以更新外部变量的值

```js
function foo (){
    var a=1,b=2;
	return function(){ return a + b; };
}
```
foo 返回的是一个内嵌函数，内嵌函数使用了 foo 的局部变量 a 和 b。照理 foo 的局部变量在返回时就超出了作用域因此 foo() 调用无法使用才对。这就是闭包 Closure，即函数调用返回了一个内嵌函数，而内嵌函数引用了外部函数的局部变量、参数等这些应当被关闭(Close)了的资源。

根据前面 Scope Chain 的理解可以解释，返回的内嵌函数已经持有了构造它时的 Scope Chain，虽然 foo 返回导致这些对象超出了作用域、生存期范围，但 JavaScript 使用**自动垃圾回收来释放对象内存**: 按照规则定期检查，对象没有任何引用才被释放。因此上面的代码能够正确运行。

## `this`[^javascript-interview-questions-event-delegation]

* 默认指向全局对象，其通常是 window
* 若函数是一个对象的构造函数，this 指向新对象。
* 若函数被定义在一个对象上，然后调用对象时，this 指向该对象。
* 在异步编程中，this 可以很容易改变过程中一个功能操作。保持处理程序上下文的一个小技巧是将其设置到闭包内的一个变量(`$this` or `_this`)，当在上下文改变的地方调用一个函数时，如 setTimeout，你仍然可以通过该变量引用需要的对象。
* 一个函数中运行了一个内联函数，比如一个事件监听器，则this指向内联函数的源代码。例如，当设置一个按钮的单击处理程序，this将引用匿名函数内的按钮。

操作this的另一种方式是通过 call、apply 和 bind。三种方法都被用于调用一个函数，并能指定this的上下文，你可以让代码使用你规定的对象，而不是依靠浏览器去计算出this指向什么。Call、apply和bind本身是相当复杂的,应该有自己的文档记录，我们会把这当做未来待解决问题的一部分。下面是一个改变this指向方法的示

[^Objct]: [Objct](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
[^字面量]: [使用字面量创建变量对象都发生了什么？](https://blog.csdn.net/maomaolaoshi/article/details/77130970#t5)
[^MDN-prototype]: [继承与原型链 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
[^js_scope]: [JavaScript 作用域原理](http://www.laruence.com/2009/05/28/863.html "Permanent Link to Javascript作用域原理")
[^Inheritance_and_the_prototype_chain]: [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
[^JavaScript-Object-Model-Execution-Model]: [JavaScript对象模型-执行模型](http://www.cnblogs.com/RicCC/archive/2008/02/15/JavaScript-Object-Model-Execution-Model.html)
[^closure]: [从作用域链谈闭包](https://github.com/dwqs/blog/issues/18)
[^javascript-interview-questions-event-delegation]: [JavaScript面试问题：事件委托和this](https://github.com/dwqs/blog/issues/19)
