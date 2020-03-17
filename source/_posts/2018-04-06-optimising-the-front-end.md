---

  layout:     post
  title:      "前端优化策略"
  date:       2018-04-6
  author:     "Gitai"
  categories:
      - 前端
---

> 原文： [前端性能优化常用总结](https://juejin.im/post/59e1bbc9f265da430f311fb1)

![progressive-rendering](https://i.loli.net/2018/04/18/5ad7117710889.png)

多数优化技巧并不是为了迅速提升产品本身性能，而是为了提升用户体验，如 MD 设计中对按钮的处理，只是为了给予用户一个有效的反馈。[^critical-rendering-path]


<!-- more -->

## 网络优化

下述内容，多半可在 HTTP2.0 得到解决

* 减少 HTTP 请求数（并发请求数限制）
	* 资源打包
	* 雪碧图（**CSS Sprites**）
	* 内联图片（**Base64编码**）

*  减少 DNS 查找
	* 域名收敛
	* 缩短解析路径

* 减小资源体积
	* gzip 压缩
	* js 混淆
	* css/图片压缩（_Media Queries_，Query 参数，差异分发，WebP 大势所趋）

* 延迟加载
	* 按需加载
	* 滚动加载
	* 图片惰性加载

* 预加载
	* 首屏加载

* 跨域分离组件
	* 采用 CDN
	* 通过减少 Cookies 降低请求头体积

* 缓存
	* HTTP 缓存（延长缓存时间）
	* DNS 缓存
		* 参上[减少 DNS 查找 - 域名收敛]
		* 使用公用 CDN 仓库
		* 直接使用 IP
	* CDN 加速分发

* 避免重定向和 404

* 不滥用 WEB 字体
	* SVG 了解一下

* 首屏优化（数据小于 14kb）
	* 使用 Loading
	* 占位区块

## 渲染优化

* 样式表放在顶部，JS 文件放在尾部或者异步
* 避免使用滤镜
	* 使用 Query 参数在 CDN 以至服务端预处理

### CSS

* 使用预编译器和 autoprefixed 等插件
	* 在 CSS 属性为 0 时，去掉单位
	* CSS 前缀的使用
	* 移除空的 CSS 规则

* 减少css表达式的使用
* 使用 CSS 动画，采用浏览器内部优化和 GPU 硬件加速（translateZ hack）
* 复杂动画 canvas 和 Wasm 了解一下


避免浏览器，回流和重绘

* 避免变更样式，只修改 class
* 复杂的UI元素，设置 position 为 absolute 或 fixed
	* 脱离文档流
* 频繁的 DOM 操作
	* 虚拟 DOM 了解一下

### JS

* 长列表滚动优化（没看过，不知道）
	* 防抖和节流
* 移动端使用 Zepto 替换 jQuery（无论是体积上还是模式上都更适合）
* 预编译语言（Typescript 了解一下）
* 事件委托（冒泡事件）
* 降低复杂计算，_Web Worker_了解一下

### 其他

* 保证所有组件都小于 25K
* 配置 ETags
* 数据埋点和统计



## 总结

本文只是对原文的概括，列个列表并补充一点点关键词，细节还要自行 Google。

其中很多内容可以参见相关领域的商业服务文档，比如使用 Query 参数处理图片和视频可以参见七牛或者又拍的说明。

高性能 CSS 就可以参照其他的开源动画组件，而长列表滚动优化 Twitter 和微博这类服务就很早通过 pjax 和滚动加载解决这类问题，也很早就布局数据驱动和虚拟 DOM 之类的技术。

而整体上的优化，国内大厂基本都有 UED 相关部门，对应的资料也是非常多。

不过脱离本地提供一些拓展，纯粹的浏览器端，能做的已经非常少了。


[^critical-rendering-path]: [关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
