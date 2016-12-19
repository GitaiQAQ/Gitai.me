title: C 语言题库Ⅲ
date: 2016-12-10 23:32:23
tags:
  - C
  - 题库
---


第六章 循环控制
=====================================================================

## 单项选择题

1．下面程序段的运行结果是（ __C__ ）。

```C
int n=0;
while(n++<=2);
  printf("%d",n);
```
    
    A)  2    
    B)  3    
    C)  4    
    D)  有语法错

2．设有程序段：
```C
t=0;
while(printf("*")){
  t++;
  if(t<3) break;
}
```
下面描述正确的是（ __D__ ）。
    
    A)  其中循环控制表达式与0等价    
    B)  其中循环控制表达式与'0'等价    
    C)  其中循环控制表达式是不合法的    
    D)  以上说法都不对

3．下面程序的功能是将从键盘输入的一对数，由小到大排序输出，当输入一对相等数时结束循环，请选择填空（ __B__ ）。
```C
#include <stdio.h>
main(){
  int a,b,t;
  scanf("%d%d",&a,&b);
  while( ____ ){
    if(a>b){
      t=a;a=b;b=t;
    }
    printf("%d,%d\n",a,b); 
    scanf("%d%d",&a,&b);
  }
}
```
    
    A)  !a=b    
    B)  a!=b    
    C)  a==b    
    D)  a=b

4．C语言中，while 和 do-while 循环的主要区别是（ __A__ ）。
    
    A)  do-while 的循环体至少无条件执行一次    
    B)  while 的循环控制条件比 do-while 的循环控制条件更严格    
    C)  do-while 允许从外部转到循环体内    
    D)  do-while 的循环体不能是复合语句

5．对以下程序段描述正确的是（ __C__ ）。
```C
x=-1;
do{x=x*x;}
while(!x);
```

    A)  是死循环    
    B)  循环执行二次    
    C)  循环执行一次    
    D)  有语法错误

6．以下描述中正确的是（ __X__ ）。
 
    A)  do-while 循环中循环体内不能使用复合语句    
    B)  do-while 循环由 do 开始，用 while 结束，在 while (表达式)后面不能写分号    
    C)  在 do-while 循环体中，一定要有能使 while 后面表达式的值变为零(“假”)的操作    
    D)  do-while 循环中，根据情况可以省略 while

7．若有如下语句
```C
int x=3;
do{ printf("%3d",x-=2);} while(!(--x));
```
则上面程序段（ __B__ ）。
 
    A)  输出的是 1    
    B)  输出的是 1 和 -2    
    C)  输出的是 3 和 0    
    D)  是死循环

8．下面有关 for 循环的正确描述是（ __D__ ）。
 
    A)  for 循环只能用于循环次数已经确定的情况    
    B)  for 循环是先执行循环的循环体语句，后判断表达式    
    C)  在 for 循环中，不能用break语句跳出循环体    
    D)  for 循环的循环体语句中，可以包含多条语句，但必须用花括号括起来

9．对 for(表达式1; ;表达式3) 可理解为（ __B__ ）。

    A)  for(表达式1;0;表达式3)    
    B)  for(表达式1;1;表达式3)    
    C)  for(表达式1;表达式1;表达式3)    
    D)  for(表达式1;表达式3;表达式3)

10．若 i 为整型变量，则以下循环执行次数是（ __B__ ）。
```C
for(i=2;i==0;) printf(“%d”,i--);
```
 
    A)  无限次    
    B)  0次    
    C)  1次    
    D)  2次

11．以下不是无限循环的语句为（ __A__ ）。

    A)  for(y=0,x=1;x>++y;x=i++) i=x;    
    B)  for(;;x++=i);    
    C)  while(1){x++;}    
    D)  for(i=10;;i--) sum+=i;

12．下面程序段的运行结果是（ __C__ ）。
```C
for(y=1;y<10;) y=((x=3*y,x+1),x-1);
printf(“x=%d,y=%d”,x,y);
```
 
    A)  x=27,y=27    
    B)  x=12,y=13    
    C)  x=15,y=14    
    D)  x=y=27

13．执行语句 `for(i=1;i++<4;);` 后变量 i 的值是（ __C__ ）。

    A)  3    
    B)  4    
    C)  5    
    D)  不定

14．有一堆零件（100到200之间），如果分成4个零件一组的若干组，则多2个零件；若分成7个零件一组，则多3个零件；若分成9个零件一组，则多5个零件。下面程序是求这堆零件总数，请选择填空（ __D__ ）。
```C
#include <stdio.h>
main(){
  int i;
  for(i=100;i<200;i++)
    if((i-2)%4==0)
      if(!((i-3)%7))
        if( ______ )
          printf(“%d”,i);
  }
```
    
    A)  i%9=5    
    B)  i%9!=5    
    C)  (i-5)%9!=0    
    D)  i%9==5

