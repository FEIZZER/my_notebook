### log包

##### 三种打印级别

Print系列(Print|Printf|Println),Fatal系(Fatal|Fatalf|Fatalln)和Panic系列(Panic|Panicf|Panicln)来使用

```go
log.Println("print")
// 一条会触发fatal的函数，Fatal系列函数会在写入日志信息后调用os.Exit(1)。
log.Fatalln("fatal")
// Panic系列函数会在写入日志信息后panic。
log.Panicln("panic")
```

不做任何配置，直接进行日志输出，会将日志打印到控制台。

##### func SetOutput(w io.Writer)

设置日志输出文件

```go
logFile, err := os.OpenFile("./error.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
if err != nil {
   fmt.Println(err)
}
log.SetOutput(logFile)
log.Println("print")
```





##### 