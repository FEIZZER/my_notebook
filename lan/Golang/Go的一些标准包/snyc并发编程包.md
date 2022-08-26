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

- ```go
  func SyncTest() {
  	vals := []Val{{1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}}
  	for _, v := range vals {
  		v := v
  		go func() {
  			v.print()
  		}()
  	}
  }
  ```

- ```go
  func SyncTest() {
  	vals := []Val{{1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}}
  	for _, v := range vals {
  		go func(v Val) {
  			v.print()
  		}(v)
  	}
  }
  ```

  



##### 