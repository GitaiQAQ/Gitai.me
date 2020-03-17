title: C 语言题库Ⅱ
date: 2016-12-10 22:43:43
tags:
	- C
	- 题库
---



第四章 最简单的C程序设计——顺序程序设计
=====================================================================

## 单项选择题

1．`printf` 函数中用到格式符 `%5s` ，其中数字5表示输出的字符串占用 5 列，如果字符串长度大于 5，则输出按方式（ __B__ ）。
    
    A) 从左起输出该字符串，右补空格    
    B) 按原字符长从左向右全部输出    
    C) 右对齐输出该字串，左补空格    
    D) 输出错误信息    

2．已有定义 `int a= -2;` 和输出语句 `printf(“%8x”,a);` 以下正确的叙述是（ __D__ ）。
     
    A) 整型变量的输出形式只有%d一种    
    B) %x 是格式符的一种，它可以适用于任何一种类型的数据    
    C) %x 是格式符的一种，其变量的值按十六进制输出，但%8x是错误的    
    D) %8x 不是错误的格式符，其中数字 8 规定了输出字段的宽度    
3．若 x, y 均定义成 int 型，z 定义为 double 型，以下不合法的 scanf 函数调用语句是（ __D__ ）。
    
    A) scanf(“%d %x, %le”, &x, &y, &z);    
    B) scanf(“%2d *%d, %lf”, &x, &y, &z);    
    C) scanf(“%x %*d %o”, &x, &y);    
    D) scanf(“%x %o%6.2f”, &x, &y, &z);

4．以下程序的输出结果是（ __D__ ）。
```C
main( ){
    int k=17；
    printf("%d，%o，%x\n"，k，k，k)；
}
``` 
    
    A)17，021，0x11   
    B)17，17，17   
    B)17，0x11，021    
    D)17，21，11

5．下列程序的运行结果是（ __B__ ）。
```C
#include <stdio.h>
main(){
    int a=2,c=5;
    printf("a=%d,b=%d\n",a,c);
}
```
    
    A) a=%2,b=%5     
    B) a=2,b=5     
    C) a=d,b=d    
    D) a=2,c=5   

6．语句 `printf("a\bre\'hi\'y\\\bou\n");` 的输出结果是（ __C__ ）。(说明:'\b'是退格符)
    
    A) a\bre\'hi\'y\\\bou    
    B) a\bre\'hi\'y\bou    
    C) re'hi'you    
    D) abre'hi'y\bou

7．x、y、z被定义为int型变量，若从键盘给x、y、z输入数据，正确的输入语句是（ __B__ ）。
    
    A) INPUT x、y、z;     
    B) scanf("%d%d%d",&x,&y,&z);     
    C) scanf("%d%d%d",x,y,z);    
    D) read("%d%d%d",&x,&y,&z);     

8．若变量已正确说明为float类型，要通过语句scanf("%f %f %f ",&a,&b,&c); 给a赋于10.0，b赋予22.0，c赋予33.0，不正确的输入形式是（ __B__ ）：
    
    A)  10<回车>    
         22<回车> 
         33<回车>  
    B) 10.0,22.0,33.0<回车>      
    C) 10.0<回车>     
        22.0  33.0<回车> 
    D) 10  22<回车> 
        33<回车>   
 
9．以下程序的输出结果是（ __A__ ）。
```C
main(){
    int n;
    (n=6*4,n+6),n*2;
    printf(“n=%d\n”,n);
}
```

    A) 24　　　　　
    B) 12　　　　　
    C) 26　　　　　
    D) 20

10．以下程序的输出结果是（ __B__ ）。
```C
main(){
    int x=2,y,z;
    x*=3+1;
    printf(“%d,”,x++);
    x+=y=z=5;
    printf(“%d,”,x);
    x=y=z;
    printf(“%d\n”,x);
}
```
    
    A) 8,14,1　　　　    
    B) 8,14,5　　　　       
    C) 8,13,5　　     　　   
    D)9,14,5     

11．下面程序的输出结果是（ __C__ ）。
```C
main(){
    int x, y, z;
    x=0;y=z=-1;
    x+=-z---y;
    printf(“x=%d\n”,x);
}
```
     
    A) x=4　　　　    
    B) x=0　　　　    
    C) x=2　　　　    
    D) x=3

12．设 x 为 int 型变量，则执行语句 `x=10; x+=x-=x-x;` 后，x 的值为（ __B__ ）。
    
    A) 10　　　　
    B) 20　　　　
    C) 40　　　　
    D) 30

13．只能向终端输出一个字符的函数是（ __B__ ）。
    
    A) printf函数　　　　　     
    B) putchar函数    
    C) getchar函数　　　　　    
    D) scanf函数