15．下面程序的功能是把 316 表示为两个加数的和，使两个加数分别能被 13 和 11 整除，请选择填空（ __B__ ）。
```C
#include <stdio.h>
main(){ 
  int i=0,j,k;
  do{i++;k=316-13*i;}while( _______ );
  j=k/11;
  printf(“316=13*%d+11*%d”,i,j);
}
```

    A)  k/11    
    B)  k%11    
    C)  k/11==0    
    D)  k%11==0

16．下面程序的运行结果是（ __D__ ）。
```C
#include <stdio.h>
main(){
  int y=10;
  do{y--;}while(--y);
  printf("%d\n",y--);
}
```

    A)  -1    
    B)  1    
    C)  8    
    D)  0

//TODO
17．若运行以下程序时，从键盘输入 `ADescriptor<CR>` (<CR>表示回车)，则下面程序的运行结果是（ __D__ ）。
```C
#include <stdio.h>
main(){
  char c;
  int v0=1,v1=0,v2=0;
  do{
    switch(c=getchar()){
      case 'a':case 'A':
      case 'e':case 'E':
      case 'i':case 'I':
      case 'o':case 'O':
      case 'u':case 'U':v1+=1;
      default:v0+=1;v2+=1;            
    }      
  }
  while(c!='\n'); 
  printf("v0=%d,v1=%d,v2=%d\n",v0,v1,v2);
}
```

    A)  v0=7,v1=4,v2=7    
    B)  v0=8,v1=4,v2=8    
    C)  v0=11,v1=4,v2=11    
    D)  v0=12,v1=4,v2=12

```
A 2 1 1
D 3 1 2
e 4 2 3
s 5 2 4 
c 6 2 5
r 7 2 6
i 8 3 7
p 9 3 8
t 10 3 9
o 11 4 10
r 12 4 11
<CR> 13 4 12
```

18．下面程序的运行结果是（ __B__ ）。
```C
#include <stdio.h>
main(){
  int a=1,b=10;
  do{b-=a;a++;} //b=b-a;a++;
  while(b--<0);
  printf("a=%d,b=%d\n",a,b);
}
```
    A)  a=3,b=11    
    B)  a=2,b=8    
    C)  a=1,b=-1    
    D)  a=4,b=9

19．以下程序的输出结果是（ __B__ ）。
```C
main(){
  int num=0;
  while(num<=2){
    num++; printf("%d\n",num);
  }
}
```
    A)  1
        2
        3
        4
    B)  1
        2
        3
    C)  1
        2
    D)  1

20．设有程序段
```C
int k=10;
while(k=0) k=k-1;
```
则下面描述中正确的是（ __C__ ）。
    
    A)  while 循环执行 10 次    
    B)  循环是无限循环    
    C)  循环体语句一次也不执行    
    D)  循环体语句执行一次

21．设有以下程序段
```C
int x=0,s=0;
while(!x!=0) s+=++x;
printf("%d",s);
```
则（ __B__ ）。

    A)  运行程序段后输出 0    
    B)  运行程序段后输出 1    
    C)  程序段中的控制表达式是非法的    
    D)  程序段执行无限次

22．语句 `while(!E);` 中的表达式 !E 等价于（ __C__ ）。
    
    A)  E==0    
    B)  E!=1    
    C)  E!=0    
    D)  E==1

23．下面程序段的运行结果是（ __A__ ）。
```C
a=1;b=2;c=2;
while(a<b<c) {t=a;a=b;b=t;c--;}
printf("%d, %d, %d", a, b, c);
```

    A)  1,2,0    
    B)  2,1,0    
    C)  1,2,1    
    D)  2,1 ，1

24．下面程序段的运行结果是（ __D__ ）。
```C
x=y=0;
while(x<15) y++,x+=++y;
printf("%d, %d", y, x);
```
    A)  20,7    
    B)  6,12    
    C)  20,8    
    D)  8,20

25．以下程序段的执行结果是（ __B__ ）。
```C
int a, y;
a=10; y=0;
do{
  a+=2; y+=a;
  printf("a=%d y=%d\n", a, y);
  if(y>20) break;
}
while(a=14);
```
A) 
```C
a=12 y=12    
a=14 y=16
a=16 y=20
a=18 y=24  
```
B)  
```C
a=12 y=12
a=16 y=28     
```
C)  
```C
a=12 y=12    
a=14 y=26
a=14 y=44
```
D)  
```C
a=12 y=12
```

