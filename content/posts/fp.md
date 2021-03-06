---

  layout:     post
  title:      "如何计算首屏加载时间"
  date:       2018-04-12
  author:     "Gitai"
  categories:
      - 前端
---

统计页面加载的各项时间点是前端优化上非常重要的一项，W3C 和各厂商也为此开放了很多有用的接口。

## API 及描述其功能

| API | 名称 | 功能 |
|:-------------------------------|:--------------------------|:--------------------------|
| Navigation Timing | 导航计时 | 能够帮助网站开发者检测真实用户数据（RUM），例如带宽、延迟或主页的整体页面加载时间。 |
| Resource Timing | 资源计时 | 对单个资源的计时，可以对细粒度的用户体验进行检测。 |
| High Resolution Timing | 高精度计时 | 该API规范所定义的JavaScript接口能够提供精确到微秒级的当前时间，并且不会受到系统时钟偏差或调整的影响。 |
| Performance Timeline | 性能时间线 | 以一个统一的接口获取由Navigation Timing、Resourcing Timing和User Timing所收集的性能数据。 |

<!-- more -->

##  Paint Timing

最新的 [PerformancePaintTiming][^PerformancePaintTiming] API 可以很优雅的解决这个问题。

但是还只是实验性特性，截至 18-04-11 除了 Chrome 基本都[不支持](https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming#Browser_compatibility)。

```js
function firstPaintTime() { 
	if (window.performance) { 
		const fpEntry = performance.getEntriesByType('paint')[0]; 
		return fpEntry.startTime; 
	}
}
// 670.9000000009837
```
代码结尾的加载时间实例均为在 Chrome v65.0.3325.181 上对于 https://www.google.com/ 的测试结果


## Chrome 私有方法

### `loadTimes`

> 该接口已经被废弃，但是为了兼容旧版本，一般需要同时使用
> chrome.loadTimes() is deprecated, instead use standardized API: Paint Timing. https://www.chromestatus.com/features/5637885046816768.

包含如下属性：

* requestTime	请求时间
* startLoadTime	开始加载时间（底层和上面一样，都是 NavigationStart）
* commitLoadTime [响应开始时间](https://chromium.googlesource.com/chromium/src.git/+/lkcr/chrome/renderer/loadtimes_extension_bindings.cc#159)
* firstPaintTime 首次渲染时间
* ~~firstPaintAfterLoadTime~~
* finishDocumentLoadTime 文档树加载结束事件触发时间（DomContentLoadedEventEnd）
* finishLoadTime 页面加载完成事件触发时间（LoadEventEnd）

下面几个和时间就无关了

* connectionInfo 连接协议（http/1.1, h2, quic/1+spdy/3）
* navigationType 打开类型（Reload/Other）
* npnNegotiatedProtocol ALPN 协议
* wasAlternateProtocolAvailable
* wasFetchedViaSpdy 是否通过 spdy 协议传输
* wasNpnNegotiated 

```js
function firstPaintTime() { 
	if (window.chrome) { 
		var loadTimes =  window.chrome.loadTimes();
		fpTime =  loadTimes.firstPaintTime  -  loadTimes.startLoadTime;
		if (fpTime >  3600) {
			console.log("chrome.loadTimes() reported impossible values", loadTimes);
			return;
		}
		return fpTime * 1000;
	}
}
// 671.0000038146973
```
结果和 Paint Timing 基本一致

### `csi`

* onloadT[ _DOMContentLoaded_ 事件触发的时间戳](https://chromium.googlesource.com/chromium/src.git/+/lkcr/chrome/renderer/loadtimes_extension_bindings.cc#372)
* pageT 页面打开时间（`csi` 对象生成时间 - `NavigationStart` 获取的间隔）
* startE 浏览开始的时间戳（`NavigationStart`）
* tran 打开类型（同 navigationType，Reload/Other）

```js
function pageLoadTime() { 
	if (window.chrome) { 
		var csi =  window.chrome.csi();
		return csi.onloadT -  csi.startE;
	}
}
// 712
```
这 onloadT 实际上对应的 loadTimes.finishDocumentLoadTime，既页面完成加载时的时间戳

```js
console.log(loadTimes.finishDocumentLoadTime  -  loadTimes.startLoadTime);
// 0.7119998931884766
```
实际上这 2 个对象均是使用同一组数据生成。[loadtimes_extension_bindings.cc](https://chromium.googlesource.com/chromium/src.git/+/lkcr/chrome/renderer/loadtimes_extension_bindings.cc)

## Performance Timing/Navigation Timing API

`window.performance.timing` 属性用于监控 windows 行为获得的是一个时间戳对象。并且具有良好的[兼容性](https://caniuse.com/#feat=nav-timing)。

可以使用下述代码将其打印出来。

```js
for(var i in performance.timing){
	console.log(i, performance.timing[i] && performance.timing[i] - performance.timing.navigationStart, "ms")
}
```
相关的接口可以参照下图，详细的文字描述参见 [^performance_api]

![timing overview](https://www.w3.org/TR/navigation-timing/timing-overview.png)

### 普适的方法

前述的 Chrome 私有接口也基本是对于该接口的封装。

```js
function domLoadedTime() { 
	if (window.performance && window.performance.timing) { 
		var oTiming =  window.performance.timing;
		return oTiming.domContentLoadedEventStart -  oTiming.navigationStart;
	}
}
// 703
```
### 某应用检测服务

国内的一个应用检测服务商的这段是用最长资源加载时间来统计的，摘录如下

```js
function firstPaintTime() { 
	if (performance && performance.timing) { 
		var timing = [];
		timing.push(performance.timing.domLoading - performance.timing.navigationStart);
		var getEntriesTiming = function(entries) {
			var entries = performance.getEntriesByName(entries);
			return entries.length && entries [0].responseEnd;
		}
		document.querySelectorAll("head>link,head>script")
			.forEach(r => 
				"LINK" == r.tagName ? 
					r.href && timing.push(getEntriesTiming(r.href)): 
					"SCRIPT" != r.tagName || r.defer || r.async || (r.src && timing.push(getEntriesTiming(r.src))));
		return Math.max(...timing);
	}
}
// firstPaintTime： 42
```
emmmm, 无言以对。。。不知道哪出了问题。。。反正这个结果比较感人。。。

[完整源码](https://gist.github.com/GitaiQAQ/118ab631a6f98ae26637db5e1b060e52#file-tingyun-js-L521-L535)

### 巨硬的私有接口

仅仅通过该接口只能获取绘制完成既 DOM 完成加载时的时间间隔。因为 W3C 标准中并没有在该对象提供首屏绘制的时间戳，而是在前文所述的 PerformancePaintTiming 之中，对此在 Chrome 可以使用 PerformancePaintTiming 接口，而微软则在 IE(>9)/Edge 提供了一个私有属性 `msFirstPaint`

```js
function firstPaintTimeInMS() { 
	if (window.performance && window.performance.timing && window.performance.timing.msFirstPaint) { 
		var oTiming =  window.performance.timing;
		return oTiming.msFirstPaint -  oTiming.navigationStart;
	}
}
firstPaintTimeInMS()
// firstPaintTimeInMS: 760
// domLoadedTime: 751
```
（估计缓存机制差异，IE 这几个时间点浮动贼大，甚至出现过 7000ms，但是并没成功复现

## 精确好用的方案(RAF)

浏览器用于定时循环操作的一个接口，主要用途是按帧对网页进行重绘。只要捕捉到第一次绘制。。。

嗯，就是首屏加载时间。

首先处理兼容性问题。。。和 CSS 一样一堆前缀，重定向到标准接口上。

```javascript
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
```

然后在 head 定义一下

```
requestAnimationFrame(function(){
	var firstPaintTime = Date.now() - performance.timing.navigationStart;    
	console.log(firstPaintTime);
});
// 698
```
非常精确。。。

## ~~历史悠久但是最不可靠的方案~~

上面的几个 demo 以及可以获取 IE9, Edge, Chrome （TODO: loadTimes 开始的版本）

以下内容将接着广为流传的【在浏览器地址栏输入一个URL后回车，背后会进行哪些技术步骤？】来叙述。

![1_FjnCt0TCWaxY91E0WQq2DQ.png](https://i.loli.net/2018/04/22/5adc49ffb5e71.png)

以下只会阐述 **Rendering** 阶段

```html
<!DOCTYPE HTML>
<html>
<head>
	<link rel="stylesheet" href="style.css" type="text/css"/>
	<script src="script.js"/>
</head>
<body>
	...
</body>
</html>
```
下图为 **Chrome DevTools** - **Performance** - **Event Log** 下的记录

![Event Log](https://i.loli.net/2018/04/22/5adc49fcb9cf5.png)

1. **开始**解析 HTML
2. 请求 *head* 定义的 CSS/JS 文件
3. 解析 CSS 文件，构建 CSSDOM， 阻塞其他流程
4. 执行 JS
5. **继续**解析 HTML
6. 文件末尾资源文件加载
7. 定义延迟加载的文件开始加载
8. AJAX 请求

至于为什么 CSS 建议放在 `head` 上，而 JS 应该放在文档流结尾，请参见其他前端优化的文章。


对于不支持新接口的浏览器，就需要使用不是那么精确的方法来进行监控了。通过之前对于渲染部分的分析，不难发现，首屏渲染是在渲染树构建完，而渲染树依赖 CSSOM。所以可以在第 1/4/6/7/8 这几个阶段执行脚本，获取需要的时间戳，虽然存在 JS 执行损耗，但是基本已经可以用了。实例如下[^build-performance-monitor-in-7-days]

这方法当没有好了。。。误差挺大的。。。不写了。。。

## 数据上报

### sendBeacon

参见： http://csbun.github.io/blog/2014/12/send-beacon/

不想写了。。。日后补充

[^how-web-applications-work]: [How web applications work](https://medium.com/@bfortuner/how-web-applications-work-4424c6fb175a)
[^zhihu-zhuanlan]: [浏览器的渲染：过程与原理](https://zhuanlan.zhihu.com/p/29418126)
[^PerformancePaintTiming]: [Performance Paint Timing](https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming）
[^build-performance-monitor-in-7-days]: [7 天打造前端性能监控系统](http://fex.baidu.com/blog/2014/05/build-performance-monitor-in-7-days/)
[^ga-record-chrome.loadtimes]: [ga-record-chrome.loadtimes.js](https://gist.github.com/acdha/a1fd7e91f8cd5c1f6916)
[^performance_api]: [使用性能API快速分析web前端性能](https://segmentfault.com/a/1190000004010453)
