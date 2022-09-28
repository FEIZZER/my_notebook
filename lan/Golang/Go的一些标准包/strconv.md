### strconv

strconv包实现了go语言中基本数据类型和其字符串表示的相互转化。

#### 类型转化

##### string和int之间的类型转换

源码的函数签名  **`func Atoi(s string) (int, error)`** 和 **func Itoa(i int) string** 

```go
atoi, _ := strconv.Atoi("11")
fmt.Println(atoi)
itoa := strconv.Itoa(11)
fmt.Println(itoa)
```



