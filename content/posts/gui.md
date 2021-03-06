---
layout:     post
title:      "睁眼说瞎话 —— GUI"
date:       2019-02-08
author:     "Gitai"
---

还记得很多年前，用着 WFC 拖界面，简单粗暴但是勉强能用，在 XP 下看看也还行，因为调用 .Net 的接口，体积也就 200kb。（但是真的丑

学到了 GDI+，一发不可收拾，自然也就没接触过 WPF 了，到后面的 Windows 8， XML 写界面，但是我已经是 Linux 3年用户了。

<!-- more -->

在我还用 Windows 的时候，当时有个大佬写了个 SUI 界面引擎，现在已经因为当时硬盘损坏丢失了全部代码，看到第一眼就惊艳了。迅雷也整了个界面引擎 XUI，但是用起来总是感觉怪怪的，后来才知道这类叫做 DirectUI，通过继承控件，修改渲染方法，提供更好看的绘制方案。同类的有 SkinUI， Duilib，这类 DLL 为当时野蛮生长的家用机领域，提供了最为广泛的审美支持。

为了做外包项目，写过 QT 和 Java，都是巨大的依赖包，简直丧心病狂。

之后开始入了 HTML 写界面的大坑，最早是见过一个叫 HTMLLayout.dll 的库，短小精悍，虽然功能欠缺，但是还是很好用的。

> HTMLayout used its own lightweight HTML rendering engine that had:
> 
> * Fast HTML rendering with very short readiness times.
> HTML and CSS enhanced for screen layout tasks. %% units and expandable backgrounds allow to use more flexible and “screen oriented” layout schemas.
> * Custom behaviors API allow you to define how HTML elements will be drawn, react on keyboard and mouse events.
> * Low level interaction with the host application. No intermediate component technologies involved. Just pure API calls, like in any other native Windows common controls. HtmLayout uses WM_NOTIFY mechanism for interacting with the host window.
> * Small distribution size: HtmLayout.dll is about 600KB uncompressed.
> * No dependencies from installed browsers on client PC.
> [Terra Informatica Software - HTMLayout](https://terrainformatica.com/a-homepage-section/htmlayout/)

后来升级整了个 [Sciter](https://sciter.com/)，官方称之为 "Embeddable HTML/CSS/script engine
for modern UI development"，虽然这个是我 17 年听人推荐才知道的，因为中间那几年都去写 Android 去了。

写 Android 的时候还没有 Native & Web 这种区分，反正套个 Webview 是很常见的操作，以至于后面的 jQuery Mobile，Ionic，现在称之为 Hybrid 混合应用。然后又写了大半年 Node JS 的后端，也就顺便入了 Node-WebKit 写桌面端的坑，没过 2 年 Atom Shell 出现了，我还一直以为他们 2 有啥关系，到了改名 Electron，而 Atom 成为编辑器，才去碰它。中间还有段时间试了试网易有道的 heX，感觉是残了的一个产品。

Google 这些年一直在出系统，Chrome 也越来越强大，最近有了大一统界面引擎的趋势，carlo 蹦了出来，还记得前面最早的 MFC，那时候打包的程序小就是因为 .Net 框架集成在系统里面，也是如此没法 Windows 独占；所以才有了 Qt， GDK 各类界面引擎。这几年被前端捧着起来的就是 HTMLLayout 这类，carlo 这个项目的 README 下面有这一句话。

> Q: What is the minimum Chrome version that Carlo supports?
> Chrome Stable channel, versions 70.* are supported.

来看看 Chrome 的市场占有率

![](http://n.sinaimg.cn/translate/274/w688h386/20181104/Y83s-hmhswin3832446.jpg)

再看看 Windows 市场占有率

![](https://i.loli.net/2019/02/09/5c5e549036649.png)

emmm，首先 Chrome 是加了移动端的，其次 Windows 肯定都有 .Net，而 PC 不一定都有 Chrome。

所以还是观望一下未来，或许有那么一天，Chrome 成为 .Net 一样必备的界面解决方案。

（如果不被 Google 阉割的话，自然那是不可能的

不过现在这样在也是很方便了，毕竟一次开发，Google 帮你兼容。夹带点 Wasm 的私货不是美滋滋

反正前端越来越没边界，大前端趋势不可避。

## 小小的汇总

1. 2006，[HTMLayout & Sciter](https://terrainformatica.com/)，"UI and frontend software design and consulting since 1991." 
2. 2008，[Adobe AIR](https://zh.wikipedia.org/wiki/Adobe_AIR)
3. 2009，[Titanium Desktop](https://github.com/neam/TideSDK)
4. 2009，[Chromium Embedded Framework，CEF](https://en.wikipedia.org/wiki/Chromium_Embedded_Framework)
5. 2010，[onering-desktop](https://code.google.com/archive/p/onering-desktop)，豆瓣写的
6. 2011，[NW.js](https://github.com/nwjs/nw.js)
7. 2013，[heX](http://hex.youdao.com/)
8. 2013，[electron.js](https://electronjs.org/)
9. 2016，[miniblink49](https://github.com/weolar/miniblink49)，一个巨 tm 小的 CEF 兼容实现
10. 2018，[Ultralight](https://www.reddit.com/r/programming/comments/8biqo0/ultralight_lightweight_puregpu_html_renderer/)，reddit 上被吐槽，哈哈哈哈
11. 2019，[Webrender bindings](https://github.com/cztomsik/node-webrender)，NB

## 大目标

整个更有意思的跨平台界面解决方案