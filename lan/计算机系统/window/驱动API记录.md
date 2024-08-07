## 常见API

### 绑定设备

绑定是非常常用的过滤手段， 可以通过编程产生一个虚拟的设备， 将他绑定到另一个真实设备上。 一旦被绑定， 操作系统会将本来发给真实设备的请求发给我们生成的虚拟设备。

在WDK中有非常多的内核API实现设备绑定的功能：

- ```c
  NTSTATUS IoAttachDevice(
  	[IN] PDEVICE_OBJECT filterObject, 	// 由调用者生成的用来过滤的虚拟设备
      [IN] PUNICODE_STRING targetObject, 	// 被绑定设备的名字的字符串
      [OUT] PDEVICE_OBJECT *attachedObject  // 返回被调用设备对象的指针
  )
  ```

  第二个参数的类型是`PUNICODE_STRING`, 用来表示被绑设备的名字， 也就是说只有有名字的设备才可以使用这个API来进行绑定*window中有一些设备对象是没有名字的*。

  第三个参数返回的被绑定的参数其实就是绑定之前设备栈上最顶端的设备。

- ```c
  NTSTATUS IoAttachDeviceToDeviceStackSafe(
    [in]  PDEVICE_OBJECT SourceDevice,			// 由调用者生成的用来过滤的虚拟设备
    [in]  PDEVICE_OBJECT TargetDevice,			// 被绑定设备对象的指针
    [out] PDEVICE_OBJECT *AttachedToDeviceObject	// 返回被调用设备对象的指针
  );
  ```

  对于没有名字的设备对象可以使用这个函数来进行绑定。

- `IoAttachDeviceToDeviceStack(...)` 功能和上面的函数一样，但是没有出参,如果要支持win2000等老版本，使用这个API

  `IoAttachDeviceToDeviceStackSafe(...)` 更加安全， 但是只在 windows XP 和 windows 2000SP4以上的版本中才可以使用。

#### 解除绑定

```c
void IoDetachDevice(
  [in, out] PDEVICE_OBJECT TargetDevice
);
```

该函数递减targetDevice对象的引用计数。 之前调用了`IoAttachDevice`或`IoAttachDeviceToDeviceStack`对targetDevice绑定了新的设备， 可以用该函数结束绑定。

### 创建设备

- ```c
  NTSTATUS IoCreateDevice(
    [in]           PDRIVER_OBJECT  DriverObject,
    [in]           ULONG           DeviceExtensionSize,
    [in, optional] PUNICODE_STRING DeviceName,
    [in]           DEVICE_TYPE     DeviceType,
    [in]           ULONG           DeviceCharacteristics,
    [in]           BOOLEAN         Exclusive,
    [out]          PDEVICE_OBJECT  *DeviceObject
  );
  ```


#### 删除设备

- ```c
  void IoDeleteDevice(
    [in] PDEVICE_OBJECT DeviceObject
  );
  ```

  指向要删除的设备对象的指针。



### IRP请求处理



### 事件处理

- ```c
  void KeInitializeEvent(
    [out] PRKEVENT   Event,
    [in]  EVENT_TYPE Type,
    [in]  BOOLEAN    State
  );
  ```

  该函数用来初始化事件

  - 参数 [out] PRKEVENT   Event， 传入一个事件的指针的类型，即要初始化的KEVENT对象地址。
  - 参数 [in]  EVENT_TYPE Type， 只能传入指定的事件， **NotificationEvent** 或 **SynchronizationEvent**
  - 参数 [in]  BOOLEAN    State ， 指定事件的状态。



- ```c
  NTSTATUS
  KeWaitForSingleObject (
      PVOID Object,
      KWAIT_REASON WaitReason,
      KPROCESSOR_MODE WaitMode,
      BOOLEAN Alertable,
      PLARGE_INTEGER Timeout
  );
  ```

  该函数用来将当前线程设置为等待状态， 直到给定的事件对象发出设置信号。

  

