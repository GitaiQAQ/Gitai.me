---

layout:     post
title:      "串口通讯基础"
source: http://forum.arduino.cc/index.php?topic=396450
date:       2017-02-10
author:     "Gitai"
categories:
    - MCU
    - 翻译
tags:
    - 记录

---

> 一个准备入硬件坑的软件工程师

目录
====== 

本教程中的以下部分

* 简介
* Arduino标准的串行数据缓慢
* 示例1 - 接收单个字符
* 为什么代码被组织到函数中
* 示例2 - 从串行监视器接收多个字符

* 示例3 - 更完整的系统
* 可以接收多少个字符？
* 示例中未使用的事件
*  serialEvent（）
* 清除输入缓冲区

* 接收数字而不是文本
* 示例4 - 从串行监视器接收单个数字
* 示例5 - 接收和解析数个数据
* 二进制数据
* 示例6 - 接收二进制数据的程序请注意，本教程将继续进入接下来的2个帖子

<!--more-->

简介
======

新人通常似乎在接收Arduino上的串行数据的过程中遇到困难 - 特别是当他们需要接收更多字符时。

事实上，[串行参考](http://www.arduino.cc/en/Reference/Serial)页面列出了18个不同的功能，但是可能然并卵。即使您编写一本书，但仍未涵盖所有可能情况。

比起写几页的页面，我认为提出覆盖所有新手的需求的几个例子将会更有用。当您了解这些示例时，您应该能够找出其他特殊案例的解决方案。

几乎所有串行输入数据都可以被三种简单的情况覆盖

- 只需要一个字符时
- 只需要串行监视器的简单手动输入时
- 其他

串行数据由Arduino标准缓慢
====== 

当任何东西向 Arduino 发送串行数据时，它将被以设置的波特率速度发送到 Arduino 缓冲区。在 9600 波特每秒大约发送 960 个字符，这意味着字符发送间隔仅仅刚超过1毫秒。

> 波特率 vs 比特率

Arduino 可以在 1 毫秒内做很多工作，因此，即使所有数据尚未到达，下面的代码也不会浪费时间等待输入缓冲区中的任何内容。即使在 115200 波特，字符之间仍然有 86 微秒或 1376 个 Arduino 指令执行时间。

> 指令执行时间

而且由于数据传输相对较慢，即使所有数据尚未到达，Arduino也很容易清空串行输入缓冲区。

许多新手做出错误，比如用 `Serial.available（）> 0` 将接收发送的所有数据的东西。但是即使只有部分数据已到达，这一会儿也可能会清空缓冲区。

示例1 - 接收单个字符
====== 

在很多情况下，需要的是向 Arduino 发送一个字符。

在大写和小写字母之间，数字字符有 62 个选项。

例如，您可以使用 `F` 作为前进，`R` 作为反向，`S` 停止。

接收单个字符的代码如以下内容一样简单

```C
/ Example 1 - Receiving single characters

char receivedChar;
boolean newData = false;

void setup() {
    Serial.begin(9600);
    Serial.println("<Arduino is ready>");
}

void loop() {
    recvOneChar();
    showNewData();
}

void recvOneChar() {
    if (Serial.available() > 0) {
        receivedChar = Serial.read();
        newData = true;
    }
}

void showNewData() {
    if (newData == true) {
        Serial.print("This just in ... ");
        Serial.println(receivedChar);
        newData = false;
    }
}
```

为什么代码被组织进函数
====== 

即使这个例子很简单，我也故意把接收放到一个单独的函数 `recvOneChar()`，这样就可以很容易地将它添加到任何其他程序。

我将显示函数 `showNewData()` 单独编写，因为你可以改变代码，以做任何你想要的，而不会打乱其余的代码。

如果您希望在自己的程序中使用任何示例中的代码，我建议您只从相关示例中复制完整的函数，并在自己的程序的顶部创建必要的全局变量。

示例2 - 从串行监视器接收几个字符
====== 

如果您需要从串行监视器接收多个字符（也许您想输入人员名称），则需要一些让 Arduino 知道何时它收到了完整的消息的方法。最简单的方法是将行尾设置为换行符。

这是通过串行监视器窗口底部的框完成的。您可以选择 `No line ending`, `Newline`, `Carriage return` 和 `Both NL and CR`.。当您选择 `Newline` 选项时，将在发送的所有内容中添加新行字符 `\n`。您将需要一些让 Arduino 知道收到完整信息的方法。

```C
// Example 2 - Receive with an end-marker

const byte numChars = 32;
char receivedChars[numChars];   // an array to store the received data

boolean newData = false;

void setup() {
    Serial.begin(9600);
    Serial.println("<Arduino is ready>");
}

void loop() {
    recvWithEndMarker();
    showNewData();
}

void recvWithEndMarker() {
    static byte ndx = 0;
    char endMarker = '\n';
    char rc;
    
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (rc != endMarker) {
            receivedChars[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
            receivedChars[ndx] = '\0'; // terminate the string
            ndx = 0;
            newData = true;
        }
    }
}

void showNewData() {
    if (newData == true) {
        Serial.print("This just in ... ");
        Serial.println(receivedChars);
        newData = false;
    }
}
```

该版本的程序将所有字符读入数组，直到检测到换行符为止。

示例3 - 更完整的系统
====== 

示例2中的简单系统将与不会试图混淆的和谐的人一起稳定的工作。

但是，如果发送数据的计算机或人员无法知道 Arduino 何时准备接收，真正风险是 Arduino 将无法知道数据开始。

如果您想了解这一点，请将上一个程序中的结束标记从 `\n` 更改为 `>` ，以便在文本中包含结束标记以进行说明。（您不能在从串行监视器发送的文本中手动输入换行字符）。并将行结束回到 `qwert>` 

这个问题的答案是包括一个开始标记和一个结束标记。

```C
// Example 3 - Receive with start- and end-markers

const byte numChars = 32;
char receivedChars[numChars];

boolean newData = false;

void setup() {
    Serial.begin(9600);
    Serial.println("<Arduino is ready>");
}

void loop() {
    recvWithStartEndMarkers();
    showNewData();
}

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;
 
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void showNewData() {
    if (newData == true) {
        Serial.print("This just in ... ");
        Serial.println(receivedChars);
        newData = false;
    }
}
```

要看看它如何工作，尝试发送 `qwerty <asdfg> zxcvb` ，你会看到它忽略除了 `asdfg` 之外的所有内容。

在这个程序中你会注意到有一个名为 recvInProgress 的新变量。

这是必要的，因为需要在开始标记之前到达的不需要的字符与在开始标记之后到达的有效字符进行区分。

该版本的程序与这个 Python - [Arduino 演示](http://forum.arduino.cc/index.php?topic=225329.msg1810764#msg1810764) 中的 Arduino 代码非常相似。


它的工作原理
====== 

重要的是要注意，每次调用函数recvWithEndMarker（）或recvWithStartEndMarker（）时，它会读取串行输入缓冲区中可能到达的任何字符，并将它们放在数组receivedChars中。

如果缓冲区中没有任何内容recvWithEndMarker（）不浪费时间等待。

在recvWithStartEndMarker（）的情况下，所有字符都被丢弃，直到检测到开始标记。

如果结束标记尚未到达，则会在循环（）接下来重复时重试。

为了获得最佳效果，重要的是确保loop（）可以尽可能快地重复 - 每秒数百甚至数千次。


可以收到多少个字符？
====== 
在这些例子中，我假设你不需要接收超过 32 个字节。这可以通过更改常量 numChars 中的值来轻松改变。

请注意，Arduino 串行输入缓冲区的 64 字节大小不会限制您可以接收的字符数，因为示例中的代码可以比新数据到达时更快地清空缓冲区。


在示例中没有使用的东西
====== 
你会注意到这里的例子不使用任何这些Arduino函数

```
Serial.parseInt()
Serial.parseFloat()
Serial.readBytes()
Serial.readBytesUntil()
```

所有这些都是阻止功能，阻止 Arduino 在满足之前做任何事情，或者直到超时到期。这里的示例完全相同的作业没有阻止。这样可以让 Arduino 在等待数据到达时执行其他操作。

所有这些都是阻止功能，阻止 Arduino 在满足之前做任何事情，或者直到超时到期。这里的示例完全相同的作业没有阻止。这样可以让 Arduino 在等待数据到达时执行其他操作。

serialEvent()
====== 

我不建议使用这个功能 - 我更喜欢在适合我的时候处理串行数据。

它的行为就好像你有这个代码作为 `loop()` 中的最后一件事情。

```C
if (Serial.available > 0) {
  mySerialEvent();
}
```

清除输入缓冲区
====== 
值得一提的是，名称不大的 `Serial.flush()` 函数不会使输入缓冲区为空。只有当 Arduino 发送数据时，它的目的才是阻止 Arduino，直到所有传出的数据都被发送才有用。

如果您需要确保串行输入缓冲区为空，您可以这样做

```C
while (Serial.available() > 0) {
    Serial.read();
}
```

接收数字而不是文本
====== 

到目前为止，这些例子假设你想要接收文本。但也许你想发送一个数字，或者混合文本和数字。

示例4 - 从串行监视器接收单个号码
====== 

最简单的情况是您要在串行监视器中键入数字（我假设您的行结尾设置为换行符）。让我们假设你想发送号码 234。

这是例2的一个变体，它可以使用任何整数值。请注意，如果您没有输入有效的数字，它将显示为 0（零）。

```C
// Example 4 - Receive a number as text and convert it to an int

const byte numChars = 32;
char receivedChars[numChars];   // an array to store the received data

boolean newData = false;

int dataNumber = 0;             // new for this version

void setup() {
    Serial.begin(9600);
    Serial.println("<Arduino is ready>");
}

void loop() {
    recvWithEndMarker();
    showNewNumber();
}

void recvWithEndMarker() {
    static byte ndx = 0;
    char endMarker = '\n';
    char rc;
    
    if (Serial.available() > 0) {
        rc = Serial.read();

        if (rc != endMarker) {
            receivedChars[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
            receivedChars[ndx] = '\0'; // terminate the string
            ndx = 0;
            newData = true;
        }
    }
}

void showNewNumber() {
    if (newData == true) {
        dataNumber = 0;             // new for this version
        dataNumber = atoi(receivedChars);   // new for this version
        Serial.print("This just in ... ");
        Serial.println(receivedChars);
        Serial.print("Data as Number ... ");    // new for this version
        Serial.println(dataNumber);     // new for this version
        newData = false;
    }
}
```

示例5 - 接收和解析数条数据
====== 

在单个消息中接收多条数据也可以直接解析，并将数据分配给各个变量。此示例假定您发送类似 `<HelloWorld，12，24.7>` 的内容。这是示例3的扩展。

已经添加了一个名为 `parseData` 的函数，在前面的例子中，函数 `showParsedData` 取代了 `showNewData` 。

```C
// Example 5 - Receive with start- and end-markers combined with parsing

const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];        // temporary array for use when parsing

      // variables to hold the parsed data
char messageFromPC[numChars] = {0};
int integerFromPC = 0;
float floatFromPC = 0.0;

boolean newData = false;

//============

void setup() {
    Serial.begin(9600);
    Serial.println("This demo expects 3 pieces of data - text, an integer and a floating point value");
    Serial.println("Enter data in this style <HelloWorld, 12, 24.7>  ");
    Serial.println();
}

//============

void loop() {
    recvWithStartEndMarkers();
    if (newData == true) {
        strcpy(tempChars, receivedChars);
            // this temporary copy is necessary to protect the original data
            //   because strtok() used in parseData() replaces the commas with \0
        parseData();
        showParsedData();
        newData = false;
    }
}

//============

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char rc;

    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc != endMarker) {
                receivedChars[ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            }
            else {
                receivedChars[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                ndx = 0;
                newData = true;
            }
        }

        else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

//============

void parseData() {      // split the data into its parts

    char * strtokIndx; // this is used by strtok() as an index

    strtokIndx = strtok(tempChars,",");      // get the first part - the string
    strcpy(messageFromPC, strtokIndx); // copy it to messageFromPC
 
    strtokIndx = strtok(NULL, ","); // this continues where the previous call left off
    integerFromPC = atoi(strtokIndx);     // convert this part to an integer

    strtokIndx = strtok(NULL, ",");
    floatFromPC = atof(strtokIndx);     // convert this part to a float

}

//============

void showParsedData() {
    Serial.print("Message ");
    Serial.println(messageFromPC);
    Serial.print("Integer ");
    Serial.println(integerFromPC);
    Serial.print("Float ");
    Serial.println(floatFromPC);
}
```

二进制数据
====== 

到目前为止，我们一直在接收字符数据 - 例如数字 121 由字符'1'，'2'和'1'表示。

也可以将该值作为二进制数据发送到单个字节中 - 它恰好是字符 `y` 的 Ascii 值。请注意，十进制中的 121 与 HEX 中的 0x79 相同。

请注意，如果要发送二进制数据，很可能需要以数据的形式发送与起始和终点标记相同的值。

这超出了本教程的范围，在这里[演示](http://forum.arduino.cc/index.php?topic=225329)了一种方法。

以下示例假设二进制数据将不会包含用于起始和终点标记的字节值。为了简单起见，我将继续使用 `<` 和 `>` 作为标记。这些字符的字节值为 `0x3C` 和 `0x3E`。这将允许您通过发送例如 `<24y>` 从串行监视器测试程序，这将被接收程序解释为二进制值 `0x32`,`0x34` 和 `0x79`。这些是 `2`,`4` 和 `y` 的Ascii代码。

当然，另外一个计算机程序 - 另一个Arduino或者PC上，二进制数据会更常见。

示例6 - 接收二进制数据的程序
====== 

```C
// Example 6 - Receiving binary data

const byte numBytes = 32;
byte receivedBytes[numBytes];
byte numReceived = 0;

boolean newData = false;

void setup() {
    Serial.begin(9600);
    Serial.println("<Arduino is ready>");
}

void loop() {
    recvBytesWithStartEndMarkers();
    showNewData();
}

void recvBytesWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    byte startMarker = 0x3C;
    byte endMarker = 0x3E;
    byte rb;
   

    while (Serial.available() > 0 && newData == false) {
        rb = Serial.read();

        if (recvInProgress == true) {
            if (rb != endMarker) {
                receivedBytes[ndx] = rb;
                ndx++;
                if (ndx >= numBytes) {
                    ndx = numBytes - 1;
                }
            }
            else {
                receivedBytes[ndx] = '\0'; // terminate the string
                recvInProgress = false;
                numReceived = ndx;  // save the number for use when printing
                ndx = 0;
                newData = true;
            }
        }

        else if (rb == startMarker) {
            recvInProgress = true;
        }
    }
}

void showNewData() {
    if (newData == true) {
        Serial.print("This just in (HEX values)... ");
        for (byte n = 0; n < numReceived; n++) {
            Serial.print(receivedBytes[n], HEX);
            Serial.print(' ');
        }
        Serial.println();
        newData = false;
    }
}
```

恩，这文章没什么用，继续找。。。