<i class="icon-asterisk"/>14．下列程序执行后的输出结果是(小数点后只写一位)（ __A__ ）。
```C 
main(){
    double d;
    float f;
    long l;
    int i;
    i=f=l=d=20/3;
    printf("%d %ld %f %f \n", i,l,f,d);
}
```

    A) 6  6  6.0  6.0　　　　    
    B) 6  6  6.7  6.7    
    C) 6  6  6.0  6.7　　　　    
    D) 6  6  6.7  6.0

15．在下列叙述中，错误的一条是（ __C__ ）。
 
    A) printf函数可以向终端输出若干个任意类型的数据   
    B) putchar函数只能向终端输出字符，而且只能是一个字符    
    C) getchar函数只能用来输入字符，但字符的个数不限    
    D) scanf函数可以用来输入任何类型的多个数据    

16．以下程序的输出结果为（ __B__ ）。
```C
main(){
    char c1=‘a’，c2=‘b’，c3=‘c’;
    printf(“a%cb%c\tc%c\n”,c1,c2,c3);
}
```
 
    A) abc  abc  abc　　　　　    
    B) aabb   cc　　　　　    
    C) a  b  c　　　　　    
    D) aaaa   bb

17．若输入12345和abc，以下程序的输出结果是（ __C__ ）。
```C
main(){
    int a;
    char ch;
    scanf(“%3d%3c”,&a,&ch);
    printf(“%d, %c” ,a, ch);
}
```
 
    A) 123, abc　　　　　   
    B) 123,4　　　　　    
    C) 123,a　　　　　    
    D) 12345,abc

18．以下程序的输出结果是（ __D__ ）。
```C
main(){
    unsigned x1;
    int b= -1;
    x1=b;
    printf("%u",x1);
}
```
 
    A) %u　　　　　    
    B) -1　　　　　    
    C) %u-1　　　　　   
    D) 65535

19．在 printf 函数中用来输出十六进制无符号整数的格式字符是（ __B__ ）。
 
    A) d格式符　　　　　    
    B) x格式符　　　　　    
    C) u格式符　　　　　     
    D) o格式符

20．设a=12、b=12345，执行语句printf(“%4d,%4d”,a,b)的输出结果为（ __B__ ）。
 
    A)   12, 123　　　　　    
    B)   12，12345　　　　　    
    C)   12, 1234　　　　　    
    D)   12, 123456

21．以下程序的输出结果是（ __C__ ）。
```C
#include<stdio.h>
#include<math.h>
main(){
 int a=1,b=4,c=2;
 float x=10.5, y=4.0, z;
 z=(a+b)/c+sqrt((double)y)*1.2/c+x;
 printf(“%f\n”, z);
}
```
 
    A) 14.000000　　　　　    
    B) 15.400000　　　　　    
    C) 13.700000　　　　　    
    D) 14.900000

<i class="icon-asterisk"/>22．以下程序的输出结果是（ __D__ ）。
```C
main(){
 int a=2, c=5;
 printf("a=%%d, b=%%d\n", a, c);
}
```
 
    A) a=%2, b=%5　　　　　　      
    B) a=%2, c=%5    
    C) a=%%d, b=%%d　　　　　    
    D) a=%d, b=%d

23．请读程序：
```C
main(){
 int a; 
 float b, c;
 scanf(“%2d%3f%4f”,&a,&b,&c);
 printf(“\na=%d, b=%f, c=%f\n”, a, b, c);
}
```
若运行时从键盘上输入9876543210<CR>（<CR>表示回车），则上面程序的输出结果是（ __C__ ）。
 
    A) a=98, b=765, c=4321　　　　　　　　　　　     
    B) a=10, b=432, c=8765      
    C) a=98, b=765.000000, c=4321.000000　　　　　    
    D) a=98, b=765.0, c=4321.0

24．若有定义：int x, y; char a, b, c; 并有以下输入数据（此处<CR>代表回车，∪代表空格）： 
```C
1∪2<CR>
A∪B∪C<CR>
```
则能给x赋整数1，给y赋整数2，给a赋字符A，给b赋字符B，给c赋字符C的正确程序段是（ __D__ ）。
 
    A) scanf(“x=%d, y=%d”, &x, &y); a=getchar( ); b=getchar( ); c=getchar( );    
    B) scanf(“%d %d”, &x, &y); a=getchar( ); b=getchar( ); c=getchar( );    
    C) scanf(“%d%d%c%c%c”, &x, &y, &a, &b, &c);    
    D) scanf(“%d%d%c%c%c%c%c%c”, &x, &y, &a, &a, &b, &b, &c, &c);

25．下列可作为C语言赋值语句的是（ __C__ ）。

    A) x=3, y=5; 　　　　　    
    B) a=b=6　　　　　    
    C) i--;　　　　　    
    D) y=int(x);

