---

layout:     post
title:      "使用「Protobuf」"
date:       2016-02-08 09:26:36
author:     "Gitai"
categories:
    - Protobuf
tags:
    - Protobuf
    - Python

---

## 安装

[protobuf@google](https://github.com/google/protobuf)

### 依赖

* autoconf
* automake
* libtool
* curl (used to download gmock)

<!--more-->

``` shell
$ sudo apt-get install autoconf automake libtool curl
```

### 编译

修改下载源 `protobuf/autogen.sh`

``` shell
wget http://pkgs.fedoraproject.org/repo/pkgs/gmock/gmock-1.7.0.zip/073b984d8798ea1594f5e44d85b20d66/gmock-1.7.0.zip
```

``` shell
$ ./autogen.sh
$ ./configure
$ make
$ make check
$ sudo make install
$ sudo ldconfig # refresh shared library cache.
```

## 使用(Python 样例)

### 安装 `Python` 依赖

``` shell
$ sudo python python/setup.py install
```

### 编写 & 编译 `.proto` 文件

``` proto
syntax = "proto3"; // 在第一行非空白非注释行，必须写
package me.gitai.novel; // 包名

message Book{
	int32 id = 1;
	string title = 2;
	string subtitle = 3;
	string author = 4;
	string press = 5;
	string intro = 6;
	message Volume{
		int32 id = 1;
		string title = 2;
		string subtitle = 3;
		message Chapter{
			int32 id = 1;
			string title = 2;
			string subtitle = 3;
			message Content{
				enum Type {
					TEXT = 0;
					IMG = 1;
				}
				Type type = 1;
				bytes content = 2;
			}
			repeated Content content = 4;
		}
		repeated Chapter chaps = 4;
	}
	repeated Volume vols = 7;
}
```

``` shell
protoc --java_out=$DST_DIR $SRC_DIR/novel.proto
```

生成的文件是 `novel_pb2.py`

### 使用

``` python
#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import novel_pb2

# Create Proto
protoBook = novel_pb2.Book()
protoBook.id = int(book["bookid"])
protoBook.title = book["title"]
protoBook.subtitle = book["subtitle"]
protoBook.author = book["author"]
protoBook.press = book["press"]
protoBook.intro = book["introduction"]

protoVol = protoBook.vols.add()
protoVol.id = int(volume["volumeid"])
protoVol.title = volume["title"]
protoVol.subtitle = volume["subtitle"]

for chapter in chapters:
	protoChap = protoVol.chaps.add()
	protoChap.id = chapter["chapterid"]
	protoChap.title = chapter["title"]
	protoChap.subtitle = chapter["subtitle"]
	contents = json.loads(zf.read("data/" + str(protoChap.id) + ".json"))
	for content in contents:
		ctt = protoChap.ctts.add()
		if content["T"] != 0:
			ctt.type = content["T"]
		if content["T"] == 0:
			ctt.data = bytes(content["C"].encode("utf-8"))
		elif content["T"] == 1:
			ctt.data = zf.read("image/" + content["C"] )
		pass
	pass
zfile = gzip.open(zipname+'.gz', 'wb')
zfile.write(protoBook.SerializeToString())
zfile.close()
```