#### `reflect.Typeof()` 获取 类型对象  `reflect.Type`

程序通过类型对象可以访问任意值的类型信息。==Typeof() 方法获取到的类型不是变量的，而是变量指向的值的== 

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