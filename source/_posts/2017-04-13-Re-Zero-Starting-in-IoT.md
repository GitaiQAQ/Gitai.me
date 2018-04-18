---

layout:     post
title:      "从 0 开始的 IoT 学习小记"
date:       2017-04-13
author:     "Gitai"
categories:
    - IoT
tags:
    - 记录

---

## IoT 平台类型

WoT.City 将 IoT 开发平台分为以下 3 种：

* Single Board Computer － 例如：Intel Edison
* High Performance MCU － 例如：ARM mbed
* WiFi MCU － 例如：ESP8266 與 NodeMCU

一般来说，不同类型的 IoT 开发平台，也会有不同的 IoT Cloud 架构，以及不同的 IoT Diagram（Use Scenario）。WoT.City 的 Web of Things Framework 就是依靠不同 IoT 类型，设计出不同的 WoT Server 架构。


| IoT Node (Device Type)	| Solution Platform	| IoT Diagram (Use Scenario)
| - | - |-
| Single Board Computer (SBC) | Intel Edison、Qualcomm Dragonboard 410c etc. | IoT Router etc.
| High Performance MCU | ARM mbed OS、Neuclio | Sensor hub (Time-series Data Type) etc.
| WiFi MCU | ESP8266、NodeMCU、EMW3165 etc.	| Sensor hub (Interrupt Type)、Network controller etc.

: Device Types of IoT Node


<!--more-->

## 简介

> ESP8266 是低功耗、高集成度的 Wi-Fi 芯片，仅需 7 个外围元器件，超宽工作温度范围：-40°C 至 +125°C

> ESP8285 － ESP8266 内封 8 Mbit Flash

