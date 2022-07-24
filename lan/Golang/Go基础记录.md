### Go的包导入

[(2条消息) 彻底搞懂golang的GOROOT和GOPATH_知更鸟女孩的博客-CSDN博客_goroot和gopath](https://blog.csdn.net/qq_38151401/article/details/105729884) 

Go语言似乎弱化了项目的概念，强化包的概念。有两个主要的路径GOPATH和GOROOT。

- GOROOT   GOROOT就是go的安装路径，类似于java的JDK

- GOPATH    GOPATH是工作空间路径， 保存go的项目代码和第三方依赖包。  GOPATH目录下有bin， pkg， src。 bin目录存放编译后的二进制文件。

  src目录存放我们的项目代码文件，和默认模式下go get下载的包文件。pkg目录。。。。。

在import包时， Go会优先在 `%GOROOT%/src`文件中寻找 该目录中保存了Go标准库的代码，然后在`%GOPATH%\`该目录中存放的是自身代码和依赖的包。

### GO MODULES管理

### Go的基本数据类型

##### Go中的string为什么是基本数据类型

字符串虽然在 Go 语言中是基本类型 string, 但是它实际上是由字符组成的数组，类似于 C 语言中的 char [] ,作为数组会占用一片连续的内存空间。

==语言中的字符串其实只是一个只读的字节数组，不支持直接修改 string 类型变量的内存空==。

```go
func main() {
	str := "hahaha"
	str[0] = 'a'
	fmt.Print(str)
}
```

上面的代码会报错：

![image-20220719230719535](.\Go基础记录.assets\image-20220719230719535.png)

**如果我们想修改字符串，我们可以将这段内存拷贝到堆或者栈上，将遍历的类型转换为 []byte 之后就可以进行，修改后通过类型转换就可以变回 string, 对原变量重新赋值即可。**

```go
func main() {
	str := "hahaha"
	byte_str := []byte(str)
	byte_str[0] = 'a'
	str = string(byte_str)
	fmt.Print(str)
}
```

### Go中的复合类型（Aggregate Types）

##### 定长数组

go语言中的定长数组是默认值传递的， 因此它可以直接使用 `==` 符号去判断两个定长数组的值是否一样 *必须要是长度相同的定长数组，否则编译不通过。*

##### slice或切片 （变长数组[]int）

###### 切片底层结构

slice的定义可以在`runtime/slice.go` 中看到 

```go
type slice struct {
   array unsafe.Pointer
   len   int
   cap   int
}
```

包含一个指向数组开头的指针， 两个int值表示长度和容量。

###### 为什么append()  要返回并赋值

显然的我们说切片在传值时是引用传值是因为，slice中包含一个指针指向数组开头，但是另外两个int值代表的信息是值传递。在调用append()函数的过程中，

==长度和容量甚至指针== 都有可能会发生变化， 必须要返回赋值来更新。

###### 切片的扩容策略

```go
a1 := make([]int, 3, 3)
new_a1 := append(a1, 666)
fmt.Printf("pointer= %p, cap= %d\n", &a1, cap(a1))
fmt.Printf("pointer= %p, cap= %d", &new_a1, cap(new_a1))
```

![image-20220722153207891](.\Go基础记录.assets\image-20220722153207891-16584751452061.png) 

当cap<1024时， 扩容时直接 *2，，当cap>=102时，扩容时 *1.25.

###### 切片底层数据共享



### Go的反射使用

Go语言中的反射是由 reflect 包提供支持的，它定义了两个重要的类型 Type 和 Value 任意接口值在反射中都可以理解为由 reflect.Type 和 reflect.Value 两部分组成，并且 reflect 包提供了 `reflect.TypeOf `和 `reflect.ValueOf `两个函数来获取任意对象的 Value 和 Type。

#### `reflect.Typeof()` 获取 类型对象  `reflect.Type`

程序通过类型对象可以访问任意值的类型信息。

```go
var a int = 1
typeOfA := reflect.TypeOf(a)
fmt.Println(typeOfA.Name(), typeOfA.Kind()
// >> int   int
```

###### 使用反射需要理解类型对象中的 Name和Kind 分别是什么

- Name()返回的是具体的类型，测试如下：

  ```go
  type INT int
  func ReflectTest() {
     var a INT = 1
     typeOfA := reflect.TypeOf(a)
     fmt.Println(typeOfA.Name(), typeOfA.Kind())
  }
  // >> INT int
  ```

  再比如 type A struct 定义的结构类型 Kind是struct, Name是A.

- Kind() Kind描述的变量的基础类型（不是静态类型）。函数返回的是定义在reflect包中的枚举类型,如下：

  ```go
  type Kind uint
  const (
     Invalid Kind = iota
     Bool
     Int
     Int8
     Int16
     Int32
     Int64
     Uint
     Uint8
     Uint16
     Uint32
     Uint64
     Uintptr
     Float32
     Float64
     Complex64
     Complex128
     Array
     Chan
     Func
     Interface
     Map
     Pointer
     Slice
     String
     Struct
     UnsafePointer
  )
  ```

  ==Slice  Map   Chan,属于引用类型但是Kind仍然是独立种类。==

##### 反射可以获取结构体中成员变量的类型信息

任意值通过 reflect.TypeOf() 获得反射对象信息后，如果它的类型是结构体，可以通过反射值对象 reflect.Type 的 NumField() 和 Field() 方法获得结构体成员的详细信息。主要有如下几个方法：

- Field(i int) StructField ；根据索引返回索引对应的结构体字段的信息，当值不是结构体或索引超界时发生宕机
- NumField() int ； 返回结构体成员字段数量，当类型不是结构体或索引超界时发生宕机
- FieldByName(name string) (StructField, bool)； 根据给定字符串返回字符串对应的结构体字段的信息，没有找到时 bool 返回 false，当类型不是结构体或索引超界时发生宕机
- FieldByIndex(index []int) StructField
- FieldByNameFunc(match func(string) bool) (StructField,bool)

其中出现的返回类型 **StructField结构体 **是描述成员变量信息的结构体，通过它可以进一步获取成员变量和结构体之间的关系。 StructField结构体的声明如下：

```go
type StructField struct {
    Name string          // 字段名
    PkgPath string       // 字段路径
    Type      Type       // 字段反射类型对象
    Tag       StructTag  // 字段的结构体标签
    Offset    uintptr    // 字段在结构体中的相对偏移
    Index     []int      // Type.FieldByIndex中的返回的索引值
    Anonymous bool       // 是否为匿名字段
}
```

==通过Type属性可以访问到该成员变量的 类型对象==

#### `reflect.Valueof()` 获取 `reflect.Value`对象

这时候得到的是`reflect.Value`类型的对象，如果想要得到原值，可使用具体方法获得：

- Int() int64  ;  将值以 int 类型返回，所有有符号整型均可以此方式返回

  其他方法也类似，且返回的值均是范围最大类型

- Interface() interface {}  ；  将值以 interface{} 类型返回，可以通过类型断言转换为指定类型

##### 访问结构体中成员变量的值

- Field(i int) Value  ； 根据索引，返回索引对应的结构体成员字段的反射值对象。当值不是结构体或索引超界时发生宕机
- NumField() int  ；   返回结构体成员字段数量。当值不是结构体或索引超界时发生宕机
- FieldByName(name string) Value  ；  根据给定字符串返回字符串对应的结构体字段。没有找到时返回零值，当值不是结构体或索引超界时发生宕机
- FieldByIndex(index []int) Value  ；  多层成员访问时，根据 []int 提供的每个结构体的字段索引，返回字段的值。 没有找到时返回零值，当值不是结构体或索引超界时发生宕机
- FieldByNameFunc(match func(string) bool) Value  ；  根据匹配函数匹配需要的字段。找到时返回零值，当值不是结构体或索引超界时发生宕机



#### Go语言中的类型

go是静态类型语言，**go中的任意变量在编译时都会确定一个静态类型，运行时不可变。**











