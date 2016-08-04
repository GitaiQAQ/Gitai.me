---
title: 用 Rust 编写一个 OS
date: 2016-07-28
source: http://os.phil-opp.com/
categories:
    - OS
tags:
    - 记录
    - 翻译
    - Rust
---

这个系列将采用 [Rust]语言创建一个微型操作系统。

每一篇文章是一个小的教程和所需要的全部代码，所以如果你愿意，你能够跟着做。

源代码也同样存在相应的 [Github 仓库][blog_os]中。

最近的一篇文章： [异常捕获][Catching Exceptions]

<!-- more -->

## Bare Bones

### 最小的 x86 内核

本文章将说明如何创建一个最小的 x86 操作系统内核。事实上，它将只能引导并且打印 `OK` 到屏幕。接下来的文章将用 [Rust] 来拓展它。

### 进入长模式

我们创建一个最小的多重引导的内核。它只是打印 `OK`并且挂起。 这次的目标是采用64位 Rust 代码来拓展它。但是 CPU 当前处于保护模式。并且只允许32位指令，以及支持最大4Gib内存。所以我们需要首先设定内存分页和切换到64位长模式。

### 设定 Rust

在之前的文章中，我们创建了一个最小的多重引导的内阁和并且切换到了长模式。
现在我们能结束并转换到 Rust 代码。 Rust是一种拥有运行时系统的高级语言。它允许我们不链接标准库，来编写裸代码。但是，不幸的是设定并不是非常简单。

### 打印到屏幕

在前一篇文章中，我们从汇编切换到一个提供了极大安全的操作系统语言 Rust。但是至今每当我们需要打印到屏幕时，都使用不安全的特性像[原始指针][raw pointers]。在本文章中，我们将创建一个为 VGA 文本缓冲器提供安全易用接口的 Rust 模块。它将支持 Rust 宏。

## 内存管理

### 分配框架

In this post we create an allocator that provides free physical frames for a future paging module. To get the required information about available and used memory we use the Multiboot information structure. Additionally, we improve the panic handler to print the corresponding message and source line.

### 页表

我们将创建一个分页模块，允许用户访问和修改4级页表，我们将探索递归页表绘制并且使用一些 Rust 特性来使其安全。最后我们创建一个函数来转换虚拟地址和映射页。

### 重新映射内核

我们将创建一个新页表来正确的映射内核部分。为此我们将拓展分页模块来支持


[raw pointers]: https://doc.rust-lang.org/book/raw-pointers.html

[Rust]: https://www.rust-lang.org/
[blog_os]: https://github.com/phil-opp/blog_os
[Catching Exceptions]: ./src/catching-exceptions
