### log包

##### 三种打印级别

Print系列(Print|Printf|Println),Fatal系(Fatal|Fatalf|Fatalln)和Panic系列(Panic|Panicf|Panicln)来使用

```go
log.Println("print")
// Panic系列函数会在写入日志信息后panic。
log.Panicln("panic")
// 一条会触发fatal的函数，Fatal系列函数会在写入日志信息后调用os.Exit(1)。  defer不会执行。
log.Fatalln("fatal")
```

不做任何配置，直接进行日志输出，会将日志打印到控制台。

##### func SetOutput(w io.Writer)

设置日志输出文件， 如果不设置则默认打印到控制台

```go
logFile, err := os.OpenFile("./error.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
if err != nil {
   fmt.Println(err)
}
log.SetOutput(logFile)
log.Println("print")
```

![content](log包打印日志.assets/content.png) 

##### func SetFlags(flag int)

log打印的日志默认是带有时间信息， 可以使用`setFlags(flag int)` 设置时间信息的格式。改函数提供了**多个参数组合使用**， 其中有些参数联合使用其中一个会被覆盖。

```go
const (
	Ldate         = 1 << iota     // the date in the local time zone: 2009/01/23
	Ltime                         // the time in the local time zone: 01:23:23
	Lmicroseconds                 // microsecond resolution: 01:23:23.123123.  assumes Ltime.
	Llongfile                     // full file name and line number: /a/b/c/d.go:23
	Lshortfile                    // final file name element and line number: d.go:23. overrides Llongfile
	LUTC                          // if Ldate or Ltime is set, use UTC rather than the local time zone
	LstdFlags     = Ldate | Ltime // initial values for the standard logger
)
```

比如这里的`log.Ltime`会被`log.Lmicroseconds`覆盖掉

```go
func main() {

	logFile, err := os.OpenFile("error.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		fmt.Println(err)
	}
	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.Llongfile)
	log.SetOutput(logFile)
	log.Println("today is a great day")
}
```

![content](log包打印日志.assets/content-1666679627468-2.png) 

##### func SetPrefix(prefix string) 

设置打印日志的前缀信息

```go
logFile, err := os.OpenFile("error.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
if err != nil {
	fmt.Println(err)
}
log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.Llongfile)
log.SetOutput(logFile)
log.SetPrefix("象牙塔森林")
log.Println("today is a great day")
```

![content](log包打印日志.assets/content-1666679661973-4.png) 

##### **func  New(out io.Writer, prefix  string , flag  int)   *Logger** 

一个项目中有多种日志打印需求的时候可以新建logger对象来实现。