26．t 为 int 类型，进人下面的循环之前，t 的值为 0，则以下叙述中正确的是（ __B__ ）。
```C
while( t=1 ){
    ……}
```
    
    A)  循环控制表达式的值为0    
    B)  循环控制表达式的值为1    
    C)  循环控制表达式不合法    
    D)  以上说法都不对

27．有以下程序段
```C
int k=0;
while(k=1) k++;
```
while 循环执行的次数是（ __A__ ）。

    A)  无限次    
    B)  有语法错，不能执行    
    C)  一次也不执行    
    D)  执行1次

28．以下程序执行后 `sum` 的值是（ __C__ ）。
```C
main(){
  int i , sum;
  for(i=1;i<6;i++) sum+=i;
  printf("%d\n",sum);
} 
```
    
    A)  15    
    B)  14    
    C)  不确定    
    D)  0

29．有以下程序段
```C
int x=3;
do{ 
  printf("%d",x-=2); }
  while (!(--x));
```
其输出结果是（ __C__ ）。

    A)  1    
    B)  3 0    
    C)  1 -2    
    D)  死循环

30．若输入 12、8 ，以下程序的输出结果是（ __A__ ）。
```C
main(){
  int a,b,num1,num2,temp;
  scanf("%d,%d",&num1,&num2);
  if(num1>num2){
    temp=num1;
    num1=num2;
    num2=temp;
  }
  a=num1,b=num2;//8 12
  while(b!=0){
    temp=a%b;
    a=b;
    b=temp;
  }
  printf("%d, %d",a,num1*num2/a);
}
```

    A)  4,24    
    B)  3,24    
    C)  5,25    
    D)  4,25

31．以下程序的输出结果是（ __A__ ）。
```C
#include<math.h>
#include<stdio.h>
main(){
  int s=1;
  float n=1,pi=0;
  double t=1;
  while(fabs(t)>=2e-6){
    pi+=t;
    n+=2;
    s=-s;
    t=s/n;
  }
  pi*=4;
  printf(“pi=%.6f\n”,pi);
}
```
    
    A)  3.141592    
    B)  1    
    C)  2e-6    
    D)  0

32．以下程序的输出结果是（ __B__ ）。
```C
main(){
  int i,f1,f2;
  f1=f2=1;
  for(i=0;i<4;i++){
    printf("%d %d",f1,f2);
    f1+=f2;
    f2+=f1;
  }
}
```
    
    A)  1 2 3 4 5 6 7 8    
    B)  1 1 2 3 5 8 13 21    
    C)  1 1 3 5 7 9 11 13    
    D)  1 3 5 7 9 11 13 15

33．下列叙述中，正确的一条是（ __B__ ）。

    A)  语句 "goto 12;" 是合法的    
    B)  for(;;) 语句相当于 while(1) 语句    
    C)  if(表达式) 语句中，表达式的类型只限于逻辑表达式    
    D)  break 语句可用于程序的任何地方，以终止程序的执行

34．以下程序的输出结果是（ __B__ ）。
```C
main(){
  int a,b;
  for(a=1,b=1;a<=100;a++){
    if(b>=20) break;
    if(b%3==1){
      b+=3;
      continue;
    }
    b-=5;
  }
  printf("%d\n",a);
}
```

    A)  7    
    B)  8    
    C)  9    
    D)  10

35．以下的 for 循环（ __C__ ）
`for(x=0,y=0;(y!=123)&&(x<4);x++);`

    A)  是无限循环    
    B)  循环次数不定    
    C)  执行4次    
    D)  执行3次

36．C 语言中（ __D__ ）

    A)  不能使用 do-while 语句构成的循环    
    B)  do-while 语句构成的循环必须用 break 语句才能退出    
    C)  do-while 语句构成的循环，当 while 语句中的表达式值为非零时结束循环    
    D)  do-while 语句构成的循环，当 while 语句中的表达式值为零时结束循环

37．以下程序的输出结果是（ __A__ ）。
```C
main(){
  int i;
  for(i=1;i<=5;i++){
    if(i%2)
      printf("*");
    else
      continue;
    printf("#");
  }
  printf("$\n");
}
```

    A)  *#*#*#$
    
    B)  #*#*#*$
    
    C)  *#*#$
    
    D)  #*#*$

38．有以下程序，从第一列开始输入数据 2473<CR>（<CR>代表一个回车符），则程序的输出结果为（ __A__ ）。
```C
#include<stdio.h>
main(){
  int c;
  while((c=getchar())!='\n'){
    switch(c-'2'){
      case 0:
      case 1:putchar(c+4);
      case 2:putchar(c+4);break;
      case 3:putchar(c+3);
      default:putchar(c+2);break;
    }
  }
  printf("\n");
}
```

    A)  668977    
    B)  668966    
    C)  6677877    
    D)  6688766

