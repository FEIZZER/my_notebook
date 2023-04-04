### channel管道

##### channel声明

```go
// 无缓冲的channel
var channel 			= make(chan int)
// 带缓冲的channel
var channelWithBuffer 	= make(chan int, 10)
// nil的chan， 在读或写的时候不会panic， 但是会一直阻塞
var nilChannel chan int = nil
```

