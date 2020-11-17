---

layout:     post
title:      "简单分析那些巨无霸 APP 是如何产生的？"
date:       2017-09-06
author:     "Gitai"
categories:
    - 杂项

---

最近学校出现一台自助打印机，然后配套 APK 居然有 39 MB，遂我们来分析一下里面塞了啥？

PS: 虽然标题有逆向，但是并不打算写这部分，以及 smali 汇编语法也不做赘述

<!-- more -->

对于一个云打印服务，客户端其实只有一个引导打印的程序有意义，所以我们需要保留其有关代码，并删除社交系统。

官方的[设计稿](http://www.ui.cn/detail/144802.html)，第一页就是很合适的核心功能

![设计稿 - 印乐](https://i.loli.net/2017/09/05/59ae4405960c7.jpg)

其他的都是垃圾，或者再留个钱包

一般应用都会集成，一些诸如统计和用户行为分析的模块，而第三方的模块对此封装都是很好用的，一行就行那种。

于是我们来估测一下他用到的第三方服务

![首页 - 印乐](https://i.loli.net/2017/09/05/59ae44dc5c6ba.jpg)

  * 打印： 核心功能，可能显示 pdf 那个用 Google 或者 Adobe 的 pdf 查看软件更好
  * 扫描： 自己写的，但是裁剪没有有道笔记的自定义边界，管理不如 TinyScanner，但是因为调用系统相机底层，体积不大，而且因为扫二维码共用权限，也没有精简权限的可能性。
  * 去哪印：作为一个新生软件，并且只部署与部分高校，而且细粒度太低，暂时没什么用。
  * 找乐：更没用，而且这个估计用了 IM 和推送服务，删了能小不少。
  * 阅读：套壳浏览器，估计也就几百kb
  * 我的：这个姑且还要看钱。。。留着也不大

以上只是可见范围的分析

从程序使用分析，不难看出

  * 第三方登录： 至少封装了微信，QQ一类的 SDK
  * 支付：微信，支付宝
  * 推送：并不会小

之后我们拆了软件，来精简一下

```shell
$ du -h -d 1
25M     ./res
548K    ./original
34M     ./lib
980K    ./unknown
81M     ./smali
78M     ./smali_classes2
520K    ./assets
218M    .
```

常见 sdk 有自己的核心，又不让人知道，一般塞 so 里面，而且这些命名都是很明确的

```shell
$ tree
.
├── armeabi
│   ├── libBugtags.so
│   ├── libgifimage.so
│   ├── libgpuimage-library.so
│   ├── libimagepipeline.so
│   ├── libjniPdfium.so
│   ├── libjpush182.so
│   └── libmodpdfium.so
├── armeabi-v7a
│   ├── libBugtags.so
│   ├── libgifimage.so
│   ├── libgpuimage-library.so
│   ├── libimagepipeline.so
│   ├── libjniPdfium.so
│   ├── libjpush182.so
│   ├── libmodpdfium.so
│   ├── librealm-jni.so
│   ├── librsjni.so
│   └── libRSSupport.so
├── mips
│   ├── libBugtags.so
│   ├── libgpuimage-library.so
│   ├── libjniPdfium.so
│   ├── libmodpdfium.so
│   ├── librealm-jni.so
│   ├── librsjni.so
│   └── libRSSupport.so
└── x86
    ├── libBugtags.so
    ├── libgifimage.so
    ├── libgpuimage-library.so
    ├── libimagepipeline.so
    ├── libjniPdfium.so
    ├── libmodpdfium.so
    ├── librealm-jni.so
    ├── librsjni.so
    └── libRSSupport.so

4 directories, 33 files
```

`armeabi`, `armeabi-v7a`, `mips`, `x86` 兼容性非常良心，虽然都是第三方开源服务的

  * `Bugtags`：第三方的崩溃收集，都魔改了，咋收集啊
  * `gifimage`：本身打印用不上这玩意，估计社交的
  * `gpuimage-library`：同上
  * `imagepipeline`： +1
  * `jniPdfium`：删了，换 Google PDF
  * `jpush182`：删了推送，这东西挺烦的
  * `modpdfium`：删了
  * `realm-jni`：数据库留着吧
  * `rsjni`：没啥用的图像处理
  * `RSSupport`：+1

```shell
$ du -h smali*
448K    smali/com/chad/library
40K     smali/com/autonavi/aps
216K    smali/com/umeng/socialize
904K    smali/com/alipay/sdk
112K    smali/com/scwang/smartrefresh
184K    smali/com/getkeepsafe/relinker
880K    smali/com/afollestad/materialdialogs
652K    smali/com/android/volley
4.3M    smali/com/itextpdf
16K     smali/com/zhy/http/okhttp
256K    smali/com/aspsine/swipetoloadlayout
844K    smali/com/yunding/print
7.9M    smali/com/amap/api
116K    smali/com/loopj/android
3.9M    smali/com/alibaba/fastjson
2.0M    smali/com/alibaba/android
468K    smali/com/yalantis/ucrop
3.5M    smali/com/bumptech/glide
220K    smali/com/nostra13/universalimageloader
172K    smali/com/flipboard/bottomsheet
360K    smali/com/daimajia/swipe
600K    smali/com/bigkoo/pickerview
3.7M    smali/com/facebook/imagepipeline
40K     smali/com/zhihu/matisse
412K    smali/com/github/ybq/android/spinkit
228K    smali/com/github/chrisbanes/photoview
468K    smali/com/github/barteksc/pdfviewer
1.7M    smali/com/google/gson
4.2M    smali/com/google/zxing
56K     smali/jp/co/cyberagent/android/gpuimage
268K    smali/bolts
60K     smali/butterknife/internal
72K     smali/me/iwf/photopicker
12K     smali/org/greenrobot/eventbus
44K     smali/org/apache/http
40K     smali/org/jetbrains/annotations
104K    smali/org/intellij/lang
16K     smali/rx/schedulers
12K     smali/rx/android
12K     smali/rx/annotations
32K     smali/rx/exceptions
28K     smali/rx/internal
500K    smali/io/realm
28K     smali/io/bugtags
212K    smali/cn/yinle
1.9M    smali/cn/msy/lib
3.6M    smali_classes2/com/umeng
2.7M    smali_classes2/com/scwang/smartrefresh
916K    smali_classes2/com/nineoldandroids
15M     smali_classes2/com/itextpdf
68K     smali_classes2/com/shockwave/pdfium
72K     smali_classes2/com/shockwave
392K    smali_classes2/com/zhy/http
216K    smali_classes2/com/zhy/view/flowlayout
284K    smali_classes2/com/youth/banner
19M     smali_classes2/com/yunding/print
628K    smali_classes2/com/loopj/android
384K    smali_classes2/com/ta/utdid2
412K    smali_classes2/com/yalantis/ucrop
16K     smali_classes2/com/ut/device
1.1M    smali_classes2/com/nostra13/universalimageloader
124K    smali_classes2/com/novell/sasl
632K    smali_classes2/com/journeyapps/barcodescanner
80K     smali_classes2/com/mcxtzhang/swipemenulib
488K    smali_classes2/com/kenai/jbosh
732K    smali_classes2/com/tencent/mm/opensdk
876K    smali_classes2/com/zhihu/matisse
120K    smali_classes2/jp/wasabeef/blurry
304K    smali_classes2/jp/wasabeef/glide
1.0M    smali_classes2/jp/co/cyberagent/android/gpuimage
2.6M    smali_classes2/okhttp3
460K    smali_classes2/me/zhanghai/android/materialprogressbar
812K    smali_classes2/me/iwf/photopicker
188K    smali_classes2/me/gujun/android/taggroup
20K     smali_classes2/flipboard/bottomsheet
120K    smali_classes2/it/sephiroth/android/library/easing
208K    smali_classes2/it/sephiroth/android/library/imagezoom
1.9M    smali_classes2/org/xbill/DNS
360K    smali_classes2/org/greenrobot/eventbus
60K     smali_classes2/org/apache/qpid/management
1.4M    smali_classes2/org/apache/http
428K    smali_classes2/org/apache/harmony
8.0K    smali_classes2/org/intellij/lang/annotations
60K     smali_classes2/org/json/alipay
2.3M    smali_classes2/org/jivesoftware/smack
6.7M    smali_classes2/rx
592K    smali_classes2/okio
2.2M    smali_classes2/io/realm
56K     smali_classes2/de/measite/smack
240K    smali_classes2/top/zibin/luban
248K    smali_classes2/top
1.9M    smali_classes2/u/aly
```

以 `jpush` 为例，修改代码

```shell
$ grep -nr "jpush" smali*/*
smali/com/yunding/print/activities/YDApplication.smali:272:    invoke-static {v3}, Lcn/jpush/android/api/JPushInterface;->setDebugMode(Z)V
smali/com/yunding/print/activities/YDApplication.smali:275:    invoke-static {p0}, Lcn/jpush/android/api/JPushInterface;->init(Landroid/content/Context;)V
smali/com/yunding/print/activities/YDApplication.smali:282:    invoke-static {v3, v5}, Lcn/jpush/android/api/JPushInterface;->setLatestNotificationNumber(Landroid/content/Context;I)V
```

遂删除如上所示行，并移除 Jpush sdk 和 lib 文件
```shell
    .line 67
    const/4 v3, 0x0

    invoke-static {v3}, Lcn/jpush/android/api/JPushInterface;->setDebugMode(Z)V

    .line 68
    invoke-static {p0}, Lcn/jpush/android/api/JPushInterface;->init(Landroid/content/Context;)V

    invoke-static {v3, v5}, Lcn/jpush/android/api/JPushInterface;->setLatestNotificationNumber(Landroid/content/Context;I)V
```

  * lib/armeabi/libjpush182.so
  * lib/armeabi-v7a/libjpush182.so
  * smali/cn/jpush

对于多数情况，可能 `mips` 和 `x86` 的库也是非必要的

当移除 `lib/mips` 和 `lib/x86` 之后，体积减小 10 MB 左右，但是兼容性有所下降。

之后我们能发现，`itextpdf` 和 `zhihu` 占用并不算小

itextpdf: 本地 PDF 生成，不存在将从服务器下载
zhihu: 图片选择器，用于聊天和消息界面

删除这 2 个 sdk 文件夹，因为 `apktool` 并不会分析程序内部引用关系，所以只要用户不启用这个方法，该 bug 将不会出现，对此，我们可以通过在 layout 中隐藏对应控件，或者删除其事件，Android 的资源 id 需要善用搜索，如同其他分析方法一样，从静态资源入手，诸如 `title`，`tip` 都是可以轻易引导出所在 Java 文件的位置。

再说 `itextpdf` 和 `Pdfium` 一个是离线生成 PDF 一个是 PDF 预览，压缩之前是 20 MB，但是压缩之后不到 3 MB。

  * com/github/barteksc/pdfviewer
  * com/shockwave/pdfium

而 `Pdfium` 可以修改 `com/yunding/print/ui/file/FilePreviewFragment.smali` 来调用外部软件处理预览问题，但是本身也挺有用的。

通过以上简单的处理，apk 仅仅缩减到 25.8 Mb，可见缩减这事还有很大的开发空间。