---

layout:     post
title:      "Q&A of polybar"
date:       2017-03-17
author:     "Gitai"
categories:
    - GUI
tags:
    - polybar
    - Linux
    - GUI
    - 记录

---

https://github.com/jaagr/polybar

<!--more-->

```
CMake Error at /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:148 (message):
  Could NOT find PkgConfig (missing: PKG_CONFIG_EXECUTABLE)
```
```
sudo apt-get install pkg-config
```
----
```
-- Checking for module 'cairo-fc'
--   No package 'cairo-fc' found
CMake Error at /usr/share/cmake-3.5/Modules/FindPkgConfig.cmake:367 (message):
  A required package was not found
```
```
sudo apt-get install libcairo2-dev
```
https://launchpad.net/ubuntu/+source/cairo

----

```
-- Checking for module 'xcb-xkb'
--   No package 'xcb-xkb' found
```

```
apt search libxcb | grep "dev" | grep "xkb"
sudo apt-get install libxcb-xkb-dev
```

----

```
-- Checking for module 'alsa'
--   No package 'alsa' found
```
```
sudo apt-get install libalsa-ocaml libalsa-ocaml-dev
```

----

```
-- Checking for module 'libcurl'
--   No package 'libcurl' found
```
```
sudo apt-get install libcurl4-openssl-dev
```

----

```
-- Checking for module 'libmpdclient'
--   No package 'libmpdclient' found
```
```
sudo apt-get install libmpdclient-dev
```

----

```
CMake Error at /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:148 (message):
  Could NOT find Libiw (missing: LIBIW_LIBRARY LIBIW_INCLUDE_DIR)
```
```
sudo apt-get install libiw-dev
```
----

```
-- Checking for module 'xcb-proto'
--   Found xcb-proto, version 1.11
-- Found PythonInterp: /usr/bin/python2.7 (found suitable version "2.7.12", minimum required is "2.7") 
-- XCB[XCB]: Found component XCB
-- Found XCB_XCB: /usr/lib/x86_64-linux-gnu/libxcb.so  
-- Could NOT find XCB_ICCCM (missing:  XCB_ICCCM_LIBRARY XCB_ICCCM_INCLUDE_DIR) 
-- Could NOT find XCB_EWMH (missing:  XCB_EWMH_LIBRARY XCB_EWMH_INCLUDE_DIR) 
-- Could NOT find XCB_UTIL (missing:  XCB_UTIL_LIBRARY XCB_UTIL_INCLUDE_DIR) 
-- Could NOT find XCB_IMAGE (missing:  XCB_IMAGE_LIBRARY XCB_IMAGE_INCLUDE_DIR) 
CMake Error at /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:148 (message):
  Could NOT find XCB (missing: XCB_ICCCM_FOUND XCB_EWMH_FOUND XCB_UTIL_FOUND
  XCB_IMAGE_FOUND)
Call Stack (most recent call first):
  /usr/share/cmake-3.5/Modules/FindPackageHandleStandardArgs.cmake:388 (_FPHSA_FAILURE_MESSAGE)
  lib/xpp/cmake/FindXCB.cmake:245 (find_package_handle_standard_args)
  lib/xpp/CMakeLists.txt:13 (find_package)
```
```
sudo apt-get install libxcb-*
```
----

```
CMake Error at lib/xpp/CMakeLists.txt:55 (message):
  Missing required python module: xcbgen
```
```
sudo apt-get install python-xcbgen
```
----

```
Scanning dependencies of target i3ipc++
[  5%] Building CXX object lib/i3ipcpp/CMakeFiles/i3ipc++.dir/src/ipc.cpp.o
In file included from /root/polybar/lib/i3ipcpp/src/ipc.cpp:10:0:
/root/polybar/lib/i3ipcpp/include/i3ipc++/ipc.hpp:12:20: fatal error: i3/ipc.h: No such file or directory
compilation terminated.
lib/i3ipcpp/CMakeFiles/i3ipc++.dir/build.make:62: recipe for target 'lib/i3ipcpp/CMakeFiles/i3ipc++.dir/src/ipc.cpp.o' failed
make[2]: *** [lib/i3ipcpp/CMakeFiles/i3ipc++.dir/src/ipc.cpp.o] Error 1
CMakeFiles/Makefile2:441: recipe for target 'lib/i3ipcpp/CMakeFiles/i3ipc++.dir/all' failed
```
```
sudo apt-get install i3-wm
```
