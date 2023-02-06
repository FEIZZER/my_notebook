### golang string类型记录

string在goalng中是一种基本类型， 且默认是 UTF-8的字符序列。

##### string的结构

在`runtime/string.go`中定义的 `stringStruct`结构

```go
type stringStruct struct {
	str unsafe.Pointer
	len int
}
```

##### string类型注意点

- 字符串这个类型，是所有`8-bits` 字符串的集合，通常但不一定表示`utf -8`编码的文本
- 字符串可以为空，但不能为 `nil` ，此处的字符串为空是 `""`
- 字符串类型的值是不可变的, 因为string对象被分配到只读内存中。
- byte 和 string 互转是需要重新开辟空间的
- 使用len("xxx")得到的是字符串的字节数。

