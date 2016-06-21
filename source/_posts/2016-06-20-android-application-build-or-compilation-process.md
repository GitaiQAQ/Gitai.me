---
title: Android 打包流程
date: 2016-06-20 07:04:34
categories:
    - Android
tags:
    - 记录
    - Build
    - Compilation
    - Process
---

这篇文章是解释Android程序如何被编译和执行的概述。

因为 Android 应用程序的执行过程包括像 DEX，APK，dx tool，aapt tool和javac等各种术语.所以我会先尝试各种工具并参与编译和构建一个 Android 应用程序。

![android-application-build-process-diagram](/img/android-application-build-process-diagram.png)


* `.java`: Java 文件拓展名
* `.class`: Java 文件编译后，一种8位字节的二进制流文件， 各个数据项按顺序紧密的从前向后排列， 相邻的项之间没有间隙， 这样可以使得class文件非常紧凑， 体积轻巧， 可以被JVM快速的加载至内存， 并且占据较少的内存空间。
* `DEX`: Dalvik EXecutable file. 所有的.class文件内容整合到一个.dex文件
* `JVM`: Java Virtual Machine. 基于虚拟栈的虚拟机
* `DVM`: Dalvik Virtual Machine. 基于寄存器的虚拟机
* `AIDL`: Android Interface Definition Language
* `apk`: Android Application Package file. 
* `aidl`: converts all AIDL files into .java files. 
* `dx`: convert all .class files into a single DEX file.
* `apkbuilder`
* `zipalign`

<!--more-->

JVM 与 DVM 区别

1. dvm执行的是.dex格式文件  jvm执行的是.class文件   Android程序编译完之后生产.class文件，然后，dex工具会把.class文件处理成.dex文件，然后把资源文件和.dex文件等打包成.apk文件。apk就是android package的意思。 jvm执行的是.class文件。
2. dvm是基于寄存器的虚拟机  而jvm执行是基于虚拟栈的虚拟机。寄存器存取速度比栈快的多，dvm可以根据硬件实现最大的优化，比较适合移动设备。
3. .class文件存在很多的冗余信息，dex工具会去除冗余信息，并把所有的.class文件整合到.dex文件中。减少了I/O操作，提高了类的查找速度

DVM有如下特征：
1. 使用专有的.dex格式。 
2. java类文件在编译过后，会产生至少一个.class文件包含大量陈余信息，dex文件格式会把所有的.class文件内容整合到一个.dex文件中。即减少了整体文件的尺寸和IO操作，也提高了类的查找速度。 
3. 增加了对新的操作码的支持 
4. 文件结构尽量简洁，使用等长的指令，借以提高解析速度。 
5. 尽量扩大只读结构的大小，借以提高跨进程的数据共享。 
6. dex的优化，dex文件的结构是紧凑的，但是如果想提高运行时的性能，就需要对dex文件进行进一步的优化，这些优化针对以下几个方面：
    1. 验证dex文件中的所有类 
    2. 对一些特定的类和方法里面的操作码进行优化 
    3. 调整所有的字节序(Little_endian)和对齐结构中的每一个域 
    4. 基于寄存器，基于寄存器的虚拟机虽然比基于堆栈的虚拟机在硬件，通用性上要差一些，但是它的代码执行效率去更好 
    5. 每一个Android应用都运行在它自己的DVM实例中，每一个DVM实例都是一个独立的进程空间。所有的Android应用的线程都对应一个Linux线程，DVM因此可以更多地依赖操作系统的线程调度和管理机制。不同的应用在不同的进程空间里运行，不同的应用都是用不同的Linux用户来运行以最大程度地保户应用程序的安全性和独立性 

## 手动编译

```
$ tree
.
├── AndroidManifest.xml
├── java
│   └── me
│       └── gitai
│           └── hosts
│               ├── Constant.java
│               └── HostsApp.java
└── res
    ├── drawable-hdpi
    │   ├── ic_add_white.png
    │   └── ic_search_white.png
    ├── drawable-mdpi
    │   ├── ic_add_white.png
    │   └── ic_search_white.png
    ├── layout
    │   ├── activity_main.xml
    ├── menu
    │   └── main.xml
    ├── mipmap-hdpi
    │   └── ic_launcher.png
    ├── mipmap-mdpi
    │   └── ic_launcher.png
    ├── mipmap-xhdpi
    │   └── ic_launcher.png
    ├── mipmap-xxhdpi
    │   └── ic_launcher.png
    ├── values
    │   ├── colors.xml
    │   ├── dimens.xml
    │   ├── strings.xml
    │   └── styles.xml
    └── values-large
         └── dimens.xml

```

### 生成R.java

