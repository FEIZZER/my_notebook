https://hansimov.gitbook.io/csapp/publish-info/preface

### 位置无关代码PIC /position independent code

动态库的一个主要目的就是允许多个正在运行的进程共享内存中相同的库代码，因而节约宝贵的内存资源。早期有一种实现方法是保证每一个共享库被加载到内存的固定位置， 显然这种处理方式是非常难以管理的。 

现在操作系统则是将共享对象（动态库）设计为可以加载到的内存的任意位置， 且无限多个进程依然可以共享该动态库中的单一代码段副本。 