26．设 i 是 int 型变量，f 是 float 型变量，用下面的语句给这两个变量输入值： `scanf("i=%d, f=%f", &i, &f);` 为了把 100 和 765.12 分别赋给 i 和 f ，则正确的输入为（ __B__ ）。
 
    A) 100<空格>765.12<回车>　　　　　    
    B) i=100, f=765.12<回车>      
    C) 100<回车>765.12<回车>　　　　　    
    D) x=100<回车>y=765.12<回车>

27．以下叙述中正确的是（ __D__ ）。
 
    A) 输入项可以是一个实型常量，例如：scanf("%f", 3.5);    
    B) 只有格式控制，没有输入项，也能正确输入数据到内存，例如：scanf("a=%d, b=%d");
    C) 当输入一个实型数据时，格式控制部分可以规定小数点后的位数，例如：scanf("%4.2f", &f);    
    D) 当输入数据时，必须指明变量地址，例如：scanf("%f", &f);

28．设 x 和 y 均为 int 型变量，则以下语句：`x+=y; y=x-y; x-=y;` 的功能是（ __D__ ）。
 
    A) 把 x 和 y 按从小到大排序　　　　　    
    B) 把 x 和 y 按从大到小排序       
    C) 无确定结果　　　　　　　　　　　    
    D) 交换 x 和 y 中的值

## 填空题

<i class="icon-asterisk"/>1．下面程序的运行结果是  __`i: dec=4, oct=4, hex=4, unsigned=65531`__ 。
```C
main(){
 short  i;
 i= -4;
 printf("\ni: dec=%d, oct=%o, hex=%x, unsigned=%u\n", i, i, i, i);
}
```

2．若想通过以下输入语句使a=5.0，b=4，c=3，则输入数据的形式应该是 __5.0, 4, c=3__。
```C
int b，c； float a；scanf("%f，%d，c=%d"，&a，&b，&c)；
```

3．下列程序的输出结果是16.00，请填空。
```C
main(){ 
  int a=9, b=2;
    float x= ____, y=1.1,z;
    z=a/2+b*x/y+1/2;
    printf("%5.2f\n", z); 
}
```
```C
main(){ 
  int a=9, b=2;
    float x=6.6, y=1.1,z;
    z=a/2+b*x/y+1/2; //4+2x/1.1+0=16.00
    printf("%5.2f\n", z); 
}
```

4．在printf格式字符中，
只能输出一个字符的格式字符是 __%c__ ；
用于输出字符串的格式字符是 __%s__ ；
以小数形式输出实数的格式字符是 __%f__ ；
以标准指数形式输出实数的格式字符是 __%e__ 。


## 编程题

1. 若 `a=3, b=4, c=5, x=1.2, y=2.4, z= -3.6, u=51274, n=128765, c1='a', c2='b'`。想得到以下的输出格式和结果，请写出完整的程序（包括定义变量类型和设计输出）。
要求输出的结果如下：

```C
a= <空格>3 <空格><空格> b= <空格> 4<空格><空格> c= <空格>5 
x=1.200000, y=2.400000, z= -3.600000
x+y=<空格>3.60<空格><空格> y+z = -1.20<空格><空格>z+x= -2.40
u=<空格>51274<空格><空格>n=<空格><空格><空格>128756
c1= a <空格>or<空格>97(ASCII)
c2= B <空格>or<空格>98(ASCII)
```

```C
a= 3  b= 4  c= 5 
x=1.200000, y=2.400000, z=-3.600000
x+y= 3.60  y+z = -1.20  z+x= -2.40
u= 51274  n=   128756
c1= a or 97(ASCII)
c2= B or 98(ASCII)
```

```CC
#include <stdlib.h>
#include <stdio.h>

int main(){
    int a=3, b=4, c=5;
    float x=1.2, y=2.4, z= -3.6;
    long int u=51274, n=128765;
    char c1='a', c2='b';
    
    printf("a= %d  b= %d  c= %d\nx=%f, y=%f, z=%f\nx+y= %.2f  y+z = %.2f  z+x= %.2f\nu=%6d  n=%10d\nc1= %c or %d(ASCII)\nc2= %c or %d(ASCII)\n", 
        a,b,c,
        x,y,z,
        x+y, y+z, z+x,
        u,n,
        c1,c1,
        c2-32,c2);
}
```

```shell
$ ./c
a= 3  b= 4  c= 5
x=1.200000, y=2.400000, z=-3.600000
x+y= 3.60  y+z = -1.20  z+x= -2.40
u= 51274  n=    128765
c1= a or 97(ASCII)
c2= B or 98(ASCII)
```

<!--nextpage-->
2. 输入一个华氏温度，要求输出摄氏温度。公式为
  $$C=\frac{5}{9}(F-32)$$
: 输出要有文字说明，取2位小数。

```C
#include <stdio.h>

int main(){
    float F=0;
    scanf("%f", &F);
    printf("F= %2f, C=%2f\n", F, (F-32)*5.0/9.0);
}
```