```
$ mkdir -p ./gen/<packageName>
$ aapt package -f -m -J ./gen -S res -M AndroidManifest.xml -I '/Sdk/platforms/android-24/android.jar'
```

* `-f`: 如果编译生成的文件已经存在，强制覆盖。
* `-m`: 使生成的包的目录存放在-J参数指定的目录
* `-J`: 指定生成的R.java 的输出目录路径
* `-S`: 指定res文件夹的路径precedence.
* `-A`: 指定assert文件夹的路径
* `-M`: AndroidManifest.xml 路径
* `-I`: 指定某个版本平台的 android.jar 文件的路径

### 把.aidl转成.java文件

```
$ aidl
INPUT required
usage: aidl OPTIONS INPUT [OUTPUT]
       aidl --preprocess OUTPUT INPUT...

OPTIONS:
   -I <DIR>    search path for import statements.
   -d <FILE>   generate dependency file.
   -a         generate dependency file next to the output file with the name based on the input file.
   -p <FILE>   file created by --preprocess to import.
   -o <FOLDER> base output folder for generated files.
   -b         fail when trying to compile a parcelable.

INPUT:
   An aidl interface file.

OUTPUT:
   The generated interface files.
   If omitted and the -o option is not used, the input filename is used, with the .aidl extension changed to a .java extension.
   If the -o option is used, the generated files will be placed in the base output folder, under their package folder
```

### 编译.java类文件

```
$ mkdir bin
$ javac -encoding UTF-8 -target 1.8 -bootclasspath '/Sdk/platforms/android-24/android.jar' -d ./bin src/<packageName>/*.java ./gen/<packageName>/R.java 
```

* `-target <版本>`                             生成特定 VM 版本的类文件
* `-bootclasspath <路径>`          覆盖引导类文件的位置
* `-d <目录>`                                          指定存放生成的类文件的位置
*  `-sourcepath <路径>`                  指定查找输入源文件的位置

### class文件生成dex文件

```
$ dx --dex --output=./bin/classes.dex  ./bin/classes
```

### 打包资源

```
$ aapt package -f -M AndroidManifest.xml -S res -A assets -I '/Sdk/platforms/android-24/android.jar' -F ./bin/<packageName>
```

* `-f` 如果编译生成的文件已经存在，强制覆盖
* `-M` 指定 AndroidManifest.xml 的路径
* `-S` 指定 res 文件夹路径
* `-I` 指定某个版本平台的 android.jar 的路径
* `-F` 指定输出文件完整路径

### 生成未签名的apk

```
$ apkbuilder  ./bin/<packageName>.apk -u -z  ./bin/<packageName> -f  ./bin/classes.dex  -rf  ./src  -rj  ./libs 
```

在SDK 22之后 apkbuilder 被新构建工具取代

```
$ java -classpath sdklib.jar com.android.sdklib.build.ApkBuilderMain 
```

* `-v`   Verbose 显示过程信息
* `-u`   创建一个无签名的包
* `-z`   指定apk资源路径
* `-f`   指定dex文件路径
* `-rf` 指定源码路径
* `-rj` libs路径

### 创建密匙

```
$ keytool -genkey -alias release -keyalg RSA -validity 20000 -keystore <keyStore>  
```

* `-genkey`         在用户主目录中创建一个默认文件".keystore"
* `-alias`            产生别名
* `-keyalg`         指定密钥的算法 
* `-validity`    指定创建的证书有效期多少天
* `-keystore`    指定密钥库的名称(产生的各类信息将不在.keystore文件中)

### 签名apk

```
$ jarsigner  -verbose -keystore <keyStore> -storepass <storePass> -keypass <keyPass> -signedjar <signedApk> <unsignedApk>release
```

* `-verbose`          签名/验证时输出详细信息
* `-keystore`        密钥库位置
* `-storepass`     用于密钥库完整性的口令
* `-keyPass`          专用密钥的口令（如果不同）
* `-signedjar`    已签名的 JAR 文件的名称

### 对齐

```
$ zipalign -v 4 <sourceApk> <outputApk>
```

验证对齐

```
$ zipalign -c -v 4 <application>
```

## Refs

1. [Android Application Build Process or Compilation Process](http://www.c-sharpcorner.com/UploadFile/34ef56/android-application-build-process-or-compilation-process/)

2. [class 文件与dex文件区别 （dvm与jvm区别）及Android DVM介绍 - 博客频道](http://blog.csdn.net/fangchao3652/article/details/42246049)

3. [I have updated Android SDK to rev. 22 yesterday and there is no apkbuilder in tools](https://stackoverflow.com/questions/16620655/i-have-updated-android-sdk-to-rev-22-yesterday-and-there-is-no-apkbuilder-in-to)