---

layout:     post
title:      "Compile Lua 5.3.2 using Android Studio"
date:       2016-03-14 11:51:36
author:     "Gitai"
categories:
    - Lua
    - Android
tags:
    - 记录

---

> **Lua**  是一门强大、快速、轻量的嵌入式脚本语言。它由巴西里约热内卢 Pontifical Catholic 大学的 PUC-Rio 团队 开发。 Lua 是一个 自由软件， 广泛应用于世界上无数产品和项目。(http://www.lua.org/)

<!--more-->

## 准备

下载[lua5.3.2](http://www.lua.org/ftp/)源码和[luajava 1.1](http://files.luaforge.net/releases/luajava/luajava/LuaJava1.1)源码。

## 配置编译NDK

Android Studio 1.5.1上面对于NDK的编译进一步简化，只需要在工程的 `app/build.gradle` `defaultConfig`设置中增加如下配置就可以了：

```shell
ndk {
    moduleName "jni_module"
    ldLibs "log"
    abiFilters "armeabi"
}
```

默认情况下， `app/build.gradle` 中的代码是不能进行调试的，需要在 `buildType>debug/release` 下增加两个配置项：

```
jniDebuggable true
debuggable true
```

创建目录: `app`->`src`->`main`->`jni`, 存放要编译的c/c++文件以及Android.mk

在 `local.properties` 设置 `NDK` 的路径(ndk必须是r9以上)：

```
ndk.dir=YOUR-NDK-PATH
```


执行： `gradle build --debug --stacktrace`

### Q1

```
Error: NDK integration is deprecated in the current plugin.  Consider trying the new experimental plugin.  For details, see http://tools.android.com/tech-docs/new-build-system/gradle-experimental.  Set "android.useDeprecatedNdk=true" in gradle.properties to continue using the current NDK integration.
```

修改工程目录下的 `gradle.properties`,在文件中新建一行，添加如下：

```
android.useDeprecatedNdk=true
```

### Q2

`AndroidLua` 的 issue 那边这样说的～

```
luajava.c:40:17: fatal error: lua.h: No such file or directory
#include "lua.h"
```

To fix this issue. you just need to install lua from source code on you platfrom . so the lua.h will add into the include file.

```
curl -R -O http://www.lua.org/ftp/lua-5.3.2.tar.gz
tar zxf lua-5.3.2.tar.gz
cd lua-5.3.2
make linux test
```

just read the official webpage of lua.

实际上

用 `ndk-build` 手动编译

```
export NDK_PROJECT_PATH='YOUR_PROJECT_PATH-PROJECT/app/src/main'
ndk-build
```

是可以通过的

```
[armeabi] SharedLibrary  : libluajava.so
[armeabi] Install        : libluajava.so => libs/armeabi/libluajava.so
```

在 `gradle` 里面的路径问题，上述方法然并卵

不太好的解决方法如下：

#### 方法1

修改 `jni/luajava/luajava.c` 文件

```c
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
```

将导入头文件的路径修改如下

```c
#include "../lua/lua.h"
#include "../lua/lualib.h"
#include "../lua/lauxlib.h"
```

#### 方法2

在 `app` 中的 `build.gradle` 中加入两个 `task`：

##### ndkBuild

```
task ndkBuild(type: Exec) {
    def ndkDir = project.plugins.findPlugin('com.android.application').sdkHandler.getNdkFolder()
    commandLine "$ndkDir/ndk-build.cmd", '-C', 'src/main/jni',
            "NDK_OUT=$buildDir/ndk/obj",
            "NDK_APP_DST_DIR=$buildDir/ndk/libs/\$(TARGET_ARCH_ABI)"
}
```

##### copyJniLibs

```
task copyJniLibs(type: Copy) {
    from fileTree(dir: file(buildDir.absolutePath + '/ndk/libs'), include: '**/*.so')
    into file('src/main/jniLibs')
}
```

#### 单独编译

```shell
$ gradle ndkBuild copyJniLibs
```

### Q3

```
lua.c:67:31: fatal error: readline/readline.h: No such file or directory
```

缺少 `ibreadline-dev` 依赖包

```
centos: yum install readline-devel
debian: apt-get install libreadline-dev.
```

## 使用

1. `luajava` 下的org文件夹拷贝到工程 `src/main/java` 目录下
2. 将 `jniLibs/armeabi`下的 `libluajava.so` 重命名为 `libluajava-1.1.so` 或者修改 `org.keplerproject.luajava.LuaState.java` 的 `LUAJAVA_LIB` 常量

```java
LuaState luaState = LuaStateFactory.newLuaState();
luaState.openLibs();//打开标准库

luaState.LdoString("text = 'Hello Android, I am Lua.'");

luaState.getGlobal("text");

String text = luaState.toString(-1);
Log.e(TAG, "text is ： " + text);
```

## [移动平台的应用](http://www.ibm.com/developerworks/cn/opensource/os-cn-LUAScript/index.html)

## 参考

1. [Lua 中文手册](http://cloudwu.github.io/lua53doc/)
2. [Android Studio 1.5.1 配置编译NDK参考文档](https://www.mobibrw.com/p=3122)
3. [How to compile Lua 5.3.0 for Android as a dynamic library](http://blog.spreendigital.de/2015/01/26/how-to-compile-lua-5-3-0-for-android-as-a-dynamic-library/)
4. [AndroLua_pro](https://github.com/nirenr/AndroLua_pro)
5. [AndroidLua-AS](https://github.com/mrljdx/AndroidLua)
6. [`lua.c:67:31: fatal error: readline/readline.h: No such file or directory`](http://www.gnuoa.com/index.php/archives/592)
7. [`luajava.c:40:17: fatal error: lua.h: No such file or directory \n #include "lua.h"`](https://github.com/mkottman/AndroLua/issues/18)