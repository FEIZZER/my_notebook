### log包

##### 三种打印级别

```go
log.Println("print")
log.Fatalln("fatal")
log.Panicln("fatal")
```

不做任何配置，直接进行日志输出，会将日志打印到控制台。*其中panic级别不会输出到控制台，因为程序异常退出了* 



##### func SetOutput(w io.Writer)

设置日志输出文件

```go
logFile, err := os.OpenFile("./error.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
if err != nil {
   fmt.Println(err)
}
log.SetOutput(logFile)
log.Println("print")
log.Fatalln("fatal")
log.Panicln("fatal")
```