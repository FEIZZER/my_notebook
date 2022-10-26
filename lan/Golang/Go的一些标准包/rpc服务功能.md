[rpc远程调用技术](rpc远程调用技术.md) 

### go中rpc的实现

go语言的rpc实现包在net/rpc包下， 显然rpc服务的实现是基于net包的。

先构造一个HelloService类型，为HelloService实现一个Hello方法， Hello方法要被远程调用必须满足Go语言的RPC规则：**方法只能有两个可序列化的参数，第二个参数是指针类型， 且必须返回一个error类型，必须是一个公开方法**

```go
type HelloService struct {
}
func (receiver *HelloService) Hello(request string, reply *string) error {
	*reply = "hello:" + request
	return nil
}
```

之后就可以把HelloService类型的对象注册为一个RPC的服务, 其中 rpc.Register 函数调用会将对象类型中所有满足 RPC 规则的对象方法注册为 RPC 函数，所有注册的方法会放在 “HelloService” 服务空间之下。然后我们建立一个唯一的 TCP 连接，并且通过 rpc.ServeConn 函数在该 TCP 连接上为对方提供 RPC 服务

```go
rpc.RegisterName("HelloService", new(HelloService))

listener, err := net.Listen("tcp", ":1234")
if err != nil {
	log.Fatalln(err)
}
accept, err := listener.Accept()
if err != nil {
	log.Fatalln(err)
}
rpc.ServeConn(accept)
```

之后另开一个程序运行客户端请求.  `client.Call()`的第一个参数表明服务名称和要调用的方法， 第二参数是传入的request参数，第三个参数是reply参数。

```go
func main() {
	client, err := rpc.Dial("tcp", "localhost:1234")
	if err != nil {
		log.Fatal(err)
	}
	var reply string
	err = client.Call("HelloService.Hello", "feizzer", &reply)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(reply)
}
//运行结果 >> hello:feizzer
```

#### 客户端异步的调用服务 client.go()

#### RPC实现WATCH功能

#### 反向RPC



##### go rpc服务中的编码

默认是gob  ，暂时不做学习

##### http上rpc服务

Go 语言内在的 RPC 框架已经支持在 Http 协议上提供 RPC 服务。但是http框架上的rpc服务编码依然是内置的gob编码，其他语言依然无法访问。[protobuf数据序列化](protobuf数据序列化.md)     [go的grpc的功能](go的grpc的功能.md)



