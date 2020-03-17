---
title: Android 主题引擎
date: 2016-06-21
categories:
    - Android
tags:
    - Theme
    - 记录
---

目前只有关于图标包的制作方法

![Android-icon-packs-Google-Play-Store](/img/Android-icon-packs-Google-Play-Store.png)
<!--more-->

## Action
## Anddoes (Categories:`com.anddoes.launcher.THEME`)
## ADW (Actions:`org.adw.launcher.THEMES`)
## ADWEX (Actions:`org.adw.launcher.THEMES`)
## Apex
## Arrow
## Atom
## Aviate
## Blur
## CyanogenMod

```java
// Actions in manifests which identify legacy icon packs
public static final String[] sSupportedActions = new String[] {
        "org.adw.launcher.THEMES",
        "com.gau.go.launcherex.theme",
        "com.novalauncher.THEME"
};

// Categories in manifests which identify legacy icon packs
public static final String[] sSupportedCategories = new String[] {
        "com.fede.launcher.THEME_ICONPACK",
        "com.anddoes.launcher.THEME",
        "com.teslacoilsw.launcher.THEME"
};
```

资源目录结构

![android_packages_themes_template_dir_tree](/img/android_packages_themes_template_dir_tree.png)


 * drawable-mdpi (~360p screens)
 * drawable-hdpi (~480p screens
 * drawable-xhdpi (~720p screens)
 * drawable-xxhdpi (~1080p screens)
 * drawable-xxxhdpi (~1440p screens)


### alarms / ringtones / notifications

单声音文件

### lockscreen / wallpaper

单图片(PS: 如果不写入锁屏壁纸，将由桌面壁纸代替)

### overlays

* android 系统资源，如动作栏的背景，检查框，单选框，滑块和滚动条等

* com.android.systemui 导航栏，状态栏，通知阴影和快速设置

* common 和应用程序共用的资源

* Other apps 其他应用的资源文件

### fonts

包含字体文件和Xml描述文件

### icons

iconfilter.xml 命名规则

![name_with_care.png](/img/name_with_care.png)

### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--
 * Copyright (C) 2016 The CyanogenMod Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
-->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.cyanogenmod.theme.template">

    <uses-feature android:required="true" android:name="org.cyanogenmod.theme" />

    <uses-sdk android:minSdkVersion="23" android:targetSdkVersion="23" />

    <meta-data android:name="org.cyanogenmod.theme.name" android:value="@string/theme_name"/>
    <meta-data android:name="org.cyanogenmod.theme.author" android:value="@string/theme_author" />
    <meta-data android:name="org.cyanogenmod.theme.email" android:value="@string/theme_email" />

    <application android:hasCode="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/theme_name"/>

</manifest>
```
### bootanimation

### res
## Everything.ME
## Fede (Categories:`com.fede.launcher.THEME_ICONPACK`)
## Go
## Holo
## Inspire
## Lucid
## Lucid Pro
## KK
## LG
## Next
## Nine
## Nine Pro
## Nova

### AndroidManifest.xml

```
<intent-filter>
    <action android:name="com.novalauncher.THEME" />
</intent-filter>
```

### icon

#### appfilter.xml

![name_with_care.png](/img/name_with_care.png)

component 可以适配部分关键词

* :BROWSER
* :CALCULATOR
* :CALENDAR
* :CAMERA
* :CLOCK
* :CONTACTS
* :EMAIL
* :GALLERY
* :PHONE
* :SMS

夜间模式支持

* :LAUNCHER_ACTION_APP_DRAWER 
* :LAUNCHER_ACTION_APP_DRAWER_NIGHT 

#### appfilter.xml

* iconback 原图标下增加背景，如果指定了多个图像则系统将随机选择。
* iconupon 原图标上增加前景，如果指定了多个图像则系统将随机选择。
* iconmask 透明像素不变,黑色不透明的像素将被删除。如果指定了多个图像则系统将随机选择。
* scale 重绘原来的图标尺寸

#### drawable.xml

手动替换应用，快捷方式和文件夹图标

```
<item drawable="ic_jellybean" />
<category title="Games" />
```

可以使用资源id

```
<item drawable="@drawable/ic_jellybean" />
<category title="@string/games" />
```

### Dock Backgrounds(theme_patterns.xml)

可以填充颜色或者灰阶,允许用户设置颜色 `canColor="true"`

```
<item drawable="@drawable/pattern_checkerboard" canColor="true" />
<item drawable="@drawable/pattern_colors" canColor="false" />
```

### Wallpapers(theme_wallpapers.xml)

```
<item drawable="@drawable/wallpaper_red" />
```

## Smart
## Smart Pro
## Solo
## Teslacoilsw (Categories:`com.teslacoilsw.launcher.THEME`)
## Themer
## Touchwiz (Samsung)
## TSF
## Xperia Home (Sony)
## Xposed && Unicon


## Refs

1. [ThemeUtils](https://github.com/CyanogenMod/android_frameworks_base/blob/7699100fa82f4b61871f90a9c381ea292b8d3a08/core/java/android/content/pm/ThemeUtils.java)
2. [IconPackHelper.java#L414-L436](https://github.com/CyanogenMod/android_frameworks_base/blob/bf2ddee45c9063780e095e6a732a51c8bab2df30/core/java/android/app/IconPackHelper.java#L414-L436)
3. [AssetManager.java#L695-L703](https://github.com/CyanogenMod/android_frameworks_base/blob/7699100fa82f4b61871f90a9c381ea292b8d3a08/core/java/android/content/res/AssetManager.java#L695-L703)
4. [android_util_AssetManager.cpp#L607-L638](https://github.com/CyanogenMod/android_frameworks_base/blob/7699100fa82f4b61871f90a9c381ea292b8d3a08/core/jni/android_util_AssetManager.cpp#L607-L638)
5. [android_packages_themes_Template](https://github.com/cyngn/android_packages_themes_Template)

6. [ADW Theming Guide](http://adwthings.com/launcher/adw/)

7. [Android customization – how to install an icon pack on your Android device](http://www.androidauthority.com/android-customization-how-to-icon-pack-593976/)

8. [](https://play.google.com/store/apps/details?id=com.sikebox.retrorika.material.icons&hl=zh_CN)

9. [Click UI - Icon Pack](https://play.google.com/store/apps/details?id=com.launchertheme.kxnt.click&hl=zh_CN)