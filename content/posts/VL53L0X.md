---
layout:     post
title:      "激光测距 Adafruit VL53L0X"
date:       2020-03-16
author:     "Gitai"
tags:
  - Arduino
---

VL53L0X飞行时间测距传感器是ST第二代激光测距模块，采用市场尺寸最小的一种封装。VL53LOX是完全集成的传感器，配有嵌入式红外、人眼安全激光，先进的滤波器和超高速光子探测阵列。VL53L0X增强了ST FlightSense™系列，测量距离更长，速度和精度更高，从而开启了新应用之门。

[VL53L0X Distance Sensor 用户手册](http://www.waveshare.net/w/upload/d/d8/VL53L0X-Distance-Sensor-User-Manual-CN.pdf)

本文记录了一些小坑

- 官方的 Adafruit_VL53L0X 太大，2K RAM 只够给他，flash 也不够

- VL53L0X 经常连不上，因为 I2C address 改了之后，通过 XSHUT 复位是不会改回去的，断电也有可能没变化
- 所以建立开发是配合以下几个 Example
  - i2c_scanner 地址扫描
  - VL53L0X-Single 单芯片的调试
  - Adafruit_VL53L0X-vl53l0x_dual 多芯片的调试
- 最后集成的时候用 VL53L0X 这个库


简单的说就是当你发现连不上芯片的时候，检查排线没问题之后，用 i2c_scanner 扫一下就知道设备在不在线了，顺便看看 I2C Address 是不是默认的 0x29。

或者用我这个混合了 i2c_scanner 和 VL53L0X 连接的代码。

```cpp
pinMode(PIN_VL53L0X_Y_XSHUT, OUTPUT);
digitalWrite(PIN_VL53L0X_Y_XSHUT, LOW);

Wire.begin();

loX.setTimeout(50);
loY.setTimeout(50);

for (byte address = 0x29; address < 0x40; ++address) {
    loX.setAddress(address);
    if (loX.init())
    {
        Serial.print("Initial VL53L0X_1 at ");
        Serial.println(address, HEX);

        loX.startContinuous();

        Serial.println("Change Address of VL53L0X_1 to temp address 0x28");
        loX.setAddress(0x28);
        break;
    } else {
        loX.last_status = 5;
    }
}

if (5 == loX.last_status) {
    Serial.println("I2C address from 0x29 to 0x40 without device1");
    while (1);
}

Serial.println("Enable VL53L0X_2");
digitalWrite(PIN_VL53L0X_Y_XSHUT, HIGH);

Serial.println("Initial VL53L0X_2");
for (byte address = 0x29; address < 0x40; ++address) {
    loY.setAddress(address);
    if (loY.init())
    {
        Serial.print("Initial VL53L0X_2 at ");
        Serial.println(address, HEX);

        loY.startContinuous();
        break;
    } else {
        loY.last_status = 5;
    }
}

if (5 == loY.last_status) {
    Serial.println("I2C address from 0x29 to 0x40 without device2");
    while (1);
}

Serial.print("Change Address of VL53L0X_1 to 0x");
byte address = ((loY.getAddress() - 28) / 10) + 29;
Serial.println(address);
loX.setAddress(address);
```

