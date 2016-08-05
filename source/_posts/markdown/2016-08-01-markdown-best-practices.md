---
title: Markdown 最佳实践
date: 2016-08-03
categories:
    - Markdown
tags:
    - Markdown
    - 记录
---

在[前一篇文章](http://gitai.me/2016/08/02/markdown-syntax/)中，整理了现有的最完整的 Markdown 标准及衍生语法，而为了完成 `pulldown-cmark` 的拓展，需要以合适的流程来处理这些标记，以防止各种标记的冲突引发的排版错误。本文档中除标准语法被支持外，拓展和应用语法均为自用。

<!-- more -->

`pulldown-cmark` 已经完成的 `CommonMark`[^1] 的支持，以及 `TF` 参数载入表格和页脚，但是对于可实用的解析器还有很多问题需要解决。

在此将 Markdown 语法分为以下三部分：

* 标准： 以 CommonMark[^1] 所提供的若干种基础语法为核心
* 拓展： 其他让文档更富表现力的语法
* 封装： 应用级的封装

## 标准

#### Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

或者

```
Heading 1
=========

Heading 2
———
```

Heading 1
=========

Heading 2
———

---

#### Text

```
*italic*  _Italic_

**bold**  __Bold__

***bold-italic***

~~Strike-throughs~~

==Highlights==

x^{y_z}
```


*Italic*  _Italic_

**Bold**  __Bold__

***Bold-italic***

~~Strike-throughs~~

==Highlights==

x^{y_z}

---

```
[link](http://example.com)

[Link][1]
[1]: http://example.com
```

[Link](http://example.com)

[Link][1]
[1]: http://example.com

---

```
:Emoji:
```

:smile:

---

```
**The quick brown [fox][1], jumped over the lazy [dog][2].**

[1]: https://en.wikipedia.org/wiki/Fox "Wikipedia: Fox"
[2]: https://en.wikipedia.org/wiki/Dog "Wikipedia: Dog"
```

**The quick brown [fox][1], jumped over the lazy [dog][2].**

[1]: https://en.wikipedia.org/wiki/Fox "Wikipedia: Fox"
[2]: https://en.wikipedia.org/wiki/Dog "Wikipedia: Dog"

---

```
The quick brown fox[^1] jumped over the lazy dog[^2].

[^1]: Foxes are red
[^2]: Dogs are usually not red

```

The quick brown fox[^fox] jumped over the lazy dog[^fox].

[^fox]: Foxes are red
[^fox]: Dogs are usually not red

---

#### Images

```
![m'lady](http://i.imgur.com/v8IVDka.jpg)

![Image][1]
[1]: http://i.imgur.com/v8IVDka.jpg
```

![markdown](http://commonmark.org/help/images/favicon.png)

![markdown][markdown]
[markdown]: http://commonmark.org/help/images/favicon.png

---

#### Block

##### Lists

```
* Milk
* Bread
    * Wholegrain
* Butter
```

* Milk
* Bread
    * Wholegrain
* Butter

---

```
- Milk
- Bread
    - Wholegrain
- Butter
```

- Milk
- Bread
    - Wholegrain
- Butter

---

```
1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things
```

1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things

---

```
1) Tidy the kitchen
2) Prepare ingredients
3) Cook delicious things
```

1) Tidy the kitchen
2) Prepare ingredients
3) Cook delicious things

---

##### Definition Lists

```
Apple
:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange
:   The fruit of an evergreen tree of the genus Citrus.
```

Apple
:   Pomaceous fruit of plants of the genus Malus in 
    the family Rosaceae.

Orange
:   The fruit of an evergreen tree of the genus Citrus.

---

##### Table

```
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

```
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |


---

##### Quotes

```
> To be or not to be, that is the question.
```

> To be or not to be, that is the question.

---

##### Code Snippets & Syntax Highlighting

```
\```css
.my-link {
        text-decoration: underline;
}
\```
```

```css
.my-link {
        text-decoration: underline;
}
```

#### Abbreviations

```
The HTML specification
is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
```

The HTML specification
is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium

#### Escaping

```
\*literally\*
```

\*literally\*

#### Embedding HTML

```
<button class="button-save large">Big Fat Button</button>
```

<button class="large">Big Button</button>

#### Horizontal Rules

```
* * *
```
* * *

```
***
```
***

```
*****
```
*****

```
- - -
```
- - -

```
-----------
```
-----------


## 拓展

### Id & Class & Attribute

```
{#header1 .main lang=fr}
```

没什么用，删去

### File

```
![](./includes/head.jade)
```

伴随后缀解析成 `<audio>`, `<video>`, `<map>`, `<img>` 等对象

### Include

```
!include ./includes/head.jade
```

### 内容块

*没找到合适标记*


## 封装

### Front-matter

```
---
：yaml
---
```

### UML序列图和流程图

```flow
st=>start: Start
op=>operation: Your Operation
cond=>condition: Yes or No?
e=>end

st->op->cond
cond(yes)->e
cond(no)->op
```

```sequence
Alice->Bob: Hello Bob, how are you?
Note right of Bob: Bob thinks
Bob-->Alice: I am good thanks!
```

### 目录

```
[TOC]
```

### LaTex数学公式

```
$\sum_{i=0}^n \frac{1}{i^2}$

$\prod_{i=0}^n \frac{1}{i^2}$

$\int_0^1 x^2 {\rm d}x$

$\lim_{n \rightarrow +\infty} \frac{1}{n(n+1)}$

$$  x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$
```

### Gist & Youtube & Vimeo & jsfiddle

```
+gist gist_id [filename]

+youtube video_id

+vimeo video_id

+jsfiddle shorttag [tabs] [skin] [width] [height] 
```

+gist gist_id [filename]

+youtube video_id

+vimeo video_id

+jsfiddle shorttag [tabs] [skin] [width] [height] 

## Ref

[^1]: http://commonmark.org/ "CommonMark"
[^2]: https://segmentfault.com/a/1190000000601562 "Markdown的各种扩展"
[^3]: https://hexo.io/ "Hexo"
[^4]: https://blog.ghost.org/markdown/ "How to Write Faster, Better & Longer: The Ultimate Guide to Markdown"
[^5]: http://os.51cto.com/art/201608/515451.htm "Linux 上 10 个最好的 Markdown 编辑器"
[^6]: http://blog.csdn.net/lanxuezaipiao/article/details/44341645 "CSDN-markdown语法之如何使用LaTeX语法编写数学公式"
[^7]: http://blog.csdn.net/whqet/article/details/44281463 "CSDN Markdown简明教程4-UML图"
[^8]: https://code.csdn.net/snippets/1559160/master/%E5%8E%9F%E5%A7%8BMarkDown%E6%A0%87%E8%AE%B0/raw "原始MarkDown标记"
