### 并发编程实践

#### 限制goroutine数量 限制并发

```go
var limitGoroutine = make(chan int, 3)
func Go() {
	for {
		limitGoroutine <- 0
		go func() {
			time.Sleep(3 * time.Second)
			fmt.Println("=====")
			<- limitGoroutine
		}()
	}
}
//一次性会打印三行"======", 同一时间最多只有三个协程
```

#### goroutine并发编程踩坑记录

##### ==在代码中使用for true{}  影响到了并发== 

##### 小心闭包

使用go 和func 关键字，开启一个新协程运行一个匿名函数时错误的使用了闭包的特性。下面的代码由于闭包 只是将for循环语句中变量v绑定到了闭包函数中，所以打印出来极有可能是切片的后几个元素，还会造成资源争抢的问题

```go
func (v Val) print() {
	fmt.Println(v.str)
}
func SyncTest() {
   vals := []Val{{1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}}
   for _, v := range vals {
      go func() {
         v.print()
      }()
   }
}
```

###### 正确的写法

```go
func SyncTest() {
	vals := []Val{{1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}}
	for _, v := range vals {
		v := v
		go func() {
			v.print()
		}()
	}
}
func SyncTest() {
	vals := []Val{{1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}}
	for _, v := range vals {
		go func(v Val) {
			v.print()
		}(v)
	}
}
```

#### sync.Mutex互斥锁

> 互斥锁的设计原理，使用一个容量为1的通道来保证同一时间内有多个goroutine能够访问共享变量。

Go中`sync.Mutex`的结构体是

```go
type Mutex struct {
	state int32
	sema  uint32
}
```

##### sema是用于控制锁状态的信号量

当持有互斥锁的goroutine释放锁后，会释放sema信号量，这个信号量会唤醒之前争抢锁而阻塞的goroutine来获取锁。

##### state是表示当前互斥锁的状态

<img src="sync并发编程包.assets/39f4e634c0b53b983aea4321744b497a.png" alt="img" style="zoom:67%;" /> 

- **wait_num**   记录了当前争抢这个锁的goroutine的数量 

- **starving**      当前是否处于饥饿状态。0正常状态， 1饥饿状态。

  - **饥饿模式**下， 新出现的争抢锁的goroutine不会进行锁的争抢，而是加入到队列尾部阻塞等待获取锁。

    当一个goroutine等待锁的时间超过1ms， 会进入到饥饿模式

  - **正常模式**下， 所有阻塞在等待队列中的goroutine会按顺序进行锁获取，当唤醒一个等待队列中的goroutine时，此goroutine并不会直接获取到锁，而是会和新请求锁的goroutine竞争。 通常新请求锁的goroutine更容易获取锁，这是因为新请求锁的goroutine正在占用cpu片执行，大概率可以直接执行到获取到锁的逻辑。

    当获取到锁的goroutine是当前队列中最后一个goroutine时，会切换到正常模式。

    当获取到锁的groutine其等待时间不超过1ms，会切换到正常模式。

- **woken**        当前锁是否有goroutine被唤醒。 0没有goroutine被唤醒， 1有goroutine正在加锁过程中。

- **locked**        当前锁是否被goroutine持有。 0未被持有， 1已被持有。

#### sync.RWMutex读写互斥锁

RWMutex一般都是基于互斥锁，条件变量（condition variables）或者信号量（semaphores）等并发原语来实现。**Go标准库中的RWMutex是基于Mutex实现的。**

- **readers-writers**基于对读和写的优先级不同，设计和实现也分为三类：
- **Read-preferring**：读优先的设计可以提供很高的并发性，但是，在竞争激烈的情况不可能导致写饥饿。这是因为，如果有大量的读，这种设计会导致只有所有的读都释放了锁之后，写才可能获取到锁。
- **Writer-preferring**：写优先的设计意味着，如果已经有一个writer在等待请求锁的话，它会阻止新来的请求锁的reader获取到锁，所以优先保证writer。当然，如果有一些reader已经请求了锁的话，新请求的writer也会等待已经存在的reader都释放锁之后才能获取。写优先级设计中的优先权是针对新来的请求而言的。这种设计主要避免了writer的饥饿问题。

*go中的RWMutex设计时基于 writer-preferring, 一个阻塞的Lock()调用会排除新的read请求， 优先请求到锁。*

##### RwMutex提供的方法

- Rlock():读锁定
- RUnlock()：解除读锁定
- Lock(): 写锁定，与Mutex完全一致
- Unlock()：解除写锁定，与Mutex完全一致
- Locker():   方便获取具体的锁对象。

==RWMutex适合**多读少写**的数据访问情况， 对于普通的数据竞争由于RWMutex额外的记簿消耗性能可能反而会下降== 





