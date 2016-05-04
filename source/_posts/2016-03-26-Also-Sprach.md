---

layout:     post
title:      "Also Sprach"
date:       2016-03-26 18:15:36
author:     "Gitai"
tags:
    - Api
    - Android
    - REST
    - 记录

---

> Share our collection of inspirational and famous quotes by authors you know and love. @BrainyQuote

* Version: `0.2.4`
* Total: `415405`
    * zh-CN: `175706`
    * en: `239699`

[Quote REST Api](http://api.gitai.me/quote)

<!--more-->

<script type="text/javascript">
function quote(data) {
    if (data.status != 1) {return console.error(data);}data = data.data?data.data:null;if (!data || !data.title) {return}
    var span = "<span class=''";
    var title = "title='";
    if (data.source) {title += "出自：" + data.source + "&#10;"}
    if (data.up || data.down) {title += "Up/Down：" + data.up + "/" + data.down + "&#10;"}
    if (data.author) {title += "作者：" + data.author + "&#10;"}
    if (data.topics && data.topics.length > 0) {title += "标签：" + data.topics.join(",") + "&#10;"}
    if (title.length > "title='".length) {span += title + "'>"}
    span += "<a href='http://quote.gitai.me/" + data.objectId + "' target='_blank'>" + ((data.lang=="en")?"「" + data.title + "」":"『" + data.title + "』") + "</a>";
    span += "<a href='http://api.gitai.me/quote/" + data.objectId + "/up' target='_blank'>+</a>/<a href='http://api.gitai.me/quote/" + data.objectId + "/down' target='_blank'>-</a>"
    if (data.author) {span += "&#10;<span style=\"display: block;text-align: right;\"> —— " + data.author + "</span>"}
    span += "</span>"
    return span;
}
</script>

<blockquote id="quote"><script type="text/javascript" src="http://api.gitai.me/quote/rand?jsonp=document.write(quote(%s))"></script></blockquote>

## Quickstart

### 1.预设解析方法

```html
<script type="text/javascript">
function quote(data) {
	if (data.status != 1) {return console.error(data);}data = data.data?data.data:null;if (!data || !data.title) {return}
	var span = "<span class=''";
	var title = "title='";
	if (data.source) {title += "出自：" + data.source + "&#10;"}
	if (data.up || data.down) {title += "Up/Down：" + data.up + "/" + data.down + "&#10;"}
	if (data.author) {title += "作者：" + data.author + "&#10;"}
	if (data.topics && data.topics.length > 0) {title += "标签：" + data.topics.join(",") + "&#10;"}
	if (title.length > "title='".length) {span += title + "'>"}
	span += "<a href='http://quote.gitai.me/" + data.objectId + "' target='_blank'>" + ((data.lang=="en")?"「" + data.title + "」":"『" + data.title + "』") + "</a>";
	span += "<a href='http://api.gitai.me/quote/" + data.objectId + "/up' target='_blank'>+</a>/<a href='http://api.gitai.me/quote/" + data.objectId + "/down' target='_blank'>-</a>"
	if (data.author) {span += "&#10;<span style=\"display: block;text-align: right;\"> —— " + data.author + "</span>"}
	span += "</span>"
	return span;
}
</script>
```

### 2. 将下面这段代码放入页面内需要展示一句话的位置即可

```html
<blockquote id="quote"><script type="text/javascript" src="http://api.gitai.me/quote/rand?jsonp=document.write(quote(%s))"></script></blockquote>
```

