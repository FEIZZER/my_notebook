### sync.atomic

原子操作表现为不可分割的操作， 要么执行要么不执行， 外界是看不到原子操作的之间状态的。

##### 原子操作与互斥操作的区别

- 底层实现不同

  - atomic中原子操作是由底层硬件指令直接提供的； 指令在执行的过程中是不允许中断的，因此原子操作可以在`lock-free`的情况下保证并发安全，并且它的性能也能做到随`CPU`个数的增多而线性扩展。

    CAS的全称为`Compare And Swap`，直译就是比较交换。是一条CPU的原子指令，其作用是让`CPU`先进行比较两个值是否相等，然后原子地更新某个位置的值，其实现方式是给予硬件平台的汇编指令，在`intel`的`CPU`中，使用的`cmpxchg`指令，就是说`CAS`是靠硬件实现的，从而在硬件层面提升效率。简述过程是这样：

    > 假设包含3个参数内存位置(V)、预期原值(A)和新值(B)。`V`表示要更新变量的值，`E`表示预期值，`N`表示新值。仅当`V`值等于`E`值时，才会将`V`的值设为`N`，如果`V`值和`E`值不同，则说明已经有其他线程在做更新，则当前线程什么都不做，最后`CAS`返回当前`V`的真实值。CAS操作时抱着乐观的态度进行的，它总是认为自己可以成功完成操作。基于这样的原理，CAS操作即使没有锁，也可以发现其他线程对于当前线程的干扰。

  - Mutex由操作系统的调度器实现。

- 目的不同。 Mutex用于保护一段逻辑操作， atomic用于保护对变量的更新。

当然本质上， 使用锁的互斥操作也是为了实现原子性。

#### sync.atomic包实现的原子操作 

在`Go`语言标准库中，`sync/atomic`包将底层硬件提供的原子操作封装成了`Go`的函数，主要分为5个系列的函数，分别是：

`atomic.AddXXXType()` 函数实现了对操作数的原子增减， （`XXType`包括：`int32`、`int64`、`uint32`、`uint64`、`uintptr`）

载入操作（LoadXXType）：保证读取到操作数前，没有其他routine对其进行更改操作；
存储操作（StoreXXType）：保证存储时的原子性（避免被其他线程读取到修改一半的数据）；
比较并交互操作（CompareAndSwapXXType）：保证交换的CAS，只有原有值没被更改时才会交换；
交换操作（SwapXXType）：直接交换，不关心原有值。

- **`atomic.CompareAndSwapXXX(addr *int64, old, new int64) (swapped bool)`**  交换比较的实现.*函数名中的**XXX**用来区分原子操作的类型， 支持的类型有 `int64 int32 uint32 uint64 uintptr unsafe.pointer`*

  该函数就是原子性的比较 `*addr`和`old`的值， 如果相同则将`new`值赋给`*addr`并返回true。 需要注意的是在CAS中有一类 ABA 问题。 就是说如果有一个值原来是A， 之后变为了B， 随后又变为了A。这时CAS再去检查该值， 是无法发现这个值产生过变化的。 在golang的原子操作中同样无法检测这个问题。

  ```go
  func main() {
  	var value int64 = 1
  	wg := sync.WaitGroup{}
  	wg.Add(2)
  	go func() {
  		defer wg.Done()
  		value++
  		value--
  	}()
  
  	go func() {
  		defer wg.Done()
  		time.Sleep(1*time.Second)
  		res := atomic.CompareAndSwapInt64(&value, 1, 10)
  		fmt.Println(res)
  	}()
  	wg.Wait()
  }
  // >> true
  ```

  在实际项目中如果遇到需要识别ABA问题的情况， 可以考虑使用version号来区分。

- **`SwapXXX(addr *int64, new int64) (old int64)`** 原子性的将`new`值保存到 `*addr`中 并返回旧值。

- **`AddXXX(addr *int64, val int64) (new int64)`**   原子的将`val`加到`*addr`中， 并返回新值。

- **`LoadXXX(addr *int64)(val int64)`** 原子的获取`*addr`的值

- **`StoreXXX(addr *int64, val int64) `**  原子的将值保存到 `*addr` 



