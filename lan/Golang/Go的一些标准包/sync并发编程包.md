### 并发编程实践

#### 使用带有goroutine数量限制并发



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





