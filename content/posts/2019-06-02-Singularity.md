---
layout:     post
title:      "Singularity —— HTTP API 类型系统的设计"
date:       2019-06-02
author:     "Gitai"
tags:
  - API
  - 强类型
---

预示项目的起点，通过接口定义，完成前后端，测试的自动化。

一般的接口定义服务都要求语言无关，比如

* `RAML`[^RAML] RESTful API Modeling Language，是设计接口的一种方式，设计完成之后生成需要的代码片段。

*  `swagger`[^swagger] 通过复杂的规范和 `YAML`语法[^swagger_editor]，生成可操作的后端接口文档；或者定义约束，从后端代码中导出，一般都是这么干的。
* `Apiary Blueprint`[^apiary] 拓展了 `markdown` 的语法，可以产生很好看的接口文档，和测试工具。
* `Postman`[^postman] 没有配置，直接定义原始的 HTTP 请求，然后内置生成各种代码例子的方案。

大概因为接口定义没必要实现，参数检查，所以几个都只有基本的类型检查和是否必要。而除了 `Apiary Blueprint` 有个 mock，其他都没有直接的设计。虽然可以通过其他工具拓展，但是我就是想自己造轮子。

一般开发中，就是后端主导接口定义；开发完成之后，swagger 导出完事，之后前端对着开发，至于有没有接口测试那就不知道了。

实际上，这里因为接口产生的细化操作就至少产生的 3 次，后端初步定义，后端实现单元测试，前端实现接口调用，前端实现 mock。如果接口不稳定，就会产生及极大的联调成本。

而且这里还没有完善的接口检查工作，一堆 `if` 和 `else` 写的面条代码遍地跑。

**那为啥不整合上面几个阶段，从接口角度出发，推动后面的流程。**

最后希望能达到以下需求

* 复用 `swagger` 和 `JSON Schema` 的完整生态，生成 `RAML` 和 `JSON Schema`。
* 方便编辑又好看的文档，通过 markdown 语法和半自动的方式生成文档（`Apiary Blueprint` + `FaaS`）
* 接入对后端的接口测试，以及前端的 mock，还能生成必要的请求例子 （`Postman`）

## 预研

正如为了兼容 `JavaScript`，所以 `TypeScript` 是其超集一样，为了兼容生态，需要定义一个完全涵盖上述几个内容的新规则或者语言？或者通过拓展某个必要的基础设施来完成这些需求？

关键词：强类型，文档生成，元编程能力，存在的规范

于是产生下面这个标题

> 基于注释和注解等原生语法，实现的可以生成 HTTP 网关，自动化测试和可操作文档的 XX。

其实上面都是我编的，看到 `FunctionScript` 就已经决定用 `TypeScript` 实现 mock，然后在注释写入校验规则；通过注解生成网关；并导出文档这一整套操作。之后写上面那一堆废话只是为了佐证，我设计的必要性和可行性。

#### Mock 定义

在此写个最小可行性的例子来分析整个流程，如下是一个定义在 `functions` 的 `index.ts` 文件。

```ts
/**
 * 操作类型
 */
enum Action {
  // 登录活动
  Login,

  // 退出登录
  Logout
}

/**
 * Linux 环境下的用户名类型
 *
 * @maxLength 255
 * @pattern /^(?![.\-])[.\-_a-zA-Z0-9]+$/
 */
type LinuxUsername = string;

/**
 * Linux 环境下密码的校验
 *
 * @minLength 8
 * @maxLength 255
 * @pattern /\w+/
 */
type LinuxPassword = string;

/**
 * 假装定义了 Linux 环境登录需要的参数
 *
 * @param username - 用户名
 * @param password (可选) - 密码
 */
interface LinuxUserLogin {
  username: LinuxUsername;
  password?: LinuxPassword;
}

/**
 * 只是为了多弄几个数据类型，写的没什么用的例子
 *
 * @param action - 请求的行为
 * @param login - 登录传递的信息
 * @returns string
 */
export default function DemoFunction(
  action: Action,
  login: LinuxUserLogin = { username: "world" }
) {
  return `${login.username} ${action} ${login.password || "No password"}!`;
}

export { Action, LinuxUserLogin, LinuxUsername, LinuxPassword };

```

