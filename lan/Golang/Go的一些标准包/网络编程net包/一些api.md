GO语言"net/url"包中"QueryUnescape"函数的用法及代码示例。

**用法:**

```
func QueryUnescape(s string)(string, error)
```

QueryUnescape 执行 QueryEscape 的逆变换，将 "%AB" 形式的每个 3 字节编码子串转换为 hex-decoded 字节 0xAB。如果任何 % 后面没有跟两个十六进制数字，则返回错误。