3. 编程序，用 getchar 函数读入两个字符给 c1、c2 ，然后分别用 putchar 函数和 printf 函数输出这两个字符。

```C
#include <stdio.h>
int main(){
    char c1,c2;
    c1=getchar();
    c2=getchar();
    printf("c1=%c, c2=", c1);
    putchar(c2);
    putchar('\n');
}
```


第五章 选择结构程序设计
=====================================================================

## 单项选择题

1．逻辑运算符两侧运算对象的数据类型是（ __D__ ）。

    
    A) 只能是0或1    
    B) 只能是0或非0正数    
    C) 只能是整型或字符型数据    
    D) 可以是任何类型的数据    

<!-- more -->

2．已知 `x=43, ch='A', y=0；` 则表达式 `(x>=y&&ch<'B'&&!y)` 的值是（ __C__ ）。
    
    A) 0     
    B) 语法错    
    C) 1    
    D) "假"    

<i class="icon-asterisk"/>3．已知 `int x=10, y=20, z=30;` 以下语句执行后 x, y, z 的值是（ __B__ ）。
```C
if(x>y)
    z=x;x=y;y=z;
```

    A) x=10,y=20,z=30    
    B) x=20,y=30,z=30    
    C) x=20,y=30,z=10    
    D) x=20,y=30,z=20
 
4．执行下列语句后 a 的值为，b 的值为（ __C__ ）。
```C
int a, b, c;
a=b=c=1;
++a|| ++b && ++c;
```
     
    A) 错误  1    
    B) 2  2    
    C) 2  1    
    D) 1  1

<i class="icon-asterisk"/>5．若希望当 A 的值为奇数时，表达式的值为 “真”，A 的值为偶数时，表达式的值为 “假”，则以下不能满足要求的表达式是（ __C__ ）。
     
    A) A%2==1    
    B) !(A%2==0)    
    C) !(A%2)      
    D) A%2


6．设有：`int a=1,b=2,c=3,d=4,m=2,n=2;` 执行 `(m=a>b)&&(n=c>d)` 后 n 的值是（ __B__ ）。
     
    A) 0    
    B) 2    
    C) 3    
    D) 4
 
7．判断 char 型变量 cl 是否为小写字母的正确表达式是（ __D__ ）。
     
    A) 'a'<=cl<='z'    
    B) (cl>=a)&&(cl<=z)    
    C) ('a'>=cl)||('z'<=cl)    
    D) (cl>='a')&&(cl<='z')

8．以下不正确的if语句形式是（ __C__ ）。
 
    A) if(x>y&&x!=y);    
    B) if(x==y) x+=y;     
    C) if(x!=y) scanf("%d",&x) else scanf("%d",&y)   
    D) if(x<y) {x++;y++;}

9．请阅读以下程序：
```C
main(){
   int a=3,b=1,c=0;
   if(a=b+c) printf("***\n");
   else      printf("$$$\n");
}
```
以上程序（ __D__ ）。
     
    A) 有语法错不能通过编译    
    B) 可以通过编译但不能通过连接    
    C) 输出***    
    D) 输出$$$

10．当 `a=1,b=3,c=5,d=4` 时，执行完下面一段程序后 x 的值是（ __B__ ）。
```C
if(a<b)
    if(c<d) x=1;
    else
        if(a<c)
            if(b<d) x=2;
            else x=3;
        else x=6;
else x=7;
```
    
    A) 1     
    B) 2     
    C) 3    
    D) 6

11．以下程序的输出结果是（ __C__ ）。
```C
main(){
    int a=100,x=10,y=20,ok1=5,ok2=0;
    if(x<y)
        if(y!=10)
            if(!ok1)
                a=1;
            else
                if(ok2) a=10;
    a=-1;
    printf("%d\n",a);
}
```
    
    A) 1    
    B) 10    
    C) -1    
    D) 值不确定

12．以下程序的输出结果是（ __B__ ）。
```C
main(){
    int x=2,y=-1,z=2;
    if(x<y)
        if(y<0) z=0;
        else    z+=1;
    printf(“%d\n”,z);
}
```
    
    A) 3    
    B) 2    
    C) 1    
    D) 0

13．为了避免在嵌套的条件语句 if - else 中产生二义性，C语言规定：else子句总是与（ __B__ ）配对。
    
    A) 缩排位置相同的if    
    B) 其之前最近的if    
    C) 其之后最近的if    
    D) 同一行上的

14．若有条件表达式  `(exp)?a++:b--` ，则以下表达式中能完全等价于表达式(exp)的是（ __B__ ）。
    
    A) (exp==0)    
    B) (exp!=0)    
    C) (exp==1)    
    D) (exp!=1)

15．若运行时给变量 x 输入 12，则以下程序的运行结果是（ __A__ ）。
```C
main(){
    int x,y;
    scanf("%d",&x);
    y=x>12?x+10:x-12;
    printf("%d\n",y); 
}
```
    
    A) 0    
    B) 22    
    C) 12    
    D) 10

