---

layout:     post
title:      "串口数据持久化手札"
date:       2017-02-10
author:     "Gitai"
categories:
    - MCU
tags:
    - 记录

---


前面已经 WIFI 探针已经说到，用各种第三方工具和单片机进行交互。

但是为了开发我们更需要的是可以被接入的 SDK

乐鑫官方有个 `esptool`，这是个 Python 编写的终端工具，对于 Python 和 JavaScript 这类解释性需要来说，最大的好处就是原始码直接发布，虽然也可以编译混淆，但是基本非商业应用没人这么做。

`platformio` 有个 `pio device monitor` 命令，启动一个串口交互界面。

<!--more-->

以上都是用 Python 写的，并且都引入了 `serial` 库

用 `pip insatll serial` 安装后

去官方文档找找，发现一个神奇的模块 `miniterm`

https://github.com/pyserial/pyserial/tree/master/serial/tools

通 ~~读~~ 过源码，不难发现这是个完整的终端和串口交互的例子，遂 ~~抄~~ 借鉴之。

按照如上的通读结果，以及本次写入文件或者通过其他协议转发进行持久化之类的目的。

这模块抽象的不错，我们定义一个自己的 `FileConsole`

```python
class FileConsole(Console):
    def __init__(self):
        super(SnifferConsole, self).__init__()

    def setup(self):
        super(SnifferConsole, self).setup()
        self.last_upload = 0
        self.tfd = self.fd
        self.fd = open("/var/log/wifi_sniffer.log", "w+");

    def cleanup(self):
        termios.tcsetattr(self.tfd, termios.TCSAFLUSH, self.old)
        
    def write_bytes(self, byte_string):
        """Write bytes (already encoded)"""
        # 没用上
        # self.byte_output.write(byte_string)
        # self.byte_output.flush()

    def write(self, text):
        """Write string"""
        self.fd.write(text.encode('utf-8'))
        self.fd.flush()
```

```python
def __init__(self, serial_instance, echo=False, eol='crlf', filters=()):
    self.console = FileConsole()
```

运行之后文件会被保存在 `/var/log/wifi_sniffer.log`

但是，尝试用其他日志分析软件，如：`filebeat` 监控，读取和上传就会发现，很多行都被打断了。

因为 `reader` 方法里面调用 `self.serial.read` 读取串口数据，这种方式本身非常高效，但是缺点也显而易见，基本没几行完整的。

我们需要修改 `reader` 方法

```python
datas = self.serial.readlines(self.serial.in_waiting or 1)
for data in datas:
    if self.raw:
        self.console.write_bytes(data)
    else:
        text = self.rx_decoder.decode(data)
        for transformation in self.rx_transformations:
            text = transformation.rx(text)
        self.console.write(text)
```

完美！

如果写个 `LoggingConsole` 然后利用 `logging` 库将整个流程再一次封装也是极好的。虽然我已经试过了，但是懒的写。

之后，Python 整个库太大，编译下也麻烦。以及手贱想用 `rust` 感受下。但是限于时间，我还是用 `golang` 摸个鱼吧。不过顺手记录下可能有用的模块 [dcuddeback/serial-rs](https://github.com/dcuddeback/serial-rs)

* [ ] : Rust 坑 +1

以下用 `golang` 开发，参照 [Using Golang to connect Raspberry PIs and Arduinos over serial](https://reprage.com/post/using-golang-to-connect-raspberrypi-and-arduino)

```golang
package main

import (
	"github.com/gitaiqaq/serial"
	"io/ioutil"
	"time"
	"github.com/elastic/beats/libbeat/common"
	"strings"
	"strconv"
	"bufio"
	"fmt"
	"log"
)

func is_Number(b byte) bool {
	return b >= 48 && b <= 57
}

func is_Frame(b []byte) bool {
	if (len(b) < 54) {
		return false
	}
	return is_Number(b[0]) && b[1] == 124
}

func main() {
        c := &serial.Config{Name: "/dev/ttyUSB0", Baud: 115200}
        s, err := serial.OpenPort(c)
        if err != nil {
                log.Fatal(err)
        }

		scanner := bufio.NewScanner(s.File())
	    for scanner.Scan() {
	    	if(is_Frame(scanner.Bytes())){
		    	fmt.Println(scanner.Text())
	    	}
	    }

	    if err := scanner.Err(); err != nil {
	        log.Fatal(err)
	    }
}

```