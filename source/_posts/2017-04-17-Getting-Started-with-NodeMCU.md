---

layout:     post
title:      "NodeMCU 开发入门"
date:       2017-04-17
author:     "Gitai"
categories:
    - IoT
tags:
    - 记录

---

入了个 nodemcu 来记一段初始化过程遇上的坑

先插线，恩，卖家送了根很粗的烧录线。

全家福什么的我是不会拍的

先做好基本的准备工作

基础环境是 Chromebook 中的 Ubuntu，不过这其实并不重要

<!--more-->

比如下载个固件什么的

```shell
$ wget https://github.com/nodemcu/nodemcu-firmware/releases/download/0.9.6-dev_20150704/nodemcu_integer_0.9.6-dev_20150704.bin
```
然后在来个官方专用的工具包 `esptool`

```shell
$ git clone https://github.com/themadinventor/esptool.git
```

反正看不懂，就这样烧录吧！估计不会坏。。。

官方资料在[这](https://nodemcu.readthedocs.io/en/master/en/flash/)

让你酱紫刷入固件

```shell
sudo python ./esptool.py --port <serial-port> write_flash -fm <mode> 0x00000 <nodemcu-firmware>.bin
```

* serial-port 设备接口，一般是 `/dev/ttyUSB0`。如果没有，在 `ls /dev` 中可以试着揣测一下。如果是 `/dev/ttyUSB0` 接下来的操作中，其实这个参数可以直接省略。
* mode flash 容量在 512 kByte 为 `qio`，>=4 MByte 为 `dio`，如果不知道 `qio` 万能的

其实 mode 不写也会自动配置

```shell
Auto-detected Flash size: 4MB
```

这个容量可以通过 `esptool.py --port <serial-port> flash_id` 得到的芯片信息来看。

```shell
# esptool.py v2.0-beta2
Connecting....
Detecting chip type... ESP8266
Uploading stub...
Running stub...
Stub running...
Manufacturer: e0
Device: 4016
Hard resetting...
```

这里有个 `Device`， 去[`flashchips.h`](https://code.coreboot.org/p/flashrom/source/tree/HEAD/trunk/flashchips.h) 中 `Ctrl + F`，可以查到[如下内容](https://code.coreboot.org/p/flashrom/source/tree/HEAD/trunk/flashchips.h#L117)

```
#define AMIC_A25LQ032 0x4016 /* Same as A25LQ32A, but the latter supports SFDP */
```

然后，通过 `A25LQ32A` 查到[芯片参数](http://www.alcom.nl/binarydata.aspx?type=doc/Amic_A25LQ032.pdf)

```
 A25LQ032: 32M-bit /4M-byte 
```

反正就这样执行，基本不会有错的，有错说明买了假开发板。

```shell
sudo python ./esptool.py --port /dev/ttyUSB0 write_flash 0x00000 ../nodemcu_integer_0.9.6-dev_20150704.bin 
[sudo] password for jaufranc: 
Connecting...
Erasing flash...
Writing at 0x00048000... (65 %)
```

若干分钟过去了，进度条消失，出现如下内容表明烧录成功

```
Wrote 450560 bytes at 0x00000000 in 44.3 seconds (81.3 kbit/s)...
 
Leaving...
```

接下来已经能在，WiFi 列表中看到 `AI-THINKER_XXXXXX` 的 ESSID。

遂使用 `minicom` 或者 `screen` 连接端口

没装的自行

```shell
# apt install screen minicom
```

用 `minicom` 跑一次

```shell
$ minicom -b <baudrate> -D <serial-port>
```

* baudrate 波特率 nodemcu 默认 9600
* serial-port 如上，但是默认 `tty8`

很好不会用，下一个


```shell
$ screen <serial-port> <baudrate>
```

参数如上

从 `hello world` 开始是国际惯例

```lua
print('Hello World');
```

为了方便的开发，建议使用官方的 `ESPlorer`

![ESPlorer](https://nodemcu.readthedocs.io/en/master/img/ESPlorer.jpg)

可视化怎么来说也是非常棒的！（尤其咱这种手残，没有删除和修改，完全写不下去

就是需要个 Java， 不过 Ubuntu 自带 openjdk 或者可以参照以前的[文章](https://gitai.me/2015/07/06/linux-jdk-install/)，安装 Oracle JDK。

然后参见官方文档，简单使用如下：

右边有一排按钮和输入框，按钮是常用的内置命令
 
输入框就是普通写入的入口，下面用一个板载 LED 的开关来演示基本操作，为什么是基本操作，因为我完全不明白 gpio 干嘛的，高/低电平什么的。。。反正瞎写应该不会炸。。。

```lua
gpio.mode(0, gpio.OUTPUT)
```

哇，亮了，怎么关是个很值得思考的问题（以上例子来自 ESP8266 & NodeMCU 開發入門[^esp8266-nodemcu-iot-starter]

经过对 [Ruff](https://ruff.io/zh-cn/docs/gpio.html) 和 [GPIO学习笔记](http://www.jianshu.com/p/008339095fd6) 的浅涉

```lua
gpio.write(0, gpio.HIGH)
```

酱紫就可以关闭了。

实际上，如果遇上无法解决的问题，Windows 修电脑那一套，依然可靠，没有什么重启（restart - node.restart()
）解决不了的，如果有那就重装（reflash）。

以上内容还参考了 Getting Started with NodeMCU Board Powered by ESP8266 WiSoC[^getting-started-with-nodemcu-board-powered-by-esp8266-wisoc]

还有个基于 `atom` 可以放在 `vscode` 的物联网开发环境 [`PlatformIO`](http://platformio.org/)

[![PlatformIO](https://i.loli.net/2017/10/28/59f44fe4d7f2d.png)]((http://platformio.org/))

先安装依赖

```
# apt-get install git autoconf build-essential gperf bison flex texinfo libtool libncurses5-dev wget gawk libc6-dev-amd64 python-serial libexpat-dev
```

安装 [`PlatformIO`](http://platformio.org/) 

```
# pip install -U platformio
```

编写 `.ino` 文件

 * 初始化： `pio init` 
 * 编译： `pio run` 
 * 烧录： `pio run -t upload` 
 * 串口通讯： `pio device monitor`

## 附录 A: GPIO 对应关系

|IO index | ESP8266 pin
|  :---:  | :----------
|  0 [*]  |  GPIO16
|    1	  |  GPIO5
|    2	  |  GPIO4
|    3	  |  GPIO0
|    4	  |  GPIO2
|    5	  |  GPIO14
|    6	  |  GPIO12		
|    7	  |  GPIO13
|	 8	  |  GPIO15
|	 9	  |  GPIO3
|	 10	  |  GPIO1
|	 11	  |  GPIO9
|	 12	  |  GPIO10

> [*] D0(GPIO16) can only be used as gpio `read`/`write`. 
No support for `open-drain`/`interrupt`/`pwm`/`i2c`/`ow`.

## ESP8266 管脚清单

1. `INST_NAME` indicate the `IO_MUX` REGISTER defined in `eagle_soc.h`，for example `MTDI_U` refers to `PERIPHS_IO_MUX_MTDI_U`
2. `NET NAME` accords with the pin name in schematic
3. `FUNCTION` says the multifunction of each pin pad
func number 1-5 in this table correspond to FUNCTION 0-4 in SDK
e.g.：set MTDI to GPIO12
```
#define FUNC_GPIO12  3 //defined in eagle_soc.h
PIN_FUNC_SELECT(PERIPHS_IO_MUX_MTDI_U,FUNC_GPIO12);
```

http://espressif.com/sites/default/files/documentation/0d-esp8266_pin_list_release_15-11-2014.xlsx

EOF

[^getting-started-with-nodemcu-board-powered-by-esp8266-wisoc]: [Getting Started with NodeMCU Board Powered by ESP8266 WiSoC](http://www.cnx-software.com/2015/10/29/getting-started-with-nodemcu-board-powered-by-esp8266-wisoc/)

[^esp8266-nodemcu-iot-starter]: [ESP8266 & NodeMCU 開發入門 (Part 1) - Hello World](https://wotcity.com/blog/2015/08/31/esp8266-nodemcu-iot-starter-part-1/)