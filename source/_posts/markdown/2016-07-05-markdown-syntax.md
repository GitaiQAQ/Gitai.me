---
title: Markdown 标准及其衍生版本
date: 2016-08-02
categories:
    - Markdown
tags:
    - Markdown
    - 记录
---

## [CommonMark](http://commonmark.org/)

<!--table class="markdown-reference">
    <thead>
        <tr>
            <th>Type</th>
            <th class="second-example">Or</th>
            <th>… to Get</th>
        </tr>
    </thead>
    <tbody>
        <tr>                        
            <td class="preformatted">*Italic*</td>
            <td class="preformatted second-example">_Italic_</td>
            <td><em>Italic</em></td>
        </tr>
        <tr>                        
            <td class="preformatted">**Bold**</td>
            <td class="preformatted second-example">__Bold__</td>
            <td><strong>Bold</strong></td>
        </tr>
        <tr>
            <td class="preformatted">
                # Heading 1
            </td>
            <td class="preformatted second-example">
                Heading 1<br>
                =========
            </td>
            <td>
                <h1 class="smaller-h1">Heading 1</h1>
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                ## Heading 2
            </td>
            <td class="preformatted second-example">
                Heading 2<br>
                ---------
            </td>
            <td>
                <h2 class="smaller-h2">Heading 2</h2>
            </td>
        </tr>
        <tr>                        
            <td class="preformatted">
                [Link](http://a.com)
            </td>
            <td class="preformatted second-example">
                [Link][1]<br>
                ⋮<br>
                [1]: http://b.org
            </td>
            <td><a href="http://commonmark.org/">Link</a></td>
        </tr>
        <tr>
            <td class="preformatted">
                ![Image](http://url/a.png)
            </td>
            <td class="preformatted second-example">
                ![Image][1]<br>
                ⋮<br>
                [1]: http://url/b.jpg
            </td>
            <td>
                <img src="http://commonmark.org/help/images/favicon.png" width="36" height="36" alt="Markdown">
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                &gt; Blockquote
            </td>
            <td class="preformatted second-example">
                &nbsp;
            </td>
            <td>
                <blockquote>Blockquote</blockquote>
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                A paragraph.<br>
                <br>
                A paragraph after 1 blank line.</td>
            <td class="preformatted second-example">
                &nbsp;                       
            </td>
            <td>
                <p>A paragraph.</p>
                <p>A paragraph after 1 blank line.</p>
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                <p>
                    * List<br>
                    * List<br>
                    * List
                </p>
            </td>
            <td class="preformatted second-example">
                <p>
                    - List<br>
                    - List<br>
                    - List<br>
                </p>
            </td>
            <td>
                <ul>
                    <li>List</li>
                    <li>List</li>
                    <li>List</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                <p>
                    1. One<br>
                    2. Two<br>
                    3. Three
                </p>
            </td>
            <td class="preformatted second-example">
                <p>
                    1) One<br>
                    2) Two<br>
                    3) Three
                </p>
            </td>
            <td>
                <ol>
                    <li>One</li>
                    <li>Two</li>
                    <li>Three</li>
                </ol>
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                Horizontal Rule<br>
                <br>
                ---
            </td>
            <td class="preformatted second-example">
                Horizontal Rule<br>
                <br>
                ***
            </td>
            <td>
                Horizontal Rule
                <hr class="custom-hr">
            </td>
        </tr>
        <tr>                        
            <td class="preformatted">
                `Inline code` with backticks
                </td>
            <td class="preformatted second-example">
                &nbsp;
            </td>
            <td>
                <code class="preformatted">Inline code</code> with backticks
            </td>
        </tr>
        <tr>
            <td class="preformatted">
                ```<br>
                # code block<br>
                print '3 backticks or'<br> 
                print 'indent 4 spaces'<br>                            
                ```
            </td>
            <td class="preformatted second-example">
                <span class="spaces">····</span># code block<br> 
                <span class="spaces">····</span>print '3 backticks or'<br>
                <span class="spaces">····</span>print 'indent 4 spaces'
            </td>
            <td>
                <div class="code-block">
                    # code block
                    <br> print '3 backticks or'
                    <br> print 'indent 4 spaces'
                </div>
            </td>
        </tr>                    
    </tbody>
</table-->

## [GitHub Flavored Markdown](https://help.github.com/articles/basic-writing-and-formatting-syntax/)