16．语句: `printf("%d"，(a=2)&&(b=-2))；`的输出结果是（ __D__ ）。
    
    A) 无输出    
    B) 结果不确定    
    C) -1    
    D) 1

17．当 c 的值不为 0 时，在下列选项中能正确将 c 的值赋给变量 a、b 的是（ __C__ ）。
    
    A) c=b=a;    
    B) (a=c)||(b=c);    
    C) (a=c)&&(b=c);    
    D) a=c=b;

18．能正确表示 a 和 b 同时为正或同时为负的表达式是（ __D__ ）。

    A) (a>=0||b>=0)&&(a<0||b<0)    
    B) (a>=0&&b>=0)&&(a<0&&b<0)     
    C) (a+b>0)&&(a+b<=0)     
    D) a*b>0    

19．能正确表示逻辑关系：“ `a≥10` 或 `a≤0` ” 的C语言表达式是（ __D__ ）。
    
    A) a>=10 or a<=0    
    B) a>=0|a<=10    
    C) a>=10&&a<=0    
    D) a>=10||a<=0

20．有如下程序段
```C
int a=14,b=15,x;
char c='A';
x=(a&&b)&&(c<'B');
```
执行该程序段后，x 的值为（ __D__ ）。
     
    A) ture    
    B) false    
    C) 0    
    D) 1

21．以下程序的输出结果是（ __C__ ）。
```C
int main(){
    int a=-1, b=1, k;
    if((++a<0)&&!(b--<=0))
        printf("%d %d\n", a, b);
    else
        printf("%d %d\n", b, a);
}
```
    
    A)-1  1    
    B)0  1    
    C)1  0    
    D)0  0

22．与 `y=(x>0?1:x<0?-1:0);` 的功能相同的if语句是（ __A__ ）。

A) 
```C
if(x>0) y=1;
else if(x<0) y=-1;
else y=0;
```
B) 
```C
if(x)
    if(x>0)y=1;
    else if(x<0)y=-1;
    else y=0;
```
C) 
```C
y=-1
if(x)
    if(x>0)y=1;
    else if(x==0)y=0;
```
D) 
```C
y=0;
if(x>=0)
    if(x>0)y=1;
    else y=-1;
else y=-1;
```

23．阅读以下程序：
```C
main(){
    int x;
    scanf("%d", &x);
    if(x--<5)
        printf("%d", x);
    else
        printf("%d", x++);
}
```
程序运行后，如果从键盘上输人 5 ，则输出结果是（ __B__ ）。
     
    A) 3    
    B) 4　    
    C) 5    
    D) 6

24．假定w、x、y、z、m均为int型变量，有如下程序段：
```C
w=1;
x=2;
y=3;
z=4;

m=(w<x)?w:x;
m=(m<y)?m:y;
m=(m<z)?m:z;
```
则该程序运行后，m的值是（ __D__ ）。
 
    A) 4    
    B) 3    
    C) 2    
    D) 1

25．有如下程序 
```C
main( ){ 
    float x=2.0,y; 
    if(x<0.0) 
        y=0.0; 
    else if(x<10.0) 
        y=1.0/x;
    else y=1.0;
    printf("%f\n",y); 
}
```
该程序的输出结果是（ __C__ ）。
    
    A) 0.000000    
    B) 0.250000    
    C) 0.500000    
    D) 1.000000
    
26．有如下程序 
```C
main(){
    int a=2,b=-1,c=2; 
    if(a)
        if(b<0) c=0; 
        else c++;
    printf("%d\n",c); 
}
```
该程序的输出结果是（ __A__ ）。
    
    A) 0    
    B) 1    
    C) 2    
    D) 3

<i class="icon-asterisk"/>27．若有定义: `float w; int a, b;` 则合法的switch语句是（ __D__ ）。

A)  
```C
switch(w){
  case 1.0: printf("*\n");
  case 2.0: printf("**\n");
}
```
B)
```C
switch(x){
  case 1,2: printf("*\n");
  case 3: printf("**\n");
}
```
C)
```C
switch(b){
  case 1: printf("*\n");
  default: printf("\n");
  case 1+2: printf("**\n");
}
```
D)
```C
switch(a+b);{
  case 1: printf("*\n");
  case 2: printf("**\n");
  default: printf("\n");
}
```

<i class="icon-asterisk"/>28．若 a、b、c1、c2、x、y 均是整型变量，正确的 switch 语句是（ __D__ ）。

