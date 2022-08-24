#### Go管理mongo数据库
[[mongo基础]]
##### 驱动选择

go语言中目前只有一个主流的mongo数据库连接驱动 [mongo-go-driver的github地址](https://github.com/mongodb/mongo-go-driver) 



##### 下载获取源码

如果使用 GO MODULE管理模式 go get下载的包会放在`GOPATH/pkg/mod`文件夹下。

```shell
go get go.mongodb.org/mongo-driver/mongo
```



##### 连接数据库

1. 在ApplyURI设置路径时，需要指定数据库；但是连接完成过后，只要用户有权限，还是可以访问其他数据库。  非常怪。。。。。
2. mongo用户的权限管理有点复杂，先使用root超级管理员吧。

```go
import (
	"context"
	"fmt"
	"log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetConnectClient() *mongo.Client {
   clientOptions := options.Client().ApplyURI("mongodb://admin:1234@10.190.221.111:27017/test")
   // 连接到MongoDB
   client, err := mongo.Connect(context.TODO(), clientOptions)
   if err != nil {
      log.Fatal(err)
   }
   // 检查连接
   err = client.Ping(context.TODO(), nil)
   if err != nil {
      log.Fatal(err)
   }
   fmt.Println("Connected to MongoDB!")
   return client
}
```

###### 获取连接后 指定数据库和集合

```go
client := GetConnectClient()
client.Database("database_name").collection("collection_name")
```