> [乐鑫](http://espressif.com/zh-hans)是上海的一家公司,有些关于ESP8266的资料可以从上面下载到。还有一点NodeMcu上面搭配的soc是ESP-12E，目前比较新的是ESP-12F，具体差别看国内ESP-8266国内代理的深圳安信可的说法是：

>> ESP8266-12F 是 ESP8266-12 的增强版，完善外围电路，四层板板工艺，增强阻抗匹配，信号输出更佳，无论是稳定性还是抗干扰能力，PCB天线经过专业实验室测试，完美匹配，经过ROHS认证，都得到了大幅度的提升！对于之前选择ESP-12的用户，即使已经做出产品也没关系，增强版完全兼容之前固件，引脚在ESP-12的基础上又新增六个IO口、SPI口引出，开发更加便捷，应用更加广泛！

> NodeMCU 是一款以 ESP8266 做為基礎的開發板。ESP8266（以及 NodeMCU）都是屬於 IoT 開發平臺中的 WiFi MCU 類型。 
- [NodeMCU](https://zh.wikipedia.org/wiki/NodeMCU)


综述：

NodeMCU 开发板 = ESP8266 模组 + USB to serial 芯片 + NodeMCU firmware

## ESP8266 模组[^ESP8266_mod]

模组有很多版本，官方国内代理有个列表[^ESP8266]

![esp8266_module_list.png](https://ooo.0o0.ooo/2017/05/15/5919b298c877d.png)
[![esp8266-esp12e-pinout][1]][2]
![esp8266-esp12e][3]

由于小巧，设计合理，可以很容易嵌入到你的开发板中，不过如果作为开发板使用，还是需要外部焊接一些基础电路的，比如复位电路，指示灯作用的LED等。

另外套件仅仅这些，如果需要跟电脑通信还需要自己准备一条 TTL232 线。官方建议的学习方式如下图所示：

![ttl232][7]

我选的是据说稳定一些的 CP2102 芯片的转换器，但是没有全 IO 导出，并不是很好用，以下为接线图

![Flashing-The-ESP8266-ESP201-Module-Board-With-TTL-UART.jpg](https://ooo.0o0.ooo/2017/05/15/5919b297cceff.jpg)

然后没成功，就入了 nodeMCU

![esp8266-nodemcu-pinout][4]
![esp8266-nodemcu][5]

如果你把排针全部焊接，通常如下图样式。其中两边对称的焊接向下，方便插入面包板或接入自己的电路板。顶端的6针焊接向上，方便直接连接串口调试或学习。

## 集成开发板选购

NodeMCU 结合以上 

| Generation | Version
|    :-:     |  :-
|     V1     |  0.9  
|     V2     |  1.0
|     V3     |  1.0

目前有三个主要生产商：Amica（见下面的“ NodeMCU和Amica ”），DOIT/SmartArduino 和 LoLin/WeMos。

### V1

在已经过时的 V1 版本中，通常是黄色 PCB 板。47mm x 31mm 意味着它覆盖了常规面包板的所有10个针脚，这使得使用非常不方便。似乎主要由 Amica 生产。

* USB to serial 芯片是 CH320
* 内置芯片是 ESP-12

![NodeMcu Lua WIFI Development Board For ESP8266 Module — Banggood][8]

![第一代ESP8266 NodeMCU开发板的引脚布局][9]

### V2

* USB to serial 芯片是 CP2102
* 内置芯片是 ESP-12E
* 更窄，适合面包板

![V2 CP2102 4M FLASH NodeMcu Lua WIFI Internet of Things development board ESP8266][10]

![第二代ESP8266 NodeMCU开发板的引脚布局][11]

### V3

V3是什么？NodeMCU迄今尚未发布新规范。因此，没有官方的第三代开发板。原来，V3 是由生产商 LoLin 发明的 “V2 ” 版本，用于表示对 V2 板的小改进。其中他们声称其USB端口更加强大。

* USB to serial 芯片是 CH340G
* 体积更大

![LoLin NodeMCU 开发板 V3 的引脚布局][12]
![LoLin V3 NodeMcu Lua WIFI Development Board][13]

如果你比较引脚布局，那么 V2 版本只有一点微小的差别。LoLin 决定使用两个备用引脚中的一个用于 USB 电源输出，另一个用于额外的 GND。

> 注意大小的差异！该 LoLin 板显然大于 Amica 和 DOIT  V2 板。
因为它的大小，我永远不会使用它。有明显更好的选择。

什么是 LoLin 与 WeMos 有关？我希望我知道...你看到的引脚布局最初是托管在wemos.cc，但是链接现在已经死了。

### 官方 vs 非官方

NodeMCU 在 Facebook 上张贴了一张照片，显示官方和非官方的 V2 板。

![官方NodeMCU 1.0/V2开发板][14]

这可能意味着 Amica 是“认可的”生产者，而 DOIT 和 LoLin 并不是。

### 备选的方案[^comparison-of-esp8266-nodemcu-development-boards]
  
## 配件

以下为个人顺手弄回来的配件

MB-102 830 Point Solderless PCB Breadboard:

* Quantity: 1 Pc
* Model: MB-102
* Dimension: 16.7 x 5.7 x 1cm
* Tie Points: 830 tie points (consists of: 630 tie-point terminal strip, 200 tie-point distribution strips)
* Matrix: 126 separate 5 point terminals, plus 4 horizontal bus lines (Power Lines) of 50 test points each
* Wire size: Suitable for 20~29 AWG (0.3mm ~ 0.8mm) wires

MB-102 Power Supply Module:

* Input voltage: 6.5V ~ 12 V DC / USB power supply
* Output voltage: 3.3V / 5V can switch over
* Maximum output current: <700mA
* Fluctuation two road independent control, can switch over to 0V, 3.3V, 5V
* On-board two groups of 3.3V, 5V DC output plug pin, convenient external lead use
* Size: 5.3 x 3.2 x 2.5cm

Note: If using the USB can not work, please use DC power.

但是咱漏了个适配器，USB 是母端口的，不知道咋用

Jump Cable Wires:

* Breadboard jumper cable wires
* Typically used for electronics projects
* Wires are flexible, durable, reusable, easy to trace
* Easy to connect and disconnect
* Quantity: 65 Pcs

## 参考[^esp8266-nodemcu-iot-starter]

[^ESP8266]: [ESP8266 系列模组专题](http://wiki.ai-thinker.com/esp8266)

[^ESP8266_mod]: [ESP8266也可以用Lua脚本玩——NodeMCU ESP8266评测](http://www.21ic.com/eva/Expansion/201608/683416.htm)

[^comparison-of-esp8266-nodemcu-development-boards]: [Comparison of ESP8266 NodeMCU development boards](https://frightanic.com/iot/comparison-of-esp8266-nodemcu-development-boards/)

[^esp8266-nodemcu-iot-starter]: [ESP8266 & NodeMCU 開發入門](https://wotcity.com/blog/2015/08/31/esp8266-nodemcu-iot-starter-part-1/)


  [1]: https://ooo.0o0.ooo/2017/05/15/5919b29810464.png
  [2]: http://www.kloppenborg.net/blog/microcontrollers/2016/08/02/getting-started-with-the-esp8266
  [3]: https://ooo.0o0.ooo/2017/05/15/5919b3694804a.jpg
  [4]: https://ooo.0o0.ooo/2017/05/15/5919b29836076.png
  [5]: https://ooo.0o0.ooo/2017/05/15/5919b3e46cd2b.jpg
  [6]: https://ooo.0o0.ooo/2017/05/15/5919b29836076.png
  [7]: https://ooo.0o0.ooo/2017/05/15/5919b4af650ec.jpg
  [8]: https://ooo.0o0.ooo/2017/05/15/5919b5bba8580.jpg
  [9]: https://ooo.0o0.ooo/2017/05/15/5919b60c12935.png
  [10]: https://ooo.0o0.ooo/2017/05/15/5919b628b0fe8.jpg
  [11]: https://ooo.0o0.ooo/2017/05/15/5919b6570c8aa.png
  [12]: https://ooo.0o0.ooo/2017/05/15/5919b66ea74cc.jpg
  [13]: https://ooo.0o0.ooo/2017/05/15/5919b6894c12b.jpg
  [14]: https://ooo.0o0.ooo/2017/05/15/5919b6b09d6f2.jpg