- ```c
  LONG KeSetEvent(
    [in, out] PRKEVENT  Event,
    [in]      KPRIORITY Increment,
    [in]      BOOLEAN   Wait
  );
  ```

  该函数用于将事件设置为信号状态。



### 内存操作

- ```c
  VOID RtlCopyMemory(
     [out]	void*       Destination, // 指向目标内存块的指针
     [in] 	const void* Source,		 // 指向要从中复制字节的内存块的指针 
     [in]		size_t      Length		 // 需要从源复制到目标地址的字节数
  );
  ```

  该函数用来将内存块中的内容赋值到目标内存块。

   `RtlCopyMemory`函数比`RtlMoveMemory`的速度更快， 但是要求**源内存块**不能和**目标内存块**重叠。

  如果源内存块和目标内存块位于非分页系统内存中， **RtlCopyMemory** 的调用方可以在任何 IRQL 上运行。 否则，调用方必须在 IRQL <= APC_LEVEL 运行。

  

- ```c
  void RtlMoveMemory(
     void*       Destination,
     const void* Source,
     size_t      Length
  );
  ```

  该函数和上一个函数基本一致， 只是这个函数允许**源内存块**和**目标内存块**重叠。



- ```c
  PVOID ExAllocatePoolWithTag(
    [in] __drv_strictTypeMatch(__drv_typeExpr)POOL_TYPE PoolType, 
    [in] SIZE_T                                         NumberOfBytes,
    [in] ULONG                                          Tag
  );
  ```

  该函数用来分配指定类型的**池内存(pool memory)**, 并返回指向已分配块的内存。

  - 参数 [in] POOL_TYPE PoolType,  用来指定要分配的吃内存的类型。  `POOL_TYPE`是一个枚举类型。
  - 参数 [in] SIZE_T,   要分配的字节数
  - 参数 [in] ULONG，池标记。 池标记通常由四个字符定义，被单引号包裹， 并且字符串通常以反序定义， 如'1gat'。 标记中的每个字符必须是 0x20(空格)到0x7E(波形符)范围内的值。 *池标记用来表示代码， 方便调式*。

  

- ```c
  void ExFreePool(
    [in] PVOID P
  );
  ```

  该函数用来解除 由 [ExAllocatePool](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/ddi/wdm/nf-wdm-exallocatepool)、 [ExAllocatePoolWithTag](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/ddi/wdm/nf-wdm-exallocatepoolwithtag)、 [ExAllocatePoolWithQuota](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/ddi/wdm/nf-wdm-exallocatepoolwithquota) 或 [ExAllocatePoolWithQuotaTag](https://learn.microsoft.com/zh-cn/windows-hardware/drivers/ddi/wdm/nf-wdm-exallocatepoolwithquotatag) 分配的池内存块。

  **ExFreePool** 的调用方必须在 IRQL <= DISPATCH_LEVEL运行。 分配内存时，DISPATCH_LEVEL的调用方必须指定 **NonPaged***Xxx**PoolType* 。 否则，调用方必须在 IRQL <= APC_LEVEL运行。

  

- **POOL_TYPE** 枚举类型指定要分配的系统内存的类型， 在`wdm.h`中定义, 常见的几个值：

  - NonPagedPool   *非分页池*，这是不可分页的系统内存。 可以从任何 IRQL 访问非分页池，但它是稀缺的资源，驱动程序应仅在必要时分配它。

    使用 **NonPagedPool** 池类型分配的系统内存是可执行的。

  - NonPagePoolNx    *无执行* (NX) 非分页池。 此池类型从 Windows 8 开始可用。 与 **NonPagedPool** 指定的非分页池（分配可执行内存）不同，NX 非分页池分配禁用指令执行的内存。 有关详细信息，

    在wdm.h 中有一个宏定义 在适当的版本生效`#define NonPagedPool NonPagedPoolNx`, 所以用的时候一般都直接使用这个宏。

  - PagedPool   分页池， 只能在 irql<dispatch_level 进行分配和

  
  
  



### 进程管理

- `PsGetCurrentProcessId()`  获取当前进程id
