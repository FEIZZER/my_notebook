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



##### 文件搜寻

在一些大型项目中，会有非常多的源文件存放在不同的目录中， 虽然可以在文件前面加上文件目录前缀， 但是又更好的办法。 使用makefile文件中的特殊变量VPATH， 如果makefile在当前目录找不到相应的依赖文件， 就会去VPATH中指定的目录下去寻找依赖文件。

```makefile
VPATH=src:../headers
```

上面的定义指定两个目录，“/src”和“../headers”，make会按照这个顺序进行搜索。目录由“冒号”分隔。*（但是，当前目录永远是最高优先搜索的地方）*



也可以使用 vpath关键字， *他是全小写的 是makefile的一种关键字*。 vpath关键字更为灵活， 它可以指定在不同目录下搜索不同格式的文件， 如下:

```makefile
vpath %.h include
```

- `vpath  <pattern>  <directories>`   为符合模式\<pattern\>的文件指定搜索目录\<directories\>。
- `vpath  <pattern>`                                  清除符合模式\<pattern\>的文件的搜索目录。
- `vpath `                                                         清除所有已被设置好了的文件搜索目录。

*推荐使用vpath关键字， 更灵活。* 

##### 伪目标

makefile文件中存在一种伪目标*执行这个target不会生成文件*， 可以使用一个特殊标记 `.PHONY `来显示指明一个target是一个伪目标。 比如我们常用的clean目标， 可以写成这样

```makefile
.PHONY : clean
clean:
    echo "clean start..."
    rm hello.o hello
    echo "clean end..."
```

#### makefile文件中的变量



#### makefile命令行工具

- `make`   命令默认会去当前目录下寻找makefile或Makefile文件， 然后只执行当前makefile文件中第一个target和其需要的依赖文件

  - `make + [target]`  也可以指定执行makefile文件中具体的某一个target。 比如这个makefile文件 `make clean ` 只会执行下面的内容

    ![image-20230424155914896](makefile.assets/image-20230424155914896.png) 

- `make -f [filepath]` 或 `make --file=[filepath]`   可以指定要执行的文件*（可以有多个makefile文件）* 

- 