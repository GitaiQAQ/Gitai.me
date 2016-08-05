---
title: Pulldown-cmark 分析
date: 2016-07-31
categories:
    - Rust
tags:
    - Rust
    - Markdown
    - Parsing
    - Pull
    - XML
    - 记录
---

## Pulldown-cmark

这是一个对于 CommonMark 的 Pull 解析器，使用 Rust 编写。配带一个简单的终端工具，来渲染 HTML。

设计原则：

* 快速; 最小的分配和复制
* 安全; Rust，且未使用 `unsafe` 块
* Versatile;in particular source-maps are supported
* 准确; 以 100% 遵守 CommonMark 为目标

<!--more-->

## Pull 解析

XML 文档常用的解析器，基于事件驱动的 Pull 解析器与SAX解析器，基于文档结构的DOM。

Pull 解析类似与 SAX，但更加简单。相对于 DOM，具有低内存消耗等优点。

此 markdown 解析器就采用类似的原理实现。


## 使用

```rust
extern crate pulldown_cmark;

use pulldown_cmark::Parser;
use pulldown_cmark::{Options, OPTION_ENABLE_TABLES, OPTION_ENABLE_FOOTNOTES};
use pulldown_cmark::html;
```

```
// Wrapper around the pulldown-cmark parser and renderer to render markdown
pub fn render(text: &str) -> String {
    let mut s = String::with_capacity(text.len() * 3 / 2);

    let mut opts = Options::empty();
    opts.insert(OPTION_ENABLE_TABLES);
    opts.insert(OPTION_ENABLE_FOOTNOTES);
    let p = Parser::new_ext(&text, opts);
    html::push_html(&mut s, p);
    return s;
}
```

从 Demo 的调用来看 `RawParser::new` 初始化解析器。用 `while` 迭代，调用  `Event` 的 `is_some` 来匹配，维持循环。




