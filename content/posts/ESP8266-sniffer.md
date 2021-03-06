---

layout:     post
title:      "ESP8266 的小探针"
date:       2017-05-02
author:     "Gitai"
categories:
    - IoT
tags:
    - 记录

---

## 简述

本文加入首先要有一个 X 系列，没有的麻烦隔壁淘宝。RMB 20 的是很稳的。

以及采用 C 编写，但是主要都是调用 API

糅合了以下几个小项目

* Sniffer mode
* SmartConfig
* [OTA](https://www.penninkhof.com/2015/12/1610-over-the-air-esp8266-programming-using-platformio/)
* [HttpUpdater](https://community.blynk.cc/t/updating-ota-is-amazing/7649/87)

<!--more-->

ChromeOS ArduinoOTA 一直失败的原因：

参见之前的 [Minecraft 开放端口问题](https://gitai.me/2016/12/25/chromebook-iptables/)。

ArduinoOTA 以 udp 发送上位机参数，然后带出一个端口给 MCU，但是 ChromeOS 默认不开放端口。于是没法传输成功。

## esp8266-sniffer

{% github GitaiQAQ Hosts-Studio-Android c95e58 auto_expand = true}

使用流程：

* 引导： 芯片/开发板加电，LED 点亮一次，表明启动正常。
* 选择： LED 常亮 60s，在此期间采用 `smartconfig` 或者 `airkiss` 协议来进入配置模式。若 60s 内未进入配置模式，会自动启用探针模式。
    * WEB 配置界面，用手机配置软件所显示的 IP 进入，配置 WEB 界面，参照提示完成配置。
    * OTA 升级模式，采用 ArduinoOTA 协议完成升级，完成后会自动重启。
* 探针： LED 闪烁，频率由当前拦截数据包量决定。


```shell
# iptables -A INPUT -j ACCEPT
```

```
Exception (9):
epc1=0x40100861 epc2=0x00000000 epc3=0x00000000 excvaddr=0xffffffff depc=0x00000000

ctx: sys 
sp: 3ffffd90 end: 3fffffb0 offset: 01a0

>>>stack>>>
3fffff30:  023e3986 3ffe91f0 3fff2a1c 40100688  
3fffff40:  4023279a 3ffeb2d4 3ffea51c 40106f50  
3fffff50:  4023289c 3ffeb2d4 3ffe91f0 023e3986  
3fffff60:  7a0aa8c0 00ffffff 010aa8c0 023e3986  
3fffff70:  4020a2b5 3ffe0c22 4020a2b5 3ffea51c  
3fffff80:  4020a2fa 3fffdab0 00000000 3fffdcb0  
3fffff90:  3ffe9200 3ffeb4e0 00000001 4020e1eb  
3fffffa0:  40000f49 40000f49 3fffdab0 40000f49  
<<<stack<<<
```

https://github.com/esp8266/Arduino/issues/1299

EXC-CAUSE Code: 9

## Autoupdate

自动升级本身在 `setup` 流程中运行，但是每次暂时有个
```
[HTTP] GET 192.168.10.139...
[HTTP] GET... failed, error: connection refused
```
在一天的调试，增加了无数的 BUG 之后， 决定曲线救国，遂用一个变量控制，降低一点性能，继续开发下一部分。
不过在此列入 todo

* [ ] BUG +1



## 附录 A: Exception Causes (EXCCAUSE)

| EXC-CAUSE Code | Cause Name | Cause Description | Required Option | EXC-VADDR Loaded |
|:--------------:|:---------------------------|:------------------------------------------------------------------------------------------------------------|:-------------------------|:----------------:|
| 0              | IllegalInstructionCause    | Illegal instruction                                                                                         | Exception                | No               |
| 1              | SyscallCause               | SYSCALL instruction                                                                                         | Exception                | No               |
| 2              | InstructionFetchErrorCause | Processor internal physical address or data error during instruction fetch                                  | Exception                | Yes              |
| 3              | LoadStoreErrorCause        | Processor internal physical address or data error during load or store                                      | Exception                | Yes              |
| 4              | Level1InterruptCause       | Level-1 interrupt as indicated by set level-1 bits in the INTERRUPT register                                | Interrupt                | No               |
| 5              | AllocaCause                | MOVSP instruction, if caller’s registers are not in the register file                                       | Windowed Register        | No               |
| 6              | IntegerDivideByZeroCause   | QUOS, QUOU, REMS, or REMU divisor operand is zero                                                           | 32-bit Integer Divide    | No               |
| 7              | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 8              | PrivilegedCause            | Attempt to execute a privileged operation when CRING ? 0                                                    | MMU                      | No               |
| 9              | LoadStoreAlignmentCause    | Load or store to an unaligned address                                                                       | Unaligned Exception      | Yes              |
| 10..11         | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 12             | InstrPIFDataErrorCause     | PIF data error during instruction fetch                                                                     | Processor Interface      | Yes              |
| 13             | LoadStorePIFDataErrorCause | Synchronous PIF data error during LoadStore access                                                          | Processor Interface      | Yes              |
| 14             | InstrPIFAddrErrorCause     | PIF address error during instruction fetch                                                                  | Processor Interface      | Yes              |
| 15             | LoadStorePIFAddrErrorCause | Synchronous PIF address error during LoadStore access                                                       | Processor Interface      | Yes              |
| 16             | InstTLBMissCause           | Error during Instruction TLB refill                                                                         | MMU                      | Yes              |
| 17             | InstTLBMultiHitCause       | Multiple instruction TLB entries matched                                                                    | MMU                      | Yes              |
| 18             | InstFetchPrivilegeCause    | An instruction fetch referenced a virtual address at a ring level less than CRING                           | MMU                      | Yes              |
| 19             | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 20             | InstFetchProhibitedCause   | An instruction fetch referenced a page mapped with an attribute that does not permit instruction fetch      | Region Protection or MMU | Yes              |
| 21..23         | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 24             | LoadStoreTLBMissCause      | Error during TLB refill for a load or store                                                                 | MMU                      | Yes              |
| 25             | LoadStoreTLBMultiHitCause  | Multiple TLB entries matched for a load or store                                                            | MMU                      | Yes              |
| 26             | LoadStorePrivilegeCause    | A load or store referenced a virtual address at a ring level less than CRING                                | MMU                      | Yes              |
| 27             | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 28             | LoadProhibitedCause        | A load referenced a page mapped with an attribute that does not permit loads                                | Region Protection or MMU | Yes              |
| 29             | StoreProhibitedCause       | A store referenced a page mapped with an attribute that does not permit stores                              | Region Protection or MMU | Yes              |
| 30..31         | Reserved for Tensilica     |                                                                                                             |                          |                  |
| 32..39         | CoprocessornDisabled       | Coprocessor n instruction when cpn disabled. n varies 0..7 as the cause varies 32..39                       | Coprocessor              | No               |
| 40..63         | Reserved                   |                                                                                                             |                          |                  |

: Infos from Xtensa Instruction Set Architecture (ISA) Reference Manual