我们可以通过 FunctionScript 的规范，将其映射成 HTTP API，虽然我觉得他的接口定义有问题，尤其没有实现 `GET` 和 `POST` 的区分，所以可以加一个 `@POST` 的装饰器来处理。

之后上面的代码利用了 TypeScript 的强类型和注释，先通过别名将数据类型全局统一化，比如：`LinuxUsername`，`LinuxPassword`，`SfUsername` 这样的通用类型。定义如下

```ts
/**
 * Linux 环境下的用户名类型
 * @minLength 8
 * @maxLength 255
 * @pattern /\w+/
 */
type LinuxUsername = string;
```

上面就是整合 `JSON Schema` 创建的自定义类型，表示只能包含 `A-z`，`0-9` 和 `-` ，最小长度 5 位，最大 255 位的字符串。

再来看看下面的函数

```ts
/**
 * 只是为了多弄几个数据类型，写的没什么用的例子
 *
 * @param action - 请求的行为
 * @param login - 登录传递的信息
 * @returns string
 */
export default function DemoFunction(
  action: Action,
  login: LinuxUserLogin = { username: "world" }
) {
  return `${login.username} ${action} ${login.password || "No password"}!`;
}
```

这里我们暂时假设通过 FunctionScript 的规范进行映射，产生如下接口 `localhost/api/` 的 `GET` 或者 `POST` 请求，其通过 `Query` 或者 `application/x-www-form-urlencoded` 获取传递过来的 `action` 和 `login` 对象。

因为 ES6 本身有可选参数，比如这个 `login` ，和 `LinuxUserLogin` 下面的 `password`；而 `action` 和 `username` 都不必不可少的必填参数。

最后是输出，他们定义了一套 JavaScript 原生类型到 HTTP 响应的映射，实际大多数情况就是`JSON.stringify`。

还有他是通过定义了，一个特殊的标记来处理 header 等对 resp 的修改，这里也不太合适，应该借鉴 Koa 的接口模式比较好。

```js
function (ctx, next) {
    let { req, resp } = ctx;
}
```

这个还需之后讨论。

还有为了表达连续的流程，需要一个简单的数据库支持，虽然 FunctionScript 的规范写了，将函数的最后一个参数称之为 `context`，这和 Koa 的 `ctx` 不同，实际上是 `this` ，在这里可以直接赋值，数据会被定义到全局，虽然控制不好，可能被污染，但是控制的好，就非常方便，建议引入命名空间，持久化和数据驱动的钩子。

到这里都还是对 FunctionScript 的改进，和我们的实际工作流无关。

#### 兼容生态

接下来假装开发了通过 TypeScript 的 `AST` 生成 `JSON Schema` 的工具，那么我们会获得下面这个校验数据。

实际上这里也有问题，Query 和 Body Data 命名冲突怎么办； 如果统一成一个，那命名重复的怎么办？写入异常？

```json
{
	"type": "object",
	"properties": {
		"action": {
			"type": "string",
			"title": "操作类型",
            "items": ["Login", "Logout"]
		},
		"login": {
			"type": "object",
			"title": "假装定义了 Linux 环境登录需要的参数",
            "properties": {
                "username": {
                    "type": "string",
					"title": "Linux 环境下的用户名类型",
                    "maxLength": 255
                }，
                "password": {
                    "type": "string",
                    "title": "Linux 环境下密码的校验",
                    "minLength": 8,
                    "maxLength": 255,
                    "pattern": "/\w+/"
                }
            }
		}
	}
}
```

这样我们产生了一个非常 nb 的中间产物，因为 `JSON Schema` 可以干的就多了，比如 `QuickType`[^quicktype] 上面有很多例子，映射了 `JSON`，`TS`，`JSON Schema` 和 `Postman` 到各种语言的实现，而且我们也可以把 `JSON Schema` 转化成 `swagger`，来使用他的生态。虽然直接从 AST 生成的信息导出或许更完整。

