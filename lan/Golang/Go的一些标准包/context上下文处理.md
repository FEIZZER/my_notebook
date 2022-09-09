### Context标准包的使用

> Context通常被称为上下文，在go中，理解为goroutine的运行状态、现场，存在上下层goroutine context的传递，上层goroutine会把context传递给下层goroutine。
>
> 每个goroutine在运行前，都要事先知道程序当前的执行状态，通常将这些状态封装在一个 context变量，传递给要执行的goroutine中。
>
> 在网络编程中，当接收到一个网络请求的request，处理request时，可能会在多个goroutine中处理。而这些goroutine可能需要共享Request的一些信息；当request被取消或者超时时，所有从这个request创建的goroutine也要被结束。

##### 创建context

- `context.Backgroud()` 是上下文的默认值，所有其他的上下文都应该从它衍生（Derived）出来。
- `context.TODO()`应该只在不确定应该使用哪种上下文时使用；

实际上这两个方法是完全一样的，他们互为别名。返回的是一个context包内部类型的引用 ==但不是同一个引用==

```go
type emptyCtx int
var (
	background = new(emptyCtx)
	todo       = new(emptyCtx)
)
func Background() Context {
	return background
}
func TODO() Context {
	return todo
}
```

上面的两种方式是创建根`context`，不具备任何功能，具体实践还是要依靠`context`包提供的`With`系列函数来进行派生。 派生的context只要是为了**携带数据信息** 或 **超时控制**

#### 携带数据信息 

##### context.WithValue()

`func WithValue(parent Context, key, val any) Context {}`

通过这个方法可以创建一个带有key-value键值对信息的是的`ctx`, 经由他生成的子`ctx`也会带有该信息，我们可以使用这个不断穿透下去的信息去打印日志等操作。在使用`WithValue`的时候需要注意的点：

- 



#### 超时控制

##### context.

##### 

