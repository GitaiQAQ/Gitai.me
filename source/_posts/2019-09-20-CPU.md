---
layout:     post
title:      "从高级语言到基本电路"
subtitle:	"计算机可编程性的原理"
date:       2019-09-20
author:     "Gitai"
tags:
  - CPU

---

计算机的可编程性主要是指对中央处理器的编程。通过预设的指令集，和储存设备记录的指令序列，实现可编程性。

本文广泛借鉴了 《大话处理器处理器基础知识读本》，更准确的来说是对其中的某些细节进行丰富，并连贯在一起，从另一个角度理解程序到物理电路的关系。

<!-- more -->

## 体系架构

冯·诺伊曼结构：将存储设备与中央处理器分开的概念。
哈佛架构：将程序数据与普通数据分开存储的设计概念，但是它并未完全突破冯.诺伊曼架构。
修正哈佛架构：允许将指令存储器的内容作为数据进行访问。

## 指令集[^2-1]

早期的计算机没有指令集这种东西，都是软硬件绑定耦合。每次用户购买就是整套产品，直到 IBM 秉持着“加一层的设计理念”，弄出了 ISA，用于抽离程序和底层 CPU 的强耦合，随后 CPU 的内部实现，被称之为 微架构（Microarchitecture），而对上层暴露的接口称之为 架构（Architecture）。

OISC/URISC：（One/Ultimate Reduced Instruction Set Computer） 单一指令集/最简指令集计算机

CISC: （Complex Instruction Set Computer）复杂指令集，对程序逻辑的高级封装，通过对精简指令的复合，加速程序执行

1. 计算机发展早期，人们用汇编语言进行编程，自然喜好强大好用的指令集（类似高阶语言的各种语法糖）。
2. CISC 指令集中包含高级语言的某些特性，如复杂的寻址模式，直接对应指针的运算。
3. 那时的存储器速度慢且昂贵，因此 CISC 的指令是变长指令，以节约存储空间。由一条指令完成很多功能，对内存访问减少了。

RISC: （Reduced Instruction Set Computing）精简指令集

1. IBM 发现，CISC 中的大量复杂寻址方式和大量指令不会被经常用到。常用的指令只占 20%。
2. RISC 的指令大部分时间能在一个 cycle 内完成，因此处理器频率得到大幅度提升。
3. RISC 利于扩展，但 RISC 采用定长指令，使得存储空间变大。程序空间较大会降低 cache 的命中率，降低程序的执行效率。

举个例子

在 CISC 架构和 RISC 实现加法，会有如下差异

```asm
add (reg) 0x08 // 直接将存储器单元(reg)中的值加0x08，结果仍然存放在该存储器单元中
```

```asm
ld reg2 (reg) // 将存储器单元 (reg) 中的值加载到寄存器 reg2 中
add reg2 0x08 // 将寄存器 reg2 中的值加 0x08，结果存到在寄存器 reg2 中
store (reg) reg2 // 将寄存器 reg2 中的值放回存储器单元 (reg) 中
```

然后对上面 2 种指令集从以下 2 个角度理解

第一种，RISC 能满足所有需求，但是 CISC 提供了一系列通过硬件提升性能的拓展指令。

第二种，CISC 是高阶的抽象，对 RISC 进一步封装，所以我们也可以在上层完成这个阶段，通过预编译将 CISC 预先转化为 RISC，然后进一步执行。（Intel 就是这么整的）

ZISC：（Zero Instruction Set Computing） 零指令集，用于教学环境下的 CPU 模拟。

