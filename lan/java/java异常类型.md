# java异常类型汇总 常见错误学习

![image-20210404160633538](java%E5%BC%82%E5%B8%B8%E7%B1%BB%E5%9E%8B.assets/image-20210404160633538.png)

Java从Throwable直接派生出Exception和Error。其中Exception是可以抛出的基本类型，在Java类库、方法以及运行时故障中都可能抛出Exception型异常。Exception表示可以恢复的异常，是编译器可以捕捉到的；Error表示编译时和系统错误，表示系统在运行期间出现了严重的错误，属于不可恢复的错误，由于这属于JVM层次的严重错误，因此这种错误会导致程序终止执行。Exception又分为检查异常和运行时异常。

### 运行时异常RuntimeException

- ##### NullPointerException空指针型的异常

- ##### ClassCastException(类型转换异常)

- ##### IndexOutOfBoundsException(越界异常)

- ##### IllegalArgumentException(非法参数异常)

- ##### ArrayStoreException(数组存储异常)

- ##### AruthmeticException(算术异常)

- ##### BufferOverflowException(缓冲区溢出异常)

### 检查异常 non-RuntimeException

- ##### IOException

- ##### SQLException

- ##### InterruptedException

- ##### NumberFormatException(数字格式化异常)