39．执行以下程序片段的结果是（ __B__ ）。
```C
int x=23;
do{
  printf("%d", x--);
}
while(!x);
```

    A)  打印出321    
    B)  打印出23    
    C)  不打印任何内容    
    D)  陷入死循环

40．若 x 是 int 型变量，则执行以下程序片段的结果是（ __D__ ）。
```C
for(x=3;x<6;x++) printf((x%2)?("**%d"):("##%d\n"), x);
```

    A)  **3##4**5    
    B)  ##3**4##5    
    C)  ##3\n**4##5
    D)  **3##4\n**5

41．有以下程序，若运行时从键盘输入 3.6  2.4<CR>（<CR>代表一个回车符），则程序的输出结果为（ __B__ ）。
```C
#include<stdio.h>
#include<math.h>
main(){
  float x,y,z;
  scanf("%f%f",&x,&y);
  z=x/y;
  while(1){
    if(fabs(z)>1.0){
      x=y;y=z;z=x/y;//2.4 1.5 1.6
                    //1.5 1.6 
    }else break;
  }
  printf("%f\n", y);
} 
```

    A)  1.500000    
    B)  1.600000    
    C)  2.000000    
    D)  2.400000

42．以下程序的输出结果是（ __D__ ）。
```C
main(){
  int x=10,y=10,i;
  for(i=0;x>8;y=++i)
    printf("%d  %d  ",x--,y);
}
```

    A)  10 1 9 2    
    B)  9 8 7 6    
    C)  10 9 9 0    
    D)  10 10 9 1

43．以下程序的输出结果是（ __A__ ）。
```C
main(){
  int n=4;
  while(n--)
    printf("%d  ",--n);
}
```

    A)  2  0    
    B)  3  1    
    C)  3  2  1    
    D)  2  1  0

44．以下程序的输出结果是（ __B__ ）。
```C
main(){
  int i;
  for(i='A';i<'I';i++,i++)
    printf("%c",i+32);
}
```

    A)  编译通不过，无输出    
    B)  aceg    
    C)  acegi    
    D)  abcdefghi

45．若 i、j 已定义为 int 型，则以下程序段中内循环体的总的执行次数是（ __A__ ）。
```C
for(i=5;i;i--)
  for(j=0;j<4;j++){     }
```

    A)  20    
    B)  24    
    C)  25    
    D)  30

46．若 j 为 int 型变量，则以下 for 循环语句的执行结果是（ __B__ ）。
```C
for(j=10;j>3;j--){
  if(j%3) j--;--j;--j;printf("%d  ",j);
}
```

    A)  6  3    
    B)  7  4    
    C)  6  2    
    D)  7  3

47．以下程序的执行结果是（ __D__ ）。
```C
main(){
  int i,x;
  for(i=1;i<=50;i++){
    x=i;
    if(++x%2==0)
      if(x%3==0)
        if(x%7==0)
          printf("%d",i);
  }
}
```
    
    A)  28    
    B)  27    
    C)  42    
    D)  41

48．以下程序的执行结果是（ __B__ ）。
```C
main(){
  int i,j;
  for(j=10;j<11;j++){ 
    for(i=9;i<j;i++)
       if(!(j%i))  break;
       if(i>=j-1) printf("%d",j);
   }
}
```

    A)  11    
    B)  10    
    C)  9    
    D)  10 11

49．在下列选项中，没有构成死循环的程序段是（ __C__ ）。

A) 
```C
int i=100;    
while(1){
  i=i%100+1;
  if(i>100) break;
}
```
B)  `for(;;);`
C)  
```C
int k=1000;    
do{++k;}
while(k>=10000);
```
D)  
```C
int s=36;
while(s);--s;
```
   
50．以下程序的输出结果是（ __B__ ）。
```C
main(){
  int i,j,x=0;
  for(i=0;i<2;i++){ 
    x++;
    for(j=0;j<=3;j++){ 
      if(j%2)  continue;
      x++;
    }
    x++;
  }
  printf("x=%d\n",x);
}
```

    A)  x=4    
    B)  x=8    
    C)  x=6    
    D)  x=12

51．运行以下程序后，如果从键盘上输入65  14\<回车>，则输出结果是（ __C__ ）。
```C
main(){
  int m,n;
  scanf("%d%d",&m,&n);
  while(m!=n){
    while(m>n) m-=n;
    while(n>m) n-=m;
  }
  printf("m=%d\n", m);
}
```
    A)  m=3    
    B)  m=2    
    C)  m=1    
    D)  m=0

