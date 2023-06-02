### 内核态和用户态

windows操作系统的计算机又两种不同的模式： **用户模式**和**内核模式**。

根据处理器上运行的代码的类型， 处理器会在两个模式之间切换。 核心操作系统的组件在内核模式工作， 多数驱动程序在内核态工作，某些驱动程序也可以在用户模式工作。

![用户模式和内核模式组件的方块图。](windows内核概念记录.assets/userandkernelmode01.png) 

##### **用户模式**  

- 启动用户模式的进程时， windows会为应用程序创建单独的进程。进程为程序提供单独的 **虚拟地址空间** 和 **专用的句柄表**。
- 虚拟地址空间是专用的，因此一个程序无法修改另一个程序的数据，即应用程序之间时隔离的
- 虚拟地址空间童同样也受限制， 用户模式下运行的程序无法访问为操作系统保留的虚拟地址空间。

**内核模式**

- 内核模式下所有程序共享单个虚拟地址空间。 内核模式的驱动程序之间和操作程序组件并不隔离。



### 虚拟地址空间

windows操作系统中处理器会使用虚拟地址来索引物理地址， 虚拟地址有很多优势：

- 程序可以使用一系列连续的虚拟虚拟地址来访问物理内存中不连续的大内存缓冲区。
- 程序可以使用一系列的虚拟地址来访问大于物理内存的内存缓冲区。 当可用的物理内存不够时，内存管理器可以将物理内存页(4KB)保存到磁盘文件。 数据或代码会根据需要在物理内存和磁盘之间移动。
- 不同的进程可以使用各自的虚拟地址，实现彼此之间的隔离。

![diagram of virtual address spaces for two processes.](windows内核概念记录.assets/virtualaddressspace01.png) 



在32位的操作系统上， 可用的虚拟地址空间为 2^32字节（4GB）。 通常较低的2GB用于用户空间， 较高的2GB用于内核空间。 在启动时可以增加用户空间的大小，但是会减少系统空间的， 命令为 `bcdedit /set increaseuserva`.

在64位的windows操作系统中， 虚拟地址空间的位128TB。

#### 虚拟地址转换的实现

将虚拟地址转换成物理地址的过程，需要MMU(Memory Management Unit)和页表(table page)的共同参与

##### MMU

MMU是处理器/核的一个硬件单元， 通常每一个核都有一个MMU。 MMU又有两部分组成： **TLB** 和 **table walk unit**。 

##### page table

page table是每个进程独有的， 是软件实现的， 是存储在main memory(比如DDR)中的。

[地址转化的过程](https://zhuanlan.zhihu.com/p/65298260?utm_source=wechat_session)



### IRP请求

应用程序会向计算机设备发送各种 I/O请求， 这些请求包*I/O request package(IRP)*  在内核开发中被封装成`IRP`结构体. 由于IRP是响应上层应用的，常见的文件相关的IRP列表

| IRP类型                        | 描述                     | 应用层调用者                                      |
| ------------------------------ | ------------------------ | ------------------------------------------------- |
| IRP_MJ_CREATE                  | 获取文件句柄             | 对应User下的CreateFile                            |
| IRP_MJ_CLOSE                   | 关闭文件句柄             | 对应User下的CloseHandle                           |
| IRP_MJ_READ                    | 从设备得到数据           | 对应ReadFile                                      |
| IRP_MJ_WRITE                   | 传送数据到设备           | 对应WriteFile                                     |
| IRP_MJ_DEVICE_CONTROL          | 控制操作(利用IOCTL宏)    | 对应DeviceIoControl，即可读又可写                 |
| IRP_MJ_INTERNAL_DEVICE_CONTROL | 控制操作(只能被内核调用) | 和IRP_MJ_DEVICE_CONTROL差不多，但是只有Kernel可用 |

分发例程必须保存在驱动对象的MajorFunction里面，且需要对应和驱动的连接状态：

#### IRP数据结构详解

IRP结构体在 `wdm.h`头文件中定义, 其中几个重要的成员变量的意义：

- ##### MdlAddress

  是一个MDL的指针， 当内核层和用户层采用共享内存的结构传递数据时， 这个时候MDL就会代表共享的内存数据(共享物理内存， 通过MDL映射)

- ##### AssociatedIrp

  这个成员是联合体

  

### 事件

内核中的事件是一个数据结构， **事件**一般用于多个线程之间的同步。 如果一个线程需要等到另一个线程完成一个任务后再执行， 就可以使用事件。数据结构是**`KEVENT`**, 定义在 `wdm.h` 头文件中。 
[[驱动开发记录#事件处理]]

```c
KeInitializeEvent(
        IN PRKEVENT  Event,
        IN EVENT_TYPE  Type,
        IN BOOLEAN  State
);
```

事件结构一般使用上面的函数进行初始化。第一个参数是要初始化的事件， 

第二个参数表示事件的类型，**NotificationEvent** 或者 **SynchronizationEvent**。 

- SynchronizationEvent 表示该事件为同步事件，同步事件会**自动重设**，如果这个事件被设置，那么只有一个线程的`KeWaitForSingleObject()`可以通过， 通过之后会被自动重设，其他线程只能继续等待。

- NotificationEvent，表示该事件为通知事件， 如果这个事件被设置， 那么所有等待这个事件的线程都会通过。如果要重新使用这个事件，就需要使用函数 `KeSetEvent()`手动重设

第三个参数表示初始化后事件的状态， TRUE表示设置状态， 一般设置为False。 当事件为设置状态，等待这个事件的地方才会被通过。

==事件对象不需要销毁。 不太确定==。





### 线程

在内核中使用线程可能是一些任务过于耗时，开发者不想让当前系统停止下来等待 又或者是用来执行长期不断的任务，如日志的写入。在驱动中的生成的线程一般是系统线程， 系统线程所在的进程名为 **System**

```c
NTSTATUS PsCreateSystemThread(
  [out]           PHANDLE            ThreadHandle,
  [in]            ULONG              DesiredAccess,
  [in, optional]  POBJECT_ATTRIBUTES ObjectAttributes,
  [in, optional]  HANDLE             ProcessHandle,
  [out, optional] PCLIENT_ID         ClientId,
  [in]            PKSTART_ROUTINE    StartRoutine,
  [in, optional]  PVOID              StartContext
);
```

使用这个内核API来创建系统线程, 其中

- 第一个参数 ThreadHandle用来返回句柄，传入一个句柄指针即可。
- 第二个参数 DesiredAccess，总是传入0
- 第三四五个参数都传入NULL
- 第六个参数 StartRoutine， 传入一个线程要执行的函数
- 第七个参数 StartContext， 传入改函数的参数。















