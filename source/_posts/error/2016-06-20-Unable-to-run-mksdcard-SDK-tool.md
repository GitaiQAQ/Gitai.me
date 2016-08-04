---
title: Unable to run mksdcard SDK tool
date: 2016-06-20
categories:
    - Android
tags:
    - Error
    - 记录
---

## Error:Unable to run mksdcard SDK tool in debian

You need some 32-bit binaries, and you have a 64-bit OS version (apparently). Try:


For Ubuntu 14.10
```
$ sudo apt-get install lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6
```

For UBUNTU 15.04,15.10 & 16.04 LTS & Debian 8
```
$ sudo apt-get install lib32stdc++6
```

For Cent OS/RHEL
```
$ sudo yum install zlib.i686 ncurses-libs.i686 bzip2-libs.i686 
```

<!--more-->

## Refs

1. [Error:Unable to run mksdcard SDK tool in ubuntu](https://stackoverflow.com/questions/29241640/errorunable-to-run-mksdcard-sdk-tool-in-ubuntu)