52．以下程序的输出结果是（ __C__ ）。
```C
main(){
  int i,j,m=0,n=0;
  for(i=0;i<2;i++)
    for(j=0;j<2;j++)
      if(j>=i)  m=1;n++;
  printf("%d\n", n);
} 
```

    A)  4    
    B)  2    
    C)  1    
    D)  0

53．以下程序执行后sum的值是（ __C__ ）。
```C
main(){ 
  int i , sum=0;
  for(i=1;i<=3;sum++) sum+=i;
  printf("%d\n",sum);
}
```

    A)  6    
    B)  3    
    C)  死循环    
    D)  0

## 填空题
1．以下程序运行后的输出结果是 __52__ 。
```C
main(){
  int i=10, j=0;
  do{ 
    j=j+i; i--;
  }
  while(i>2);
  printf("%d\n",j);
}
```

2．设有以下程序:
```C
main(){ 
  int n1,n2;
  scanf("%d",&n2);
  while(n2!=0){ 
    n1=n2%10;
    n2=n2/10;
    printf("%d",n1);
  }
}
```
程序运行后，如果从键盘上输入 1298，则输出结果为 __8921__。

3．若输入字母b，程序输出结果为 __b,B__ ；若输入字符*，程序将怎样 __等待重新输入__ 。
```C
#include<stdio.h>
main(){
  char c1, c2;
  c1=getchar();
  while(c1<97||c1>122)
  c1=getchar();
  c2=c1-32;
  printf("%c, %c\n",c1, c2);
}
```

4．用以下程序计算 1 到 100 的整数的累加和。
```C
main(){ 
  int i=1, sum= ______ ;
  for( ______ ){
    sum+=i;
    i++;
  }
  printf("sum=%d\n", ______ );
} 
```
```C
main(){ 
  int i=1, sum=0;
  for(;i<100;){
    sum+=i;
    i++;
  }
  printf("sum=%d\n",sum);
} 
```

5．以下程序的功能是：从键盘上输入若干个学生的成绩，统计并输出最高成绩和最低成绩，当输入负数时结束。请填空。
```C
main(){ 
  float x, amax, amin;
  scanf("%f",&x);
  amax=x;
  amin=x;
  while( ______ ){
    if(x>amax)  amax=x;
    if( ______ )  amin=x;
    scanf("%f",&x);
  }
  printf("amax=%f\namin=%f\n",amax, amin);
} 
```
```C
main(){ 
  float x, amax, amin;
  scanf("%f",&x);
  amax=x;
  amin=x;
  while(x>=0){
    if(x>amax)  amax=x;
    if(x<amin)  amin=x;
    scanf("%f",&x);
  }
  printf("amax=%f\namin=%f\n",amax, amin);
} 
```

6．设 i、j、k 均为 int 型变量，则执行完下面的 for 循环后，k 的值为 __10__ 。
```C
for(i=0, j=10;i<=j; i++, j--)  k=i+j;
```

7．下面程序的功能是：计算 1 到 10 之间的奇数之和及偶数之和，请填空。
```C
main(){
  int a, b, c, i;
  a=c=0;
  for(i=0;i<=10;i+=2) {
    a+=i;  
    ______ ;
    c+=b;
  }
  printf("偶数之和=%d\n", a);  
  printf("奇数之和=%d\n", c－11);
} 
```
```C
main(){
  int a, b, c, i;
  a=c=0;
  for(i=0;i<=10;i+=2) {
    a+=i;  
    b=i+1;
    c+=b;
  }
  printf("偶数之和=%d\n", a);  
  printf("奇数之和=%d\n", c－11);
} 
```

8．下面程序的功能是：输出100以内能被3整除且个位数为6的所有整数，请填空。
```C
main(){ 
  int i, j;
  for(i=0; ______ ; i++){
    j=i*10+6;
    if( ______ )  continue;
    printf("%d", j);
  }
}
```
```C
main(){ 
  int i, j;
  for(i=0; i<10; i++){
    j=i*10+6;
    if(j%3!=0) continue;
    printf("%d", j);
  }
}
```

9．要使以下程序段输出 10 个整数，请填入一个整数。
```C
for(i=0; i<= ______ ; printf("%d\n", i+=2));
```
```C
for(i=0; i<= 18; printf("%d\n", i+=2));
```

10．若输入字符串：abcde\<回车>，则以下 while 循环体将执行 __0__ 次。
```C
while((ch=getchar())=='e')  printf("*");
```
