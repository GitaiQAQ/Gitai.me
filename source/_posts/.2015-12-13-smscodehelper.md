---

layout:     project
title:	"Captchas Tool"
permalink: '/smscodehelper/'
subtitle:   "Copy verification code from SMS automatically."
date:       2015-12-13
color: '#E91E63'
author:     "Gitai"
label:
    - 短信助手
    - SMS Tools
categories:
    - 应用
    - Android
tags:
    - 工具
    - 应用
    - Android
coolapkId: 21372
githubRepo: gitaiQAQ/SMSCodeHelper

applicationId: "me.gitai.smscodehelper"

---

验证码处理工具,检查短信中的验证码并给予在通知栏和Toast显示,输出至剪贴板等操作


{% github GitaiQAQ SMSCodeHelper  06c400c auto_expand = true %}

<!--more-->

> 本项目为 [RikkaW/SmsCodeHelper](https://github.com/RikkaW/SmsCodeHelper) 的二次开发的完全不同画风版,主要变化为高度自定义的更多配置项,第三方 `sdk` 的使用

## Licenses

GPLv3+

## TODO
- [ ] 部分支付通知金额抽取
- [ ] 更加完善的 `tasker` 插件支持

## 更新记录(ChangeLog)

### v0.0.8
* 修改了一些细节
* 又改了关于页面
* 调整优先级，防止通知被覆盖
* 修复前版本的拨号盘无法启动问题
* 增加更人性化的日志

### v0.0.7
* 增加 `tasker` 插件支持
* 修改了一些细节
* 修复 Android M 重复请求权限问题
* 修复解析出乱七八糟东西的问题
* 新的关于页面

### v0.0.6
* 修复通知图标
* 增加测试功能
* 增加部分解析解析
* 去除Google验证码`G-`
* 修复多个通知复制错误问题

### v0.0.5
* 优化整合解析器
* 更少配置项
	- 去除自定义触发关键词
	- 去除自定义来源及解析正则
* 修复透明状态栏及阴影重叠问题
* 增加测试用例 100+

### v0.0.4
* 增加简述(即说明)
* 增加配置项
	- 自定义触发关键词
	- 自定义来源及解析正则
* 反推服务商
* 拨号盘暗码: `*#*#767#*#*`  (SMS)
* 增加原生5.0以上Overview Screen卡片颜色

### v0.0.3
* 增加配置项
	- 启用/暂停服务
	- 自动复制到剪贴板
		* 检测剪贴板是否为空
	- 更科学的显示通知
		* 点击显示短信内容
		* 点击内容自动复制
		* 视图中显示来源/校验码/服务商等内容
* 新通知栏图标

### v0.0.2

* 新图标 @萌萌的小雅酱

### v0.0.1

* 增加 `魔趣 OS` 验证码解析 [`SDK`](http://opengrok.mokeedev.com/mkl-mr1/xref/external/mokee/MoKeeSDKs/libMoKeeCloud/libMoKeeCloud.jar)

### v1.0.6(10006)

* 重写/模块化
* 增加配置界面
* 增加正则表达式解析
* 增加通知提醒
* 精简兼容包(52.2kb)

### v1.0.5(10005)

* 支持含有大写字母的验证码
* 减少了一点点体积
* 新的图标

By:  [RikkaW](https://github.com/RikkaW)

## Images

- 萌萌的小雅酱
	+ mipmap-hdpi/ic_launcher.png
	+ mipmap-mdpi/ic_launcher.png
	+ mipmap-xhdpi/ic_launcher.png
	+ mipmap-xxhdpi/ic_launcher.png
	+ mipmap-xxxhdpi/ic_launcher.png
	+ drawable-hdpi/ic_notify.png
	+ drawable-mdpi/ic_notify.png
	+ drawable-xhdpi/ic_notify.png
	+ drawable-xxhdpi/ic_notify.png
	+ drawable-xxxhdpi/ic_notify.png

## Libraries

- [systembartint](https://github.com/jgilfelt/SystemBarTint)