### 标准包json的使用

##### 序列化函数 `Marshal()`函数

源码的定义 `func Marshal(v any) ([]byte, error)`。 将struct转化为json。一些类型转变：

- 布尔型转换为 JSON 后仍是布尔型，如true -> true
- 浮点型和整数型转换后为JSON里面的常规数字，如 1.23 -> 1.23
- 字符串将以UTF-8编码转化输出为Unicode字符集的字符串，特殊字符比如<将会被转义为\u003c
- 数组和切片被转换为JSON 里面的数组，[]byte类会被转换为base64编码后的字符串，slice的零值被转换为null
- 结构体会转化为JSON对象，并且只有结构体里边以大写字母开头的可被导出的字段才会被转化输出，而这些可导出的字段会作为JSON对象的字符串索引
- 转化一个map 类型的数据结构时，**该数据的类型必须是 map[string]T**（T 可以是encoding/json 包支持的任意数据类型）



##### 反序列化函数`Unmarshal()`

源码的定义 `func Unmarshal(data []byte, v any) error` 。 **第二个参数往往是引用传递** .

```go
func UnMarshalTest(value interface{}) {
   arr := []interface{}{1, 2, 3}
   res := []interface{}{}
   marshal, _ := json.Marshal(arr)
   json.Unmarshal(marshal, &res)
   fmt.Println(res)
}
// >> [1, 2, 3]
```

在使用`Unmarshal()`函数将一个[]byte类型反序列化赋值给一个interface{}空接口的时候， 该res最后反射出来的类型是 **map[string] interface{} **  

```go
marshal, _ := json.Marshal(Man{"feizzer", "big"})
var res interface{}
json.Unmarshal(marshal, &res)
fmt.Println(reflect.TypeOf(res))
//>> map[string]T
```
