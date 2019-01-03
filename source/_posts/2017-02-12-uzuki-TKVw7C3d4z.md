---

layout:     post
title:      "简单的数据抓取和处理"
date:       2017-02-12
author:     "Gitai"
categories:
    - 爬虫
    - Uzuki
tags:
    - 记录

---

>这也是个外包，￥1000，用于建立机器学习语料库。

<!-- http://tool.c7sky.com/password/ -->

日常写垃圾代码 +1 \_(:з」∠)_ 

发现一个爬小故事的需求，于是随后 Google 出一个站 [Short Stories for Children](https://americanliterature.com/short-stories-for-children)

很好，读出来是静态站，网页结构也比较简单。

爬虫爬起，好像需求 1k 个就够了。

那也没必要上那些吓人的瑞士军刀。

找找第三方的爬虫服务：

* import.io
* 神箭手
* 造数

文档略麻烦，估摸着不如自己写。

<!--more-->

找几个分类,加一起够 1k 了

* Short Stories for Children
* Aesop's Fables
* Christmas Stories for Kids
* Grimm's Fairy-Tales
* Just So Stories
* Children's Poems

```js
let hrefs= $("a").map((k,item) => item.href);
let childrensRegex = /https:\/\/americanliterature\.com\/childrens-stories\/(\w+|-)+/;
let authorRegex = /https:\/\/americanliterature\.com\/author\/(\w+|-)+\/short-story\/(\w+|-)+/;
hrefs = hrefs.filter((index,item) => childrensRegex.test(item) || authorRegex.test(item));
localStorage.hrefs += hrefs.toArray().join("\n");
```

全存在 `localStorage` 里，任务队列 Get

```txt
https://americanliterature.com/author/aesop/short-story/the-ants-and-the-grasshopper
https://americanliterature.com/author/aesop/short-story/the-tortoise-and-the-hare
https://americanliterature.com/author/aesop/short-story/the-fox-and-the-lion
https://americanliterature.com/author/aesop/short-story/the-lion-and-the-mouse
https://americanliterature.com/author/aesop/short-story/the-tortoise-and-the-ducks
https://americanliterature.com/author/aesop/short-story/the-wolf-and-the-kid
https://americanliterature.com/author/aesop/short-story/the-frogs-and-the-ox
https://americanliterature.com/author/aesop/short-story/the-young-crab-and-his-mother
...
```

估计没用和重复的不少，用正则检查， `Set` 来唯一化

```bash
＄ node al_filter.js > urls_filtered
```

```js
let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('urls')
});

let childrensRegex = /https:\/\/americanliterature\.com\/childrens-stories\/(\w+|-)+/;
let authorRegex = /https:\/\/americanliterature\.com\/author\/(\w+|-)+\/short-story\/(\w+|-)+/;

var set = new Set();
lineReader.on('line', (line) => if(childrensRegex.test(line) || authorRegex.test(line)) set.add(line));
lineReader.on('close', (line) => set.forEach(v => console.log(v)));
```

然后开始写请求，`Xpath` 是个好东西

- Title:    `/html/body/div[1]/div[2]/h1/cite`
- Author:   `/html/body/div[1]/div[2]/h3/a`
- Body:     `/html/body/div[1]/div[2]/p[3]`...`/html/body/div[1]/div[2]/p[n]`

自己写，光请求就要一会，之后爬还容易被 ban。

这时候，祭出 import.io ，戳几个规则，丢一堆 url，10min后全部完成。

https://gist.github.com/GitaiQAQ/c586c50e08035a6d58b69cc8a89c0dc5

没用(?) 的字段比较多，结构也不太好用。

写个脚本格式化一下。

```js
function extent(obj1, obj2){
	for(k in obj2){
		if(obj2[k] instanceof Object) continue;
		if(obj1[k] == undefined) obj1[k] = obj2[k];
		else if(typeof obj1[k] == 'string'){
			if(k == 'title') continue;
			obj1[k] = [obj1[k], obj2[k]]
		}else if(obj1[k] instanceof Array){
			obj1[k].push(obj2[k])
		}else{
			console.error("Error", obj1[k]);
		}
	}
}

function parse(extractorData){
	var result ={words:1};
	extent(result, extractorData);
	if(!extractorData.data){
		return;
	}
	if(!extractorData.data[0]){
		return ;
	}
	for(v of extractorData.data[0].group){
		for(k in v){ 
				v[k] = v[k][0].text;
		}
		extent(result, v);
	}
	if(typeof(result.content) != "string"){ 
		if(!result.content) return; 
		result.contents = result.content;
		result.content = result.content.join("\n");
	}
	for(v of result.content){
		if(v == ' ')
			result.words+=1;
	}
	return result;
}

var json = [];

function format(filename, cb){
	var lineReader = require('readline').createInterface({
	  input: require('fs').createReadStream(filename)
	});
	lineReader.on('line', (line) => {
		var r=parse(JSON.parse(line).result.extractorData);
		if(r) json.push(r);
	});
	lineReader.on('close', () => if(cb)cb());
}
```

调用：

```js
format('523d4b7b-91af-4d66-ab49-f8e15ed9840f.json', () =>
	format('e726ad6f-7c09-4502-a2bb-d828a7db96d2.json', () => 
		format('54709014-b012-4168-9fa2-4c1075b63d51.json', () => 
			console.log(JSON.stringify(json, null, 4))
		)
	)
)
```

完美！

```json
[
    {
        "words": 5381,
        "url": "https://americanliterature.com/author/o-henry/short-story/next-to-reading-matter",
        "resourceId": "1998a23f2315ef7abc5ab53c69eaaf22",
        "title": "Next to Reading Matter",
        "author": "O. Henry",
        "content": "He compelled my interest as he stepped from the ferry at Desbrosses S...",
        "contents": [
            "He compelled my interest as he stepped from the ferry at Desbrosses Street...",
            "He wore loose clothes of a strange bluish drab colour, and a conservative...",
            "Judson Tate accosted me with some large and casual inquiries about the city...",
        ]
    },
    {
        "words": 3604,
        "url": "https://americanliterature.com/author/o-henry/short-story/no-story",
        "resourceId": "b2f81e678da8527b480079a2d4fc3f6f",
        "title": "No Story",
        "author": "O. Henry",
        "content": "To avoid having this book hurled into corner of the room by the...",
        "contents": [
            "To avoid having this book hurled into corner of the room by the suspicious...",
            "But if you will concede me the setting of the first scene in the reporters...",
            "I was doing space-work on the Beacon, hoping to be put on a salary. Some...",
        ]
    }
]
```
统计：

```bash
$ cat results.json | jq "length"
> 964
```
大部分正文都超过 2k 词

筛选一下:

```bash
$ cat results.json | jq ".[] | select(.words < 2000) " > filtered.json
$ cat filtered.json | jq "length"
> 425
```

只剩下一半了 \_(:з」∠)_ 