[^2-1]: ][终于有人把各个指令集之间的关系和发展讲清楚了](https://www.4hou.com/web/17446.html)

## 机器字长

在各种架构之下，我们常常能听到 x86, x64 这种对 CPU 架构的简称，x64 实际上是 x86-64，而这里就包含一个叫机器字长的特性。

这里有相对完整的[CPU 架构比较表](https://en.wikipedia.org/wiki/Comparison_of_instruction_set_architectures)

可以清晰的发现各种架构的共同点和差异，比如： 

* x86 存在 16->32->64 位
* 而 ARM 在 32 和 64 则是 2 套，A32 和 A64
* MIPS 则只有 32->64
* RISC-V 非常 nb，但是不知道咋回事的东西

其 32 就是每个寄存器可以储存的数据长度，以及 CPU 单次处理的数据量。

## 高阶语言 -> 汇编语言

```c
int main() {
    int a = 19;
    int b = 918;
    int c = a + b * b / a;
    return c;
}
```

首先使用 [Compilter Explorer]: (https://gcc.godbolt.org/) 瞅一眼他们的生成的汇编代码。

最好是先弄出来编译生成的二进制可执行文件，并使用逆向工具 IDA，获取它的机器码和汇编吗。

在此使用 [dockcross](https://github.com/dockcross/dockcross) 这个项目来处理这个问题。这也是为了符合我自己定义的环境分发的理念。

最后得到如下一堆文件

* `main.s` gcc -S 生成的汇编代码
* `a.out` 目标文件
* `a.strip.out` 经过 strip 处理后的目标文件
* `a.strip.asm` 通过 IDA 逆向得到的汇编文件

把最重要的抽出来，大概是下面这堆东西；为了提升可读性，和 `main.s` 和 `a.strip.asm` 均有巨大差异。

因为汇编和编译器和物理硬件有着强依赖性，所以这个简单的例子还是太复杂；我们从更简单的 Intel 8086 开始简单入门汇编。

拿阮一峰的这篇文章来看看 [汇编语言入门教程](http://www.ruanyifeng.com/blog/2018/01/assembly-language-primer.html)，`i++` 这是如何执行的。

```assembly
# int i[] = [2];
push 2
loopStart:
# ax = i[0];
pop AX
# tmp = 1;
push 1
pop BX
# i = i + tmp;
add AX, BX
# i = tmp
push AX
# goto
jmp loopStart
```

![1568885131699.gif](/img/2019/09/jiHpKWkBxgnJCqz.gif)

大概就是这么回事，这样看起来好像写个模拟器很简单的样子。

接下来分析一下上面通过反汇编得到的汇编代码 (GAS / AT & T)。

```assembly
# $19 立即数寻址
# -4(%rbp) = *(rbp - 4) (基址 + 偏移值) 寻址
# movl S,D 对 4 字节整数进行传送 D = S
movl	$19, -4(%rbp)
movl	$918, -8(%rbp)
movl	-8(%rbp), %eax
# 无符号 64位乘
# R[%edx]:R[%eax] = S * R[%eax]
# 高 32 位放在 edx，低 32 位放在 eax
imull	-8(%rbp)
# https://www.cnblogs.com/zuoxiaolong/p/computer17.html
cltd
# 有符号除法，保存余数和商
# eax 商，edx 余数
idivl	-4(%rbp)
movl	%eax, %edx
movl	-4(%rbp), %eax
# 求和赋值，addl S,D; D = D + S
addl	%edx, %eax
movl	%eax, -12(%rbp)
movl	-12(%rbp), %eax
```

好像也不是很难，看起来写个模拟器不是很难的样子。

[^4-1]: [深入理解计算机系统](https://www.cnblogs.com/zuoxiaolong/p/computer1.html)
[^4-2]: [一些CPU架构模拟器](https://blog.csdn.net/A3630623/article/details/17655063)
[^4-3]: [x86 汇编语言快速入门](https://blog.csdn.net/u012837895/article/details/79855887)
[^4-4]: [AT&T 汇编语言入门](https://blog.csdn.net/ldong2007/article/details/2873611)
[^4-5]: [MIPS 汇编指令](https://blog.csdn.net/u012837895/article/details/79855896)

## 汇编语言 -> 机器语言

查看 Objdump 生成的汇编代码(`main.s.dec`)，左侧是对应的机器码。右侧的汇编代码均以 16 进制表示。所以下面的代码等效于上面的 `main.s`

```assembly
664:   c7 45 fc 13 00 00 00    movl   $0x13,-0x4(%rbp)
66b:   c7 45 f8 96 03 00 00    movl   $0x396,-0x8(%rbp)
672:   8b 45 f8                mov    -0x8(%rbp),%eax
675:   0f af 45 f8             imul   -0x8(%rbp),%eax
679:   99                      cltd
67a:   f7 7d fc                idivl  -0x4(%rbp)
67d:   89 c2                   mov    %eax,%edx
67f:   8b 45 fc                mov    -0x4(%rbp),%eax
682:   01 d0                   add    %edx,%eax
684:   89 45 f4                mov    %eax,-0xc(%rbp)
687:   8b 45 f4                mov    -0xc(%rbp),%eax
```

因为左侧的机器码都是机器相关的，所以需要参照 Intel 的参考文档才能阅读。

比如：`movl $0x13, -0x4(%rbp)` 为什么会编译成 `c7 45 fc 13 00 00 00`，而 `movl $0x396,-0x8(%rbp)` 为什么编译成 `c7 45 f8 96 03 00 00`。

姑且猜测一下：

* `c7`是操作符 `movl`
* `fc/f8` 是 `-0x4(%rbp)`
* `13 00` 是 `19` 的 16 进制
* `96 03` 是 `918` 的 16 进制
* `8b` 是 `mov <reg>`，第二个地址可能存在一个默认值 `%eax`
* `0f af` 是 `imul`
* `fc` 是 `idivl`

不猜了，还是看官方的定义吧。

下面参考的那文章当时是 **1, 2A, 2B, 2C, 3A, 3B, and 3C**，不知道过去了多少年，现在已经是 **1, 2A, 2B, 2C, 3A, 3B, 3C, 3D and 4**，也从 3k 页变成了近 5k 页；所以目录是个好东西，比如下图在 **Vol 2, 2.1 INSTRUCTION FORMAT...**

![指令语句格式](/img/2019/09/tUyvDzQElOjSo6i.png)

关于操作符的定义都在 **Vol 2, 3-5** 下面，对应的 **A-L**, **M-U**, **V-Z**，比如： `mov` 就在 **Vol 2, 4.3 INSTRUCTIONS (M-U) ** 的 **MOVE** 下面。

但是上面我们得到的汇编代码是 GAS 语法的，而 Intel 手册提供的是 Intel 的 NASM 语法。

因为花了几秒钟没找到自动转换的工具，所以对此人肉转化一下

```assembly
664:   c7 45 fc 13 00 00 00    mov   [rbp - 4], 13
66b:   c7 45 f8 96 03 00 00    mov   [rbp - 8], 396
672:   8b 45 f8                mov    eax, [rbp - 8]
675:   0f af 45 f8             imul   [rbp - 8], eax
679:   99                      cltd
67a:   f7 7d fc                idiv  [rbp - 4]
67d:   89 c2                   mov    edx, eax
67f:   8b 45 fc                mov    eax, [rbp - 4]
682:   01 d0                   add    edx, eax
684:   89 45 f4                mov    [rbp - 0xc], eax
687:   8b 45 f4                mov    eax, [rbp - 0xc]
```

先对必要的 Opcode 定义进行摘要

Opcode |  Instruction | Description
--- | --- | ---
89 /r | MOV r/m32,r32 |  Move r32 to r/m32
8B /r | MOV r32,r/m32 R |  Move r/m32 to r32.
C7 /0 id | MOV r/m32, imm32 | Move imm32 to r/m32.
REX.W + C7 /0 id | MOV r/m64, imm32 |  Move imm32 sign extended to 64-bits to r/m64.
0F AF /r | IMUL r32, r/m32 | doubleword register ← doubleword register ∗ r/m32.
F7 /7 | IDIV r/m32 | Signed divide EDX:EAX by r/m32, with result stored in EAX ← Quotient, EDX ← Remainder.
01 /r | ADD r/m32, r32 | Add r32 to r/m32

* **/digit** — A digit between 0 and 7 indicates that the ModR/M byte of the instruction uses only the r/m (register or memory) operand. The reg field contains the digit that provides an extension to the instruction's opcode.
* **/r** — Indicates that the ModR/M byte of the instruction contains a register operand and an r/m operand.
* **ib, iw, id, io** — A 1-byte (ib), 2-byte (iw), 4-byte (id) or 8-byte (io) immediate operand to the instruction that follows the opcode, ModR/M bytes or scale-indexing bytes. The opcode determines if the operand is a signed value. All words, doublewords and quadwords are given with the low-order byte first.

### 通用寄存器

Register Type | Without REX | With REX
--- | --- | ---
Byte Registers | AL, BL, CL, DL, AH, BH, CH, DH | AL, BL, CL, DL, DIL, SIL, BPL, SPL, R8L - R15L
Word Registers | AX, BX, CX, DX, DI, SI, BP, SP | AX, BX, CX, DX, DI, SI, BP, SP, R8W - R15W
Doubleword Registers | EAX, EBX, ECX, EDX, EDI, ESI, EBP, ESP | EAX, EBX, ECX, EDX, EDI, ESI, EBP, ESP, R8D - R15D
Quadword Registers | N.A. | RAX, RBX, RCX, RDX, RDI, RSI, RBP, RSP, R8 - R15

举个例子：

```assembly
664:   c7 45 fc 13 00 00 00    mov   [rbp - 4], 13
```

首先找到 MOVE，有个对应的 `MOV r/m64, imm32`，`rbp` 是寄存器上表中的关键字，`imm64` 是 32 位立即数，即 13.

所以选中的 **Opcode**是 `REX.W + C7 /0 id`，因为没有 **SIB**，所以忽略 `REX.W`；其中 `/0` 是在下一个阶段 **ModR/W** 中使用。

> 这块咋回事等等把 **A Beginners’ Guide to x86-64 Instruction Encoding** 翻译了再看。

参照最开始的 指令语句格式，在 **Reg/Opcode** 中，当 **Opcode** 段包含 **/digit** 时，其 **Reg/Opcode** 为拓展的 **Opcode**;

而 **Mod** 段为 `[RBP - 4]`，在 Intel 的手册中并没有关于 64 位寄存器的表格，所以通过 **Vol. 2A 3-2** 下面的 **Reg Field** 进行推导，也就是 **R/M** 为 `101`，而 **Mod** 因为`-4` 所为 `01`；之后加上 **Displacement** 字段进行偏移，即 `-4` 的补码 `1111 1100`，即 `FC`。

最后是 **Immediate** 段，也就是 `13H`。

最后把几个段，拼接起来就是 `C7 45 FC 13 00 00 00`。

分析不动了，直接看 [Intel汇编指令格式解析][^5-3] 下面的例子比较靠谱。**

[^5-1]: [简单学习看机器码的方法](https://www.cnblogs.com/guocai/archive/2012/10/18/2730048.html)

[^5-2]: [Linux 汇编器：对比 GAS 和 NASM]: (https://www.ibm.com/developerworks/cn/linux/l-gas-nasm.html)

[^5-3]: [Intel汇编指令格式解析]: (https://www.cnblogs.com/dongc/p/10727457.html)

[^5-4]: [x86-64 位的指令分析]: (https://www.systutorials.com/72643/beginners-guide-x86-64-instruction-encoding/)

## 机器语言 -> 物理电路

首先是通过规范化（布尔函数），解决电压不稳定的问题，转化为 01，赋予了电路表达**状态**的能力；并随后通过逻辑门的组合进行计算。

简要概括 CPU 的作用原理就是 **`Clock` 驱动 `Control Unit`，从 `RAM` 中读取指令，调度 `ALU` 计算结果，操作 `Register`，并写入 `RAM`，整个流程称之为一个时钟周期（1Hz）。**

通过上面这句话就不难发现 CPU 在物理层面上，至少包含 `Clock`, `Control Unit`, `ALU`, `Register`。以及在计算时需要一个外部的 `RAM`，甚至在哈佛架构，需要更多个 `RAM`。

`Clock` 就是晶体振荡器；给予电路有节律的脉冲信号，这信号赋予电路改变其**状态**的能力。

`Register` 和 `RAM` 本是一家，只是按照需求被分割 2 地，都是对寄存器和多路复用器的封装，用于将可变的脉冲信号持久化。寄存器来源于锁存器，锁存器能把用户的输入储存下来，而寄存器对他增加了可编辑的能力；多路复用器是为了简化对寄存器矩阵的操作。

`Control Unit` 是 CPU 的调度器，它加载和写入 `RAM` 的数据，并调度 `ALU` 计算结果。

`ALU` 是 CPU 的计算核心，在我们通过 `Control Unit` 选择了合适的 `ALU` 之后，就会把需要处理的 `Register`，立即数 丢进去处理。

举个例子：

![1569166047375.png](/img/2019/09/hqlt2FbnimTj8rG.png)

无力拓展，这个视频讲的无比形象，[《8、中央处理器 CPU（The Central Processing Unit (CPU)）》](https://www.bilibili.com/video/av48237550)

## 算数逻辑单元 -> 逻辑门

通过晶体管控制信号流动，来改变输出。再通过组合实现下面几个基本逻辑开关。

`AND`,`OR`（并联）, `NOT`（接地短路）, `XOR`

A `XOR` B = (`NOT` A `AND` B) `AND` (A `OR` B)

之后再通过上述 4 个基本逻辑，实现下面的组合逻辑。 



### 例子：加法器

$$
\begin{equation}
\begin{split}
19 + 918 &= 0\times13 + 0\times396\\
		 &= 0001\space0011 + 0011\space1001\space0110\\
		 &= (0011)(0001 + 1001)(0011+0110)\\
		 &= 0011\space1010\space1001\\
		 &= 0\times3A9\\
		 &= 937
\end{split}
\end{equation}
$$

`HALF ADDER`（`XOR` + `AND` 组合）

`FULL ADDER`（`HALF ADDER` + `OR` + `HALF ADDER` 组合）

`8-BIT RIPPLE CARRY ADDER`（`HALF ADDER` + 7 * `FULL ADDER` 组合）

![1569076200936.png](/img/2019/09/NWfuFR9Oj7vP4mp.png)

### 例子：检查是否为 0？

![1569125755153.png](/img/2019/09/3ziCKtkJsFTGfjp.png)

## 逻辑门 -> 晶体管

最早的计算机，所有的开关均是使用机械结构，通电控制开关的闭合；直到真空管解决的机械结构的损耗和速率问题；随后二极管出现，推进了计算机小型化和性能的巨大提升。

![1569166335470.png](/img/2019/09/udwU1yi2BEGKxml.png)

无论采用什么方案，最原始的机械结构的作用一直没有发生变化。

![1569166395357.png](/img/2019/09/WGlVhSCnXsBDTzr.png)

当控制输入输入高电平，会形成磁场，吸引周围的开关闭合，形成通路。

最后的二极管，也只是改变了开关的材料和原理，具体原理参见 [晶体管的原理]([http://www.i-element.org/%E6%99%B6%E4%BD%93%E7%AE%A1%E7%9A%84%E5%8E%9F%E7%90%86/](http://www.i-element.org/晶体管的原理/))。

## 参考

[^9-1]: [大话 CPU](https://legacy.gitbook.com/book/lj72808up/-coreprocessor/details)

[^9-2]: 大话处理器处理器基础知识读本

[^9-3]: 自己动手写 CPU

[^9-4]: [CPU体系架构-ARM/MIPS/X86](https://nieyong.github.io/wiki_cpu/)

[^9-5]: [计算机如何计算的？](https://space.bilibili.com/15598814/channel/detail?cid=70171)

## 附录

### MCU(Microcontroller) VS Microprocessor

MCU 微型控制器，包含 Microprocessor(CPU), ROM,  RAM 和 I/O 设备，但是被封装在单个封装中。

[What is the difference between microprocessor and microcontroller?](https://circuitdigest.com/article/what-is-the-difference-between-microprocessor-and-microcontroller)