# makefile工具使用

makefile主要用来处理c或c++的编译工作， 但是其不仅能处理c或c++。 所有编译器/解释器可以在命令行终端运行的的编程语言*(java python golang)* 都可以用makefile处理。 makefile也不仅能用来处理编程语言， 所有需要基于一些文件去生成更新目标的工程都可以使用makefile来实现。

##### 最简单打的makefile

有如下的hello.c文件 

```c
#include "stdio.h"
#define YEAR 2023
int main() {
    printf("the year is %d\n", YEAR);
    return 0;
}
```

在hello.c 的同级目录下新建文件 makefile,  添加如下的内容

```makefile
hello: hello.c
	gcc hello.c -o hello
```

使用makefile文件成功编译 hello.c 源码

![image-20230420100251400](makefile.assets/image-20230420100251400.png) 



#### makefile文件的语法规则

makefile由一条条规则实现， 大致如下。 target表示目标文件， prerequisites 表示生成目标文件需要的依赖文件， recipe表示生成目标文件的方法。

```makefile
target ... : prerequisites ...
	recipe
	...
```

makefile文件一般会将编译链接分开写， 上面最简单的makefile文件可以改写为：

```makefile
hello: hello.o
	gcc hello.o -o hello
hello.o: hello.c
	gcc -c hello.c
```

##### makefile各个组成部分

- 显示规则 *explicit rules*。 显示的指示如何生成目标文件
- 隐式规则 *implicit rules*。 根据文件自动推导如何从依赖文件生成或更新目标文件
- 变量定义 *variable definition*。 定义变量并指定值， 值都是字符串。 类似于C语言中的宏定义(#define) ,在使用时将值展开到引用的位置。
- 指令 *directives*    make读取Makefile文件过程中的一些特殊操作， 包括：
  - 包含引入另一个makefile文件， 类似于c语言中 （#include)
  - 确定是否使用或略过makefile文件中的一部分内容，类似于（#if)
  - 定义多行变量
- 注释 *comments*    # xxxx

#### makefile命令行工具

- `make`   命令默认会去当前目录下寻找makefile或Makefile文件

- `make -f [filepath]` 或 `make --file=[filepath]`   可以指定要执行的文件
- 