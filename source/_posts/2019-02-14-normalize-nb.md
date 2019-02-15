---
layout:     post
title:      "normalize.css NB"
date:       2019-02-14
author:     "Gitai"
tags:
	- CSS
---

我不像群里面的老哥，诗词段子张口就来，夸个小姐姐用这样的

> 翩若惊鸿，婉若游龙。荣曜秋菊，华茂春松。仿佛兮若轻云之蔽月，飘飘兮若流风之回雪。远而望之，皎若太阳升朝霞；迫而察之，灼若芙蕖出渌波。浓纤得衷，修短合度。肩若削成，腰如约素。延颈秀项，皓质呈露。芳泽无加，铅华弗御。云髻峨峨，修眉联娟。丹唇外朗，皓齿内鲜。明眸善睐，靥辅承权。瑰姿艳逸，仪静体闲。柔情绰态，媚于语言。奇服旷世，骨像应图。披罗衣之璀粲兮，珥瑶碧之华琚。戴金翠之首饰，缀明珠以耀躯。践远游之文履，曳雾绡之轻裾。微幽兰之芳蔼兮，步踟蹰于山隅。于是忽焉纵体，以遨以嬉。左倚采旄，右荫桂旗。壤皓腕于神浒兮，采湍濑之玄芝。《洛神赋》

就会张口一句 NB；不过这都不重要，速成兼容性，来看看 `normalize.css`。

<!-- more -->

不过人家注释写的那么清楚，加注释换行才 349 行，实在没啥好写的。相比 `reset.css` 的全部清空， `normalize.css` 就写的很细致合理，不过可能自己还得加点 `reset` 的操作，才能用。

先整个检测 CSS 的简短脚本

```javascript
function showStyle(selector, prop) {
    var main = document.querySelector(selector);
    main.innerHTML = window.getComputedStyle(main).getPropertyValue(prop)
}
```

然后统计一下关键词：

- IE: 15
- Edge: 7
- Chrome: 8
- Opera: 2
- Firefox: 9
- Safari: 10
- IOS: 3

夹带私货最多的就是 IE，最少的反而是 Opera。

```css
/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}
```

Old versions of WebKit-based desktop browsers (Chrome<27, Safari<6) suffer from a bug where if -webkit-text-size-adjust is explicitly set to none, instead of ignoring the property, the browsers will prevent the user from zooming in or out on the webpage.[^text-size-adjust](https://caniuse.com/#search=-webkit-text-size-adjust)

```css
/**
 * Render the `main` element consistently in IE.
 */

main {
  display: block;
}
```

> Partial support refers to missing the default styling, as technically the elements are considered "unknown". This is easily taken care of by manually setting the default display value for each tag.[^main](https://caniuse.com/#feat=html5semantic)

复现成功，IE 11 还是这样的，`display` 为 `inline`，之前的自然也是。[demo](https://codepen.io/gitaiqaq/full/YBOGeJ)

```css
/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}
```

原来火狐的 hr `box-sizing` 有点不一样；IE 的 `overflow` 也有点不一样。
复现成功，但是 IE 11 和 Chrome 的 `overflow` 都是 `visible`?[demo](https://codepen.io/gitaiqaq/full/YBOGeJ)

```css
/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}
```

很不幸我在 IE 11 上面模拟 IE 10，然后并没有出现灰色；在[browserling](https://www.browserling.com/browse/win/7/ie/10/https%3A%2F%2Fcodepen.io%2Fgitaiqaq%2Ffull%2FYBOGeJ) 上面测试，也没出现灰色？？下面的边框也是？IE 9&8 也没出现，奇怪的问题。

```css
/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}
```

IE 这个 overflow 已经出现第二次了。

不看了。。。下面基本都差不多，直接来总结一下。

`-*-appearance` 模拟 Button ，以平台本地的样式显示元素。

`text-transform` 部分浏览器的文本变换行为，会被继承。

火狐下的 Button 在触及焦点时会增加样式，我觉得这是为了无障碍友好，但是一般用不上就被重写了。

而且主要有异常行为的都是内建的元素，也就是日常使用最丑的那些。
