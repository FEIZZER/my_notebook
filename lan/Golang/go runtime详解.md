### go runtime



golang的runtime类似于java中的JVM， 不过runtime并不是虚拟机。 go语言的编译出来的可执行文件和c/c++编译出来的一样都是都是二进制的可执行文件。我们知道运行 golang 的程序并不需要主机安装有类似 Java 虚拟机之类的东西，那是因为在编译时，golang 会将 runtime 部分代码链接进去.



###### golang的runtime核心功能包括

1. 并发模型的调度
2. 垃圾回收
3. 内存分配
4. 使得golang可以支持如 pprof， trace， race的检测
5. 支持golang的内置类型的实现，如channel， map，  slice，string等
6. 待整理。。。

Go的runtime是与用户代码一起打包在一个可执行文件中，是程序的一部分，而不是向Java需要单独安装，与程序独立。所以用户代码与runtime代码在执行时没有界限都是函数调用。在Go语言中的关键字编译时会变成runtime中的函数调用

| 关键字 | 函数                                        |
| ------ | ------------------------------------------- |
| go     | newproc                                     |
| new    | newobject                                   |
| make   | makeslice, makechan, makemap, makemap_small |
| <-  -> | chansend1, chanrecv1                        |
|        |                                             |

#### 并发模型的调度
[goroutine调度器](goroutine调度器.md)
#### 垃圾回收

三色标记法

#### 内存分配
