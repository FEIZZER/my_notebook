go语言对io操作的封装和使用体现在很多地方

- io 为 IO 原语提供基本的接口
- io/ioutil封装一些实用的 I/O 函数
- fmt 实现了 I/O 的格式化
- bufio实现了带缓冲的 I/O
- net.Conn 网络的读写
- os.Stdin, Stdout 系统标准输入输出
- os.File系统文件操作

#### IO包有两个主要的接口 `io.Reader`和 `io.Writer`

##### Reader接口

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}
```



##### Writer接口