#### 文档生成

这个从 AST 生成更优雅，但是从其产物 JSON Schema 生成可以暂时用着。不过后来发现 TypeDoc 解决了大半问题，因为它支持 markdown，但是生成的文档不适合作为 API 文档，需要定制一些东西，不如重写 XD，好在他有个 JSON 格式的导出。

#### 自动化测试

前端可以用上面这个 mock 测试，也可以通过生成的 `JSON Schema` 用其他平台测试，或者可以整合起来，把 mock 增加上更多新特性。

因为接口独立，即可以测试前端，也可以推进到后端，还可以通过上面的全局变量（对象数据库），设计按照场景的接口自动化测试。

因为接口能表达业务，也可以配合场景演示，再后端开发完成前，前端先去做市场检验。

### 总结

最重要的就是它解决了以下几个问题：

1. 测试用例编写麻烦，文档写起来重复太多，还难看
2. 前后端更完全的分离和自动化测试
3. 快速的试错和更低的修改成本

而只要开发一个对 TypeScript 的插件就能完成这些，开发成本极低。

不过为了好用，为这个 mock 实现的配套服务，数据库，持久化储存都是有很大意义的。

## MVP

### 技术基础

#### FaaS

这几年发展非常迅速的 `FaaS`，但是一般觉得网络资源损耗太高，无法微服务化所以运用场景可能受限，于是主要作为弹性计算，并且独立性极强的操作，或者 Geek 的玩物。

但是试用过 `FaaS` 就会发现它本身就是个天然的 mock，而且因为微服务的抽象，能直接通过对应的 Gateway 暴露出来，实现平行迁移。

我们先看看 FunctionScript 的例子，因为用的是 JavaScript，对于参数类型的定义几个基本类型和 `object`，这也是被人诟病的。

具体我们可以对照他的例子看看。

```js
// hello_world.js

/**
* @param {integer} id ID of the User
* @param {string} username Name of the user
* @param {number} age Age of the user
*/
module.exports = (name = 'world') => {

  return `hello ${name}`;

};
```

他的类型也被定义在注释里面，然后解析生成一个定义对象，在进行检查，这块应该和 TypeScript 的检查复用更为合适；虽然看了上面的结果，可能要写更多东西了 2333

