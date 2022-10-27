在golang中王编程主要通过net包来实现。提供可移植的网络io， 包括tcp/ip, udp, 域名解析和unix域socket等连接。还有net/http net/rpc实现主流的应用层连接协议。

### TCP服务连接

#### TCP服务端的实现

go中TCP服务端的实现思路：

1. 监听一个端口
2. 接收客户端请求，建立连接。 一个客户端可以同时建立多个连接。
3. 为每个连接创建goroutine进行处理

```go
import (
	"bufio"
	"fmt"
	"net"
)
func main() {
	listen, err := net.Listen("tcp", "127.0.0.1:8800")
	if err != nil {
		panic(err)
	}
	for {
		accept, err := listen.Accept()
		if err != nil {
			panic(err)
		}
		go handleConn(accept)
	}
}
func handleConn(conn net.Conn) {
	defer conn.Close()
	for true {
		reader := bufio.NewReader(conn)
		var buf [128]byte
		n, err := reader.Read(buf[:])
		if err != nil {
			fmt.Println(err)
			break
		}
		fmt.Println("收到信息: ", string(buf[:n]))
		conn.Write(buf[:n])
	}
}

```



#### TCP客户端

客户端的实现思路：

1. 建立与服务端的连接
2. 进行数据收发
3. 关闭连接

```go
import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)
func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:8800")
	if err != nil {
		panic(err)
	}
	defer conn.Close()
	inputReader := bufio.NewReader(os.Stdin)
	for true {
		readString, _ := inputReader.ReadString('\n')
		info := strings.Trim(readString, "\r\n")
		if strings.ToUpper(info) == "Q" {
			return
		}
		_, err := conn.Write([]byte(info))
		if err != nil {
			fmt.Println(err)
			return
		}
		var buf [128]byte
		n, err := conn.Read(buf[:])
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println("服务端响应信息", string(buf[:n]))
	}
}
```

