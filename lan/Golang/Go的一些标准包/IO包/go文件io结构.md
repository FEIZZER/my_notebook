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

Read()方法尝试将len(p)个字节读取到p中。它返回实际读取的字节数，以及错误发生时的错误信息。

1. 如果读取的数据n>0,则返回的err = nil
2. 如果方法调用时，没有数据可读。则返回n=0，err=EOF
3. io.EOF 变量的定义：var EOF = errors.New("EOF")，是 error 类型。根据 reader 接口的说明，在 n > 0 且数据被读完了的情况下，当次返回的 error 有可能是 EOF 也有可能是 nil。

##### Writer接口

```go
type Writer interface {
   Write(p []byte) (n int, err error)
}
```

Write 方法将 len(p) 个字节从 p 中写入到对象数据流中。它返回从 p 中被写入的字节数 n，以及发生错误时返回的错误信息。

1. 如果 p 中的数据全部被写入，则 err 应该返回 nil。
2. 如果 p 中的数据无法被全部写入，则 err 应该返回相应的错误信息。