A)  
```C
swich(a+b);{
  case 1:
      y=a+b; 
      break;
  case 0:
      y=a-b; 
      break; 
}
```
B)  
```C
switch(a*a+b*b){
  case 3:
  case 1:
      y=a+b;
      break;
  case 3:
      y=b-a;
      break;
}    
```
C)  
```C
switch a {
  case c1 :
      y=a-b; 
      break;
  case c2: 
      x=a*d; 
      break;   
  default:
    x=a+b;
}
```
D)  
```C
switch(a-b){
  default:
      y=a*b;
      break;
  case 3:
  case 4:
      x=a+b;
      break;
  case 10:
  case 11:
      y=a-b;
      break;
}
```

29．有如下程序 
```C
main( ){
  int x=1,a=0,b=0;
  switch(x){ 
    case 0: b++; 
    case 1: a++; 
    case 2: a++;b++; 
  }
  printf("a=%d,b=%d\n",a,b);
}
```
该程序的输出结果是（ __A__ ）。
    
    A)  a=2,b=1    
    B)  a=1,b=1    
    C)  a=1,b=0    
    D)  a=2,b=2


30．当输入 19、2、21 时，以下程序的输出结果是（ __A__ ）。
```C
main( ){
  int a,b,c,max;
  printf(“please input three numbers a,b,c:\n”);
  scanf(“%d,%d,%d”,&a,&b,&c);

  max=a;
  if(max<b)
    max=b;
  if(max<c)
    max=c;
  printf(“max is:%d\n”,max);
} 
```
    
    A) max is:21    
    B) max is:19    
    C) max is:42    
    D) max is:40

31．若输入 B，以下程序的输出结果是（ __C__ ）。
```C
main( ){
  char grade;
  scanf("%c",&grade);
  switch(grade){
    case 'A':printf(">=85.");
    case 'B':
    case 'C':printf(">=60.");
    case 'D':printf("<60.");
    default: printf("error.");
  }
} 
```
    
    A) >=85.    
    B) >=60.    
    C) >=60.<60.error.    
    D) error.

32．当执行以下语句后的输出结果是（ __D__ ）。
```C
int x=3, y=0;
printf("%d,%d", -1>x>-10 && 1<x<10, -1>y>-10 && 1<y<10);
```
    
    A)  0   3    
    B)  3   0    
    C)  3   3    
    D)  1   1

33．执行 `x=5>1+2&&2||2*4<4-!0` 后，x 的值为（ __C__ ）。
     
    A)  －1    
    B)  0    
    C)  1    
    D)  5

34．以下程序的输出结果为（ __C__ ）。
```C
main( ){
  int a,b,c,x,y,z;
  a=10;
  b=2;
  c=!(a%b);//1
  x=!(a/b);//0
  y=(a<b)&&(b>=0);//0&&1=0
  z=(a<b)||(b>=0);//0||1=1
  printf("c=%d, x=%d, y=%d, z=%d\n", c, x, y, z);
} 
```
     
    A) c=0,x=1,y=1,z=0    
    B)  c=5,x=0,y=1,z=0    
    C)  c=1,x=0,y=0,z=1    
    D)  c=10,x=2,y=0,z=1
    
35．下列运算符中，不属于关系运算符的是（ __D__ ）。
     
    A)  <    
    B)  >=    
    C)  ==    
    D)  !

36．以下程序的输出结果是（ __B__ ）。
```C
main( ){
  int a,b,d=241;
  a=d/100%9;//2
  b=(-1)&&(-1);//1
  printf("%d, %d\n", a, b);

}
```
     
    A) 6,1    
    B) 2,1    
    C) 6,0    
    D) 2,0

37．设 ch 是 char 型变量，其值为 A，且有下面的表达式： `ch=(ch>='A'&&ch<='Z')?(ch+32):ch` 上面表达式的值是（ __B__ ）。
     
    A)  A    
    B)  a    
    C)  Z    
    D)  z

38．若k是int型变量，且有下面的程序片段：
```C
k= -3;
if(k<=0)  printf("####")
else  printf("&&&&")
```
上面程序片段的输出结果是（ __D__ ）。
    
    A)  ####    
    B)  &&&&    
    C)  ####&&&&    
    D)  有语法错误，无输出结果

39．请读程序：
```C
main(){
  float x, y;
  scanf("%f", &x);
  if(x<0.0) y=0.0;
  else if((x<5.0)&&(x!=2.0))
    y=1.0/(x+2.0);
  else if(x<10.0) y=1.0/x;
  else y=10.0;
  printf("%f\n",y);
}
```
若运行时从键盘上输入 2.0<CR> (<CR>表示回车)，则上面程序的输出结果是（ __C__ ）。
     
    A)  0.000000    
    B)  0.250000    
    C)  0.500000    
    D)  1.000000

40．请读程序：
```C
main(){
  int x=1, y=0, a=0, b=0;
  switch(x){
    case 1:
      switch(y){
        case 0:
          a++;
          break;
        case 1:
          b++;
          break;
      }
    case 2:
      a++;
      b++;
      break;
  }
  printf("a=%d, b=%d\n", a, b);
}
```
上面程序的输出结果是（ __A__ ）。
     
    A)  a=2,b=1    
    B)  a=1,b=1    
    C)  a=1,b=0    
    D)  a=2,b=2

