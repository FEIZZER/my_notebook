### goroutine



### 通道

> goroutine是Go程序并发的知执行体， 通道是goroutine之间的连接。通道是可以让一个goroutine发送消息给另一个goroutine的通信机制。每一个通道是一个具体类型的管道。

- 类似于map， channel是一个通过make创建的数据结构的引用

  ```go
  var ch chan int = make(chan int)
  ```

- 同种类型的数据通道可以进行 == 判断，当他们指向同一个引用的时候为 true

- 通道支持三种擦操作 **发送send ， 接收receive ， 关闭close** 

  - 接收和发送统称为通信，他们必须在两个协程中执行
  - **关闭**操作，用来指示该数据通道没有要发送的数据了。尝试向关闭的channel中发送值会导致程序崩溃，从关闭的channel中接收值则不会，如果channel没有数据了，接收到的数据为该数据类型对应的零值。

  ```go
  ch <- 1  		//发送
  _ := <- ch		//接收
  close(ch)		//关闭
  ```

- `make(chan int, 3)`创建带三个缓冲的数据通道。 `cap(ch)`可以得到通道的缓冲区数量。 `len(ch)`可以得到通道中的数据数量。

### goroutine和通道编程实践

#### 单项通道

- 向这样把一个双通channel类型传递给一个单向的channel类型后，只能用它进行单向的数据通信。
- 利用range，当发送方关闭了channel，range也会自动退出。

```go
func main() {
	var channel1 = make(chan int)
    
	go pushChan(channel1)
	getChan(channel1)
}

func pushChan(out chan<- int) {
	for i := 0; i < 10; i++ {
		out <- i
	}
	close(out)
}
func getChan(in <-chan int) {
	for v := range in {
		fmt.Print(v)
	}
}
//运行结果 >> 0123456789
```

#### 并发循环程序与外界程序通信的实现思路

**通过sync.WaitGroup来管控是否全部是执行完成**

```go
func main() {
	var strs = []string{"war", "hello", "happy"}
	var channel = make(chan string, len(strs))
	
	ConcurrentRun(strs, channel)

	for str := range channel {
		fmt.Printf("%s, ", str)
	}
}

func ConcurrentRun(strToHandle []string, resChan chan<- string) {
	var wg sync.WaitGroup
	for _, v := range strToHandle {
		wg.Add(1)
		go func(str string) {
			defer wg.Done()
			resChan <- str
		}(v)
	}
	go func() {
		wg.Wait()
		close(resChan)
		return
	}()
}
```

#### select多路复用

> 在某些场景下，需要同时从多个通道接收数据。数据在接收数据时，如果没有数据可以接收将会发生阻塞。为了应对这种场景，Go内置了select关键字，可以同时相应多个通道的操作。select的使用类似于switch语句，其有一列case分支和一个默认分支。每一个case会对应一个通道的通信过程。select会一直等待，知道某个case的通信操作完成，就会执行case分支对应的语句。==对于多个case满足条件的情况，select会随机选择一致情况==



### goroutine中数据竞争可能导致的并发安全问题

在golang中我们不说线程安全，而是说**并发安全**， *因为goroutine不是线程，是协程*。

数据竞争的发生，一般都会导致并发不安全。对数据竞争的一个直观定义：

> 当存在两个或两个以上的goroutine访问相同的变量，且至少有一个goroutine会对数据产生写操作的情况下出现。

避免数据竞争的方式大致有三种思路：

##### 避免对数据纪念性写操作

##### 避免多个goroutine对数据的访问

##### 避免多个goroutine同时对数据进行访问
[sync并发编程包](sync并发编程包.md)


