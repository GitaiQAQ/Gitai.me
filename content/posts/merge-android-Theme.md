---
title: 聚合 Android 主题 
date: 2016-06-22
categories:
    - Android
tags:
    - 记录
---

通过最近 3 篇文章
* [应用打包流程](http://gitai.me/2016/06/20/android-application-build-or-compilation-process/)
* [Android 主题引擎][Android-Theme-Engine]
* [Zip 结构分析](http://gitai.me/2016/06/21/Zip-struct-analytics/)
来对现有的 Icon Pack 进行适应性修改

Icon Pack 类型参见 [Android 主题引擎][Android-Theme-Engine]

主要以 CyanogenMod 的 Assets 和 Nova 的 res 文件夹为主

本文就建立在类似的结构，和匹配模式的基础上撰写

## APK 结构特点 & AssetManager的检测漏洞

`Zip` 因为历史悠久，缺少许多特性，对于重复文件就无相关优化，`bzip2` 的 `--repetitive-best` 参数可以针对重复文件，优化体积

[Local file header + Compressed data [+ Extended local header]?]*
[Central directory]*
[End of central directory record]

在 [ZipFileRO][ZipFileRO] 的相关代码中并没有对 Local file header 和 Central directory 区块的路径进行如Python 的 [zipfile][zipfile] 的校验

``` python
if fname != zinfo.orig_filename:
    raise BadZipfile, 'File name in directory "%s" and header "%s" differ.' % (
zinfo.orig_filename, fname)
```
Local file header 和 Central directory 的分离
Central directory 是 Zip 结构的目录索引，无校验就可以通过修改 Relative offset of local header 和 Compressed size 来修改偏移达成重定向

在此我们随手分析

![](/img/2016-06-23-150136.png)
![](/img/zip-format.png)

可以通过增加 Central directory 来定义新路径
并修改 End of central directory record 区块的 Total number of entries in the central dir on this disk，Total number of entries in the central dir 和 Size of the central directory
来增加新路径

![](/img/2016-06-23-160223.png)
![](/img/2016-06-23-161455.png)

## Refs
[Android-Theme-Engine]: http://gitai.me/2016/06/21/Android-Theme-Engine/
[ZipFileRO]: https://android.googlesource.com/platform/frameworks/native/+/jb-dev/libs/utils/ZipFileRO.cpp
[zipfile]: https://hg.python.org/cpython/file/2.7/Lib/zipfile.py#l977