41．为表示关系 `x≥y≥z` ，应使用C语言表达式（ __A__ ）。
     
    A)  (x>=y)&&(y>=z)    
    B)  (x>=y)AND(y>=z)    
    C)  (x>=y>=z)    
    D)  (x>=y)||(y>=z)

42．若要求在 if 后一对圆括号中表示 a 不等于 0 的关系，则能正确表示这一关系的表达式为（ __D__ ）。
    
    A)  a<>0    
    B)  !a    
    C)  a=0    
    D)  a

43．两次运行下面的程序，如果从键盘上分别输入 6 和 4 ，则输出结果是（ __A__ ）。
```C
main(){
 int x;
 scanf("%d", &x);
 if(x++>5) printf("%d", x);
 else printf("%d\n", x--);
}
```
 
    A)  7和5    
    B)  6和3    
    C)  7和4    
    D)  6和4

44．以下程序的输出结果是（ __D__ ）。
```C
main(){
 int a= -1, b=4, k;
 k=(++a<0)&&!(b--<=0);//0
 printf("%d%d%d\n", k, a, b);
}
```
 
    A)  104    
    B)  103    
    C)  003    
    D)  004

45．设 a 为整型变量，不能正确表达数学关系 `10<a<15` 的 C 语言表达式是（ __A__ ）。
 
    A)  10 < a < 15    
    B)  a==11||a==12||a==13||a==14    
    C)  a>10&&a<15    
    D)  !(a<=10)&&!(a>=15)

46．假定所有变量均已正确说明，下列程序段运行后 x 的值是（ __B__ ）。
```C
a=b=c=0;
x=35;
if(!a) x--;
else if(b); 
if(c) x=3;
else x=4;
```
    
    A)  34    
    B)  4    
    C)  35    
    D)  3

47．设 `a=1, b=2, c=3, d=4` ，则表达式 `a<b?a:c>d?a:d` 的结果是（ __D__ ）。
     
    A)  4    
    B)  3    
    C)  2    
    D)  1

48．当 `a=1, b=3, c=5, d=4` 时，执行下面一段程序后，x 的值为（ __B__ ）。
```C
if(a<b)
  if(c<b)  x=1;
  else
    if(a<c)
      if(b<d)  x=2;
      else  x=3;
    else  x=6;
else  x=7;
```
 
    A)  1    
    B)  2    
    C)  3    
    D)  6

49．在执行以下程序时，为了使输出结果为 `t=4` ，则给a和b输入的值应满足的条件是（ __C__ ）。
```C
main(){
    int s, t, a, b;
    scanf("%d, %d", &a, &b);
    s=1;
    t=1;
    if(a>0) s=s+1;
    if(a>b) t=s+t;
    else if(a==b)  t=5;
    else t=2*s;
    printf("t=%d\n", t);
}
```
     
    A)  a>b    
    B)  a<b<0    
    C)  0<a<b    
    D)  0>a>b

50．设 `int x=1, y=1;` 表达式 `(!x||y--)` 的值是（ __B__ ）。
     
    A)  0    
    B)  1    
    C)  2    
    D)  －1

51．若变量 a、i 已正确定义，且 i 已正确赋值，合法的语句是（ __B__）。
     
    A)  a==1    
    B)  ++i;    
    C)  a=a++=5;    
    D)  a=int(i);

52．以下程序的输出结果为（ __C__ ）。
```C
main(){
 int a=2, b=-1, c=2;
 if(a<b)
   if(b<0)  c=0;
   else  c++;
 printf("%d\n",c);
}
```
     
    A)  0    
    B)  1    
    C)  2    
    D)  3

## 填空题
1．若从键盘输入 58,则以下程序输出的结果是 __585858__ 。
```C
main(){
  int a;
  scanf("%d",&a);
  if(a>50) printf("%d",a);
  if(a>40) printf("%d",a);
  if(a>30) printf("%d",a);
}
```

2．下面程序的运行结果是 __-1__ 。
```C
main(){
 int a=2, b=3, c;
 c=a;
 if(a>b)  c=1;
 else  if(a==b)  c=0;
 else  c=-1;
 printf(“%d\n”,c);
}
```

3．以下程序实现：输入三个整数，按从大到小的顺序进行输出。请填空。
```C
main(){
 int  x, y, z, c;
 scanf("%d %d %d", &x, &y, &z);
 if( _____ )  { c=x; x=y; y=c;}
 if( _____ )  { c=x; x=z; z=c;}
 if( _____ )  { c=y; y=z; z=c;}
 printf("%d  %d  %d", x, y, z);
}
```
```C
main(){
 int  x, y, z, c;
 scanf("%d %d %d", &x, &y, &z);
 if( x<y ){c=x;x=y;y=c;}
 if( x<z ){c=x;x=z;z=c;}
 if( y<z ){c=y;y=z;z=c;}
 printf("%d  %d  %d", x, y, z);
}
```

