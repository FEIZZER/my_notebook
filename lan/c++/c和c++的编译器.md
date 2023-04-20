## GCC

GCC（GNU Compiler Collection，GNU 编译器套装），是一套由 GNU 开发的编程语言编译器。GCC 原名为 GNU C 语言编译器，因为它原本只能处理 C语言。GCC 快速演进，变得可处理 C++、Fortran、Pascal、Objective-C、Java 以及 Ada 等他语言。

### gcc 命令行工具

##### gcc和 g++ 指令了解

gcc和g++都是GCC编译器的编译指令。  实际上是要是GCC支持的编译的程序代码都可以使用gcc指令来完成编译。*gcc可以根据文件后缀判断文件类型，自动使用编译类型*。 但是gcc也提供了 `-x`选项来指定对文件的编译方式， 比如`gcc -xc xxx`就是以c语言方式编译xxx文件，或`gcc -xc++ yyy` 就是以c++方式编译yyy文件。

而使用`g++ `指令其实等同于使用 `gcc -xc++ -lstdc++ -shared-libgcc`, 关于其他的几个选项，后面再学。





## Clang和LLVM