<!--table class="markdown-reference">
    <thead>
        <tr>
            <th>Type</th>
            <th class="second-example">Or</th>
            <th>… to Get</th>
        </tr>
    </thead>
    <tbody>
        <tr>                        
            <td class="preformatted">~~Strikethrough~~</td>
            <td class="preformatted second-example"></td>
            <td><del>Strikethrough</del></td>
        </tr>
        <tr>
            <td class="preformatted">
                <p>
                    - [ ] foo<br>
                    - [x] foo
                </p>
            </td>
            <td class="preformatted second-example">
            </td>
            <td>
                <ul class="task-list">
                    <li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled="disabled"> foo
                    </li>
                    <li class="task-list-item">
                        <input type="checkbox" class="task-list-item-checkbox" checked="checked" disabled="disabled"> foo
                    </li>
                </ul>
            </td>
        </tr>
        <tr>                        
            <td class="preformatted">:EmojiCode:</td>
            <td class="preformatted second-example"></td>
            <td>😊</td>
        </tr>
        <tr>                        
            <td class="preformatted">\*Ignoring Markdown formatting\*</td>
            <td class="preformatted second-example"></td>
            <td>*Ignoring Markdown formatting*</td>
        </tr>
        <tr>
            <td class="preformatted">
                ```python<br>
                s = "Python syntax highlighting"<br>
                print s<br>
                ```
            </td>
            <td class="preformatted second-example"></td>
            <td>
                <div class="code-block">
                    <pre class="python">
                    s = "Python syntax highlighting"
                    print s
                    </pre>
                </div>
            </td>
        </tr>       
        <tr>
            <td class="preformatted">
                Colons can be used to align columns.<br>
                                                                                <br>
                | Tables        | Are           | Cool  |<br>
                | ------------- |:-------------:| -----:|<br>
                | col 3 is      | right-aligned |  |<br>
                | col 2 is      | centered      |    |<br>
                | zebra stripes | are neat      |     |<br>
            </td>
            <td class="preformatted second-example">
                Markdown | Less | Pretty<br>
                --- | --- | ---<br>
                *Still* | `renders` | **nicely**<br>
                1 | 2 | 3<br>
            </td>
            <td>
                <table>
                    <thead>
                        <tr>
                            <th>Tables</th>
                            <th align="center">Are</th>
                            <th align="right">Cool</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>col 3 is</td>
                            <td align="center">right-aligned</td>
                            <td align="right"></td>
                        </tr>
                        <tr>
                            <td>col 2 is</td>
                            <td align="center">centered</td>
                            <td align="right"></td>
                        </tr>
                        <tr>
                            <td>zebra stripes</td>
                            <td align="center">are neat</td>
                            <td align="right"></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>    
    </tbody>
</table-->

## [PHP Markdown Extra](https://michelf.ca/projects/php-markdown/extra/)

* 支持在html块元素中插入markdown语法
* 支持为一些元素添加id或class，比如为header添加id属性，用带锚点的链接导航。例如：

```markdown
[Link back to header 1](#header1)

Header 1            {#header1}
========

## Header 2 ##      {#header2}
```

支持元素包括`header`、`code block`、`link`、`image`

* 支持将代码块用`或者~包起来，这样可以避免一些二义，还可以为代码块添加id或class

```
~~~~~~~~~~~~~~~~~~~~~~~~~~~~ {.html #example-1}
<p>paragraph <b>emphasis</b>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

* 支持手写的表格：

```
| Function name | Description                    |
| ------------- | ------------------------------ |
| `help()`      | Display the help window.       |
| `destroy()`   | **Destroy your computer!**     |
```

* 支持`dl`和`dt`在markdown中的对应语法
* 支持脚注引用

```
That's some text with a footnote.[^1]

[^1]: And that's the footnote.
```

* 支持专有名词`abbr`
* 避免下划线出现在单词中间，导致斜体输出

## [Maruku](https://github.com/bhollis/maruku/blob/master/docs/markdown_syntax.md)

* 支持原生Markdown
* 支持所有PHP Markdown Extra的特性
* 支持新的元数据语法，实际上就是给元素添加属性的能力
* 支持[公式格式](https://github.com/bhollis/maruku/blob/master/docs/math.md)输出

## [kramdown](http://kramdown.gettalong.org/quickref.html)

* 改进了一些二义语法
* 引入EOB标记 `^` 作为块元素的分隔符
* 手写table的语法更加强大一些，支持table中的header和footer
* 同样支持ALD(Attribute List Definitions属性列表定义)
* 还支持注释，以及在转化时配置一些转化选项

## [RDiscount](http://dafoster.net/projects/rdiscount/)

* 文本居中，即输出`<center>``
* 图片大小定义`![dust mite](http://dust.mite =150x150)``
* 输出`alpha`列表：<`ol type='a'></ol>``

## [Redcarpet](https://github.com/vmg/redcarpet)

* 单词中间的`_`不处理
* 转化PHP-Markdown风格的手写表格
* 转化PHP-Markdown风格的带包含的代码块，也可禁用标准markdown的代码块语法
* 自动link生成
* 删除线支持：`~~good~~`
* 高亮标签`<mark></mark>`通过`==highlighted==`输出
* 引用标签`<q></q>`通过`"quote"`输出
* 转化PHP-Markdown风格脚注
* 一些二义性的约束支持

## [CSDN-markdown](http://blog.csdn.net/csdnproduct/article/details/43561659)

* UML序列图和流程图
* [TOC] 自动生成目录

## [Pandoc’s Markdown](https://link.zhihu.com/?target=http%3A//pages.tzengyuxio.me/pandoc/)

* 上下標

## [Jekyll](https://jekyllrb.com/docs/frontmatter/)

* Front-matter

## [Hexo](https://hexo.io/zh-cn/docs/tag-plugins.html/)

* Block Quote
* Pull Quote
* jsFiddle
* Gist
* iframe
* Image
* Link
* Include Code
* Youtube
* Vimeo
* 引用文章
* 引用资源
* Raw

## Ref

[^1]: http://commonmark.org/ "CommonMark"
[^2]: https://segmentfault.com/a/1190000000601562 "Markdown的各种扩展"
[^3]: https://hexo.io/ "Hexo"
