### unsafe包学习记录

##### unsafe包中的三个方法

- **`func Sizeof(x ArbitraryType) uintptr`**  该方法接受任意类型的值x作为参数，并返回属于该类型的 已字节为单位的 大小。 ==返回的大小不包括可能被x引用的内存==

  ```go
  type Person struct {
  	attribute *Attribute
  	name string
  }
  type Attribute struct {
  	age int64
  	height int64
  	weight int64
  	academic string
  }
  func main() {
  	fmt.Println(unsafe.Sizeof(Person{}))     // 64位的机器 >> 24， 指针8字节 + string占16字节
  	fmt.Println(unsafe.Sizeof(Attribute{}))  // 64位的机器 >> 40， int64占8字节 + string占16字节
  }
  ```

  - 任意类型的指针占**一个机器字长**， 32位机器占4字节， 64位机器占8字节
  - int类型占**一个机器字长**
  - string类型占**两个机器字长**，因为string的内部结构中有一个**int类型**和**一个指针类型**
  - 数组类型所占空间等于 **数组长度\*数组类型长度**
  - 切片类型占**三个机器字长**， 因为slice内部结构有**两个int类型**和**一个指针类型**

- **`func Offsetof(x ArbitraryType) uintptr`** 该方法必须接受一个**结构体的成员变量**作为参数， 返回该成员变量在内存中的位置距离结构体在内存中起始处的字节数， 即偏移量。 *结构第一个字段的偏移量都是0* ， 其入参必须是一个结构体成员， 返回值是一个常量。

  ```go
  type Person struct {
  	attribute *Attribute
  	name string
  }
  type Attribute struct {
  	age int64
  	height int64
  	weight int64
  	academic string
  }
  func main() {
  	fmt.Println(unsafe.Offsetof(Person{}.name)) // 结果为8
  }
  ```

- **`func Alignof(x ArbitraryType) uintptr`**  该函数的主要作用是返回一个类型的对齐值，也可以叫做**内存对齐边界**（对齐系数/对齐倍数)。对齐值是一个和内存对齐有关的值，合理的内存对齐可以提高内存读写的性能。一般对齐值是`2^n`，最大不会超过`8`(受内存对齐影响).获取对齐值还可以使用反射包的函数，也就是说：`unsafe.Alignof(x)`等价于`reflect.TypeOf(x).Align()`。对于任意类型的变量`x`，`unsafe.Alignof(x)`至少为1。对于`struct`结构体类型的变量`x`，计算`x`每一个字段`f`的`unsafe.Alignof(x，f)`，`unsafe.Alignof(x)`等于其中的最大值。对于`array`数组类型的变量`x`，`unsafe.Alignof(x)`等于构成数组的元素类型的对齐倍数。没有任何字段的空`struct{}`和没有任何元素的`array`占据的内存空间大小为`0`，不同大小为`0`的变量可能指向同一块地址。
[[lan/Golang/Go的一些标准包/unsafe包的常见使用#golang内存对齐]]

我们可以看到这三个函数的返回值都是 `uintptr` , 因为这三个函数常用来和 `unsafe.Pointor{}` 配合

#### `unsafe.Pointer`使用

##### golang的指针













#### golang内存对齐

> 内存对齐就是编译器会根据一定规则， 把数据安排到合适存储地址上， 并占用合适的地址长度。  其目的是为了   保证程序顺利高效的运行，可以让CPU快速从内存中存取到字段，避免资源浪费。

##### 内存对齐的规则

1. **起始的存储地址** 必须是 **内存对齐边界** 的倍数
2. **占用的地址长度** 必须是 **内存对齐边界** 的倍数

> 内存对齐边界是对于结构体来说的，指的是 在一个结构体中所有元素中，哪个元素占用的字节数最大， 这个元素占用的字节数就是内存对齐边界，==但是最大只能为8==
>
> 对齐边界指的是， 在一个结构体中，每个元素自己的所占用的字节数

```go
type Attribute struct {
	age int64
	height int64
	weight int64
	academic string
}
func main() {
	fmt.Println(unsafe.Sizeof(Attribute{}.academic)) // 16
	fmt.Println(unsafe.Alignof(Attribute{}.academic))// 8  string类型占用了16字节， 但是内存对齐边界最大只能为8.
	fmt.Println(unsafe.Alignof(Attribute{}))		 // 8  
}
```

