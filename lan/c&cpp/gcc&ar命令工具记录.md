### gcc命令行

```shell
Usage: gcc [options] file...
```

#### options

- **-E**   `gcc main.c -o main.i -E`仅对inputfile做预处理操作

- **-S**  `gcc main.i -o main.s -S`  进对inputfile做编译操作

- **-c**  `gcc  main.s -o main.o -c` 仅对对inputfile做汇编操作

- **-I + 目录** *大写字母 i*   指定导入头文件的目录

- **-L + 目录** 指定导入的库文件目录

- **-l + 库名**  指定要导入的库的名字

  ` gcc main.c -I./include  -L./lib -lmath`  ,表示头文件的搜索目录在 `./include` 库文件的搜索目录在 `./lib`, 导入一个库 `libmath.so/libmath.a` , 此选项可多次使用以表示多个目录或库。







### ar 命令行

ar命令是一种用于创建和操作静态库（archive）的命令行工具。它通常用于将多个目标文件（object file）打包成一个库文件，方便在程序中使用。

下面是ar命令的一些常用选项和示例用法 
