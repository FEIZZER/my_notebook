#### HTTP服务端实现

实现在本地监听8080端口的HTTP服务。

```go
import (
	"fmt"
	"net/http"
)
func hello(w http.ResponseWriter, r *http.Request)  {
	fmt.Fprintln(w, "hello")
}
func HTTPServer() {
	http.HandleFunc("/", hello)
	http.ListenAndServe(":8080", nil)
}
```

##### `http.HandleFunc()`注册处理函数的 设计模式

我们的在代码中调用`http.HandleFunc("/", hello)`将路径"/"的处理函数设置为hello函数， *处理的函数的类型必须是`func (http.ResponseWriter, *http.Request)`*。其中：

**http.responseWriter**是一个接口类型，用于向客户端发送响应，实现了`ResponseWriter`接口的类型显然也实现了`io.Writer`接口。所以在处理函数`index`中，可以调用`fmt.Fprintln()`向`ResponseWriter`写入响应信息。

```go
type ResponseWriter interface {
	Header() Header
	Write([]byte) (int, error)
	WriteHeader(statusCode int)
}
```

**\*http.Request** 表示http的请求对象， 该对象包含请求的url， 首部， 表单数据等。



回到`net/http.HandleFunc()`函数，源码入下： 

```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	DefaultServeMux.HandleFunc(pattern, handler)
}
```

该函数实际只调用了 `DefaultServeMux.HandleFunc(pattern, handler)`。 其中 **DefaultServeMux**是**ServeMux**的实例，定义如下：

```go
var DefaultServeMux = &defaultServeMux
var defaultServeMux ServeMux
type ServeMux struct {
	mu    sync.RWMutex
	m     map[string]muxEntry
	es    []muxEntry // slice of entries sorted from longest to shortest.
	hosts bool       // whether any patterns contain hostnames
}
```

==ServeMux多路复用器， 后续学习== 



再回到 `DefaultServeMux.HandleFunc()`函数，源码如下：

```go
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if handler == nil {
		panic("http: nil handler")
	}
	mux.Handle(pattern, HandlerFunc(handler))
}
```

该函数实际是调用了 `mux.Handle(pattern, HandlerFunc(handler))` 。 HandlerFunc(handler) 并不是函数调用，而是类型转化。 这里**HandlerFunc**类型实现了**Handler**接口， 定义如下:

```go
type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}
type HandlerFunc func(ResponseWriter, *Request)
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
```

`HandlerFunc`实际上是以函数类型`func(ResponseWriter, *Request)`为底层类型，为`HandlerFunc`类型定义了方法`ServeHTTP`。==go语言中允许为基于函数的类型定义方法== 。

最后的`mux.Handle(pattern, HandlerFunc(handler))`的调用才是将函数和对应路径进行注册。 该函数的源码定义如下

```go
func (mux *ServeMux) Handle(pattern string, handler Handler)
```

##### `http.Handle()`也可以为路径注册处理函数

`Handle()`的源码如下， 直接接收一个类型为Handler的参数

```go
func Handle(pattern string, handler Handler) { DefaultServeMux.Handle(pattern, handler) }
```

使用时，传入一个接口实现HTTPSever() 方法即可， 最终注册的函数就是实现的该方法。

```go
type Index struct {
}
func (i Index) ServeHTTP(w http.ResponseWriter,r *http.Request)  {
	fmt.Fprintln(w, "index")
}
func HTTPServer() {
	http.Handle("/", Index{})
	http.ListenAndServe(":8080", nil)
}
```

*为了便于区分，我们将通过`HandleFunc()`注册的称为处理函数，将通过`Handle()`注册的称为处理器。通过上面的源码分析不难看出，它们在底层本质上是一回事。*



##### `http.ListenAndServe(":8080", nil)`监听本地的8080端口