此处参考 [Stdlib.com](https://code.stdlib.com/?sample=t&filename=functions/__main__.js) 和他们开源的 `FunctionScript`[^FunctionScript]，但是他们并没有实现 **定义强类型**，**文档生成**。

#### 预编译器

从 `PostCSS` 预编译 `CSS`，到 `TypeScript` 预编译 `JavaScript`，`babel` 之类的进行兼容性转化，实际上编写的和运行的是完全不同的语言，充分发挥了 `JavaScript` 灵活的特性。

因为此前提，我们能轻易的修改 `JavaScript` 或者 `TypeScript` 的前置编译环境，支持更多自定义的特性。

至于为什么会提到 `TypeScript`，因为强类型在接口定义是非常必要的，我觉得公司现行的 `mock` 在接口校验和可拓展性上存在很多可以优化的地方，但是相比优化不如另起一套。

这部分是为了解决，上面 `FunctionScript` 不支持校验的问题。可以通过注释来解决约束。



<!-- 

#### ObjectDB

这块可能会作为一个拓展点，为 FaaS 提供数据持久化的支持，暂时并不是非常重要。

相比 SQL 和 NoSQL 数据库，这类数据库可以实际映射对对象的操作，不考虑可靠性的前提之下，可以通过非常简单的操作完成数据的操作，并持久化。

此处参照 wilddog.com 的实时数据库。

-->



通过上面的说明，我们开始着手完成这个最小可行性产品，但是上面那个 `Hello World` 的例子，或许没那么好用了。

先分析需要实现的注释参数，参照 `swagger` 和 `JSON Schema`[^json_schema] 来进行，因为 `swagger` 用于设计接口，然后可以生成可视化的调试工具，而 `JSON Schema` 可以用于校验 JSON 的数据模式，虽然做接口校验有点迷惑，但是先这样写着。

在实际实现中，慢慢整理产生这个例子，实际上这个就是上面 【Mock 定义】 阶段的那个例子，毕竟我还没能力直接设计出完美的产品。为了避免重复，浪费流量，就不复制粘贴了。

引入 `typedoc`[^typedoc]，因为官方的 `@microsoft/tsdoc` 只是个核心实现，具体如何解析并不在这个库里面提供，但是官方推荐了几个库，比如 `typedoc`。

用起来也简单

```shell
# Install the global CLI
$ npm install --global typedoc

#Execute typedoc on your project
$ typedoc --out docs /functions
```

然后随便找个 HTTP server 浏览一下

```shell
$ caddy browse
```

![1559564494426.png](https://i.loli.net/2019/06/14/5d03ba6f5215e86541.png)

还挺好看的，拓展一下指不定就 Ok 了。

#### JSON Schema

`typedoc` 有个叫 `--json` 的配置，可以把分析出来的结果作为 JSON 导出，方便二次开发。

```json
{
    "id": 9,
    "name": "LinuxPassword",
    "kind": 4194304,
    "kindString": "Type alias",
    "flags": {},
    "comment": {
        "shortText": "Linux 环境下密码的校验",
        "tags": [
            {
                "tag": "minlength",
                "text": "8"
            },
            {
                "tag": "maxlength",
                "text": "255"
            },
            {
                "tag": "pattern",
                "text": "/\\w+/\n"
            }
        ]
    }
}
```

大概类似这样的内容，完美需要处理的就是里面的 `tags`，然后转化成 `JSON Schema`。但是因为这是对类型别名的定义，还要找到对应对象的内容。

```json
{
    "id": 7,
    "name": "password",
    "kind": 1024,
    "kindString": "Property",
    "type": {
        "type": "reference",
        "name": "LinuxPassword",
        "id": 9
    }
}
```

将上面的类型存到以 Hash 表，这里递归的时候处理一下。就可以生成 `JSON Schema` 了。

实际分析源码发现，这里有个唯一 ID，按说应该有个地方储存所有的 ID 映射关系，而且这个生成 JSON 到本地文件，直接用多了文件 IO 和序列化；发现其实 `docs` 和 `json` 都是对 `project` 的序列化，而 `app.convert` 才是实际生成源码树的方法。其返回的 `project` 和上面的 `json` 一致；但是通过引用将 `id` 所指向的对象挂载在当前对象上；所以只要直接读取就能获得函数熟悉相关的注释。

下面弄个例子

```ts
/**
 * 接口的状态值定义
 */
enum APIStatus {
  OK = 200
}

type ErrorMessage = string;

/**
 * 添加新节点
 * @url /sdp-api/serverNode/add
 */
function add(
  mnIp: IPAddress,
  dnIp: IPAddress,
  name: ServerName,
  hostName: HostName,
  userName: LinuxUsername,
  password: LinuxPassword
): {
  status: APIStatus;
} | {
  status: APIStatus;
  message: ErrorMessage;
} {
  return {
    status: APIStatus.OK
  };
}
```

最后生成的 `project` 子模块如下，而这里主要需要生成 2 个 JSON Schema 对象，分别是参数和返回值，因为函数是在开发时被操作的只有这 2 个部分。

而参数应该被合并为一个具名数组（arguments），即对象，而返回值本身就是一个复杂类型（比如：简单值，对象或者联合类型）。

下面红色圈出来的就是需要被操作的属性：

![1559814215280.png](https://i.loli.net/2019/06/14/5d03ba6f9a12c28865.png)

而且这个结果在对应的 `docs` 也是有损的，并没有普通对象的展开，或许可以给 `typedoc` 提个 PR，解决这个问题。

![1559814239754.png](https://i.loli.net/2019/06/14/5d03ba6f6ec8b61850.png)

虽然没有实现这个的库，实际上这个是最简单的。接下来的几个才是麻烦，无论是网关还是啥。

#### Gateway



#### 接口文档

至少实现成这样

![1559814970764.png](https://i.loli.net/2019/06/14/5d03ba6f70ea510217.png)

要是加上调试器，像 Postman 那样的更好。

## 重大转折

在开发完 Demo 之后，突然让我发现 [valory][^valory] 这个项目；顺藤摸瓜发现了 [tsoa][^tsoa]，让我们看看他的项目简介

> * TypeScript controllers and models as the single source of truth for your API
> * A valid swagger spec is generated from your controllers and models, including:
>   * Paths (e.g. GET /Users)
>   * Definitions based on **TypeScript interfaces (models)**
>   * Parameters/model **properties marked as required or optional** based on TypeScript (e.g. myProperty?: string is optional in the Swagger spec)
>   * **jsDoc supported** for object descriptions (most other metadata can be inferred from TypeScript types)
> * Routes are generated for middleware of choice
>   - Express, Hapi, and Koa currently supported, other middleware can be supported using a simple handlebars template
>   - **Validate request payloads**

上面划重点的几个关键词对比一下前面的描述！一模一样，但是人家都开发 3 年了，于是该项目搁浅的前半部分没必要开发。

直接用它来接入就好了，而且估计他性能还会比我的高不少；因为我的通过 `tsdoc` 编译了很多无关的数据出来，虽然只是为了快速实现，但是还是浪费了不少资源。



## 如何使用

### 定义模型/数据结构/数据约束

程序就是数据 + 算法，所以先得抽象必要的数据结构出来，定义合理的类型，便于复用和做接口测试。

```ts
// models/user.ts

export interface User {
    id: number;
    email: string;
    name: Name;
    status?: status;
    phoneNumbers: string[];
}

export type status = 'Happy' | 'Sad';

export interface Name {
    first: string;
    last?: string;
}

export interface UserCreationRequest {
    email: string;
    name: Name;
    phoneNumbers: string[];
}
```

### 定义控制器/API 接口/HTTP 请求模式

```ts
// controllers/usersController.ts

import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import {UserService} from '../services/userService';
import {User, UserCreationRequest} from '../models/user';

@Route('Users')
export class UsersController extends Controller {
    @Get('{id}')
    public async getUser(id: number, @Query() name: string): Promise<User> {
        return await new UserService().get(id);
    }

    @SuccessResponse('201', 'Created') // Custom success response
    @Post()
    public async createUser(@Body() requestBody: UserCreationRequest): Promise<void> {
        new UserService().create(request);
        this.setStatus(201); // set return status 201
        return Promise.resolve();
    }

    @Get('{id}')
    public async getPrivateUser(@Path('id') ID: number, @Header('Authorization') authorization: string): Promise<User> {
        return new UserService().get(id);
    }
}
```





[^swagger]: [The Best APIs are Built with Swagger Tools | Swagger](https://swagger.io/)
[^postman]: [Design APIs Directly in Postman](https://www.getpostman.com/)
[^apiary]: [Powerful API Design Stack. Built for Developers. ](https://apiary.io/)
[^raml]: [The simplest way to design APIs - RAML](https://raml.org/)
[^FunctionScript]: [FunctionScript](https://functionscript.org/)
[^swagger_editor]: [Swagger Editor](https://editor.swagger.io/)
[^json_schema]: [JSON Schema](https://json-schema.org/)
[^quicktype]: [QuickType - Instantly generate code from JSON.](https://app.quicktype.io/)
[^typedoc]: [TYPEDOC - A documentation generator for TypeScript projects.](https://typedoc.org/)
[^typescript-data-validation]:[Statically Typed Data Validation with JSON Schema and TypeScript](https://spin.atomicobject.com/2018/03/26/typescript-data-validation/)
[^python-api-type-sysytem]: [Python API 类型系统的设计与演变](https://www.ibm.com/developerworks/cn/web/wa-lo-python-api-type-sysytem-design-evolution/index.html)
[^valory]: [valory - A server agnostic web framework for creating bulletproof apis](https://github.com/valoryteam/valory)
[^tsoa]: [tsoa - Build swagger-compliant REST APIs using TypeScript and Node](https://github.com/lukeautry/tsoa)