4．如果运行时输入字符Q，则下面程序的运行结果是 __Q__。
```C
main(){
 char  ch;
 scanf(“%c”, &ch);
 ch=(ch>=‘A’&& ch<=‘Z’)? (ch+32):ch;
 ch=(ch>=‘a’&& ch<=‘z’)? (ch-32):ch;
 printf(“%c”, ch);
}
```

5．若 x 为 int 类型,请以最简单的形式写出与逻辑表达式 !x 等价的C语言关系表达式  __x==0__ 。

6．表示 “整数 x 的绝对值大于 5 ” 时值为 “真” 的 C 语言表达式是  __`x>5||x<-5`__ 。

7．下列程序段的输出结果是  __passwarn__ 。
```C
int n='c';
switch(n++){
  default: 
    printf("error");
    break;
  case 'a':
  case 'A':
  case 'b':
  case 'B':
    printf("good");
    break;
  case 'c':
  case 'C':
    printf("pass");
  case 'd':
  case 'D':
    printf("warn");
}
```

8．以下程序将两个数从小到大输出。
```C
main(){
  float a, b,      ;
  scanf(           , &a, &b); 
  if(a>b){
    t=a;
        ; 
    b=t;
  }
  printf("%5.2f, %5.2f\n", a, b);
}
```
```C
main(){
  float a, b, t;
  scanf("%f %f", &a, &b); 
  if(a>b){
    t=a;
    a=b; 
    b=t;
  }
  printf("%5.2f, %5.2f\n", a, b);
}
```

9．若输入 ，以下程序的输出结果为 

```C
main(){
  long int num;
  int gw, sw, bw, qw, ww, place; 
  printf("请输入一个0～99999之间的整数：");
  scanf("%ld", &num);
  if(num>9999)  place=5;
  else if(num>999)  place=4;
  else if(num>99)  place=3;
  else if(num>9)  place=2;
  else  place=1;
  printf("place=%d,", place);
  printf("每位数字为: ");
  ww=num/10000;
  qw=(num-ww*10000)/1000;
  bw=(num-ww*10000-qw*1000)/100;
  sw=(num-ww*10000-qw*1000-bw*100)/10;
  gw=num-ww*10000-qw*1000-bw*100-sw*10;
  switch(place){
    case 5: printf("%d, %d, %d, %d, %d", ww, qw, bw, sw, gw); break;
    case 4: printf("%d, %d, %d, %d", qw, bw, sw, gw); break;
    case 3: printf("%d, %d, %d", bw, sw, gw); break;
    case 2: printf("%d, %d", sw, gw); break;
    case 1: printf("%d", gw); break;
  }
}
``` 
```shell
请输入一个0～99999之间的整数：8642
place=4,每位数字为: 8, 6, 4, 2
```

10．若输入1988，程序运行的结果为  __1988年是闰年。__；若输入1989，则结果为  __1989年不是闰年。__ 。
```C
main(){
  int year, leap;
  scanf("%d", &year);
  if(year%4) leap=0;
  else if(year%100) leap=1;
  else if(year%400) leap=0;
  else  leap=1;
  if(leap)  printf("%d年是闰年。\n", year);
  else  printf("%d年不是闰年。\n", year);
}
```

11．用以下程序把大写字母A~Z转换成对应的小写字母a ~ z，其他字符不转换。
```C
main(){
  char  ch;
  scanf (                ); 
  ch=(               )?ch+32:ch; 
  printf("char=%c\n", ch); 
}
```
```C
main(){
  char  ch;
  scanf ("%c", &ch); 
  ch=(ch>=65&&ch<=(65+26))?ch+32:ch; 
  printf("char=%c\n", ch); 
}
```

12．条件 `20<x<30` 或 `x<-100` 的C语言表达式是 __`(20<x && x<30)||x<-100`__ 。

13．若已知 `a=10, b=20` ,则表达式 `!a<b` 的值为  __1__ 。

14．若已定义 `int a=25, b=14, c=19;` 以下三目运算符 `（?:）` 所构成的语句的执行结果是  __###a=26, b=13, c=20\n__ 。
```
a++<=25&&b--<=2&&c++?printf("***a=%d, b=%d, c=%d\n", a, b, c) : printf("###a=%d, b=%d, c=%d\n", a, b, c);
```

15．以下两条 if 语句可合并成一条 if 语句为
```C
if(a<=b) x=1;
else  y=2;
if(a>b)  printf("**** y=%d\n", y);
else  printf("#### x=%d\n", x);
```

```C
if(a<=b){ 
    x=1;
    printf("#### x=%d\n", x);
}else{
    y=2;
    printf("**** y=%d\n", y);
}
```
