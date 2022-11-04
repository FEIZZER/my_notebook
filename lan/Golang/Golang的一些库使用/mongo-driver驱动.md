#### Go管理mongo数据库
[[mongo基础]]
##### 驱动选择

go语言中目前只有一个主流的mongo数据库连接驱动 [mongo-go-driver的github地址](https://github.com/mongodb/mongo-go-driver)   [教程](https://www.mongodb.com/docs/drivers/go/current/usage-examples/)

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

##### mongo-driver提供给go的bson结构

提供给go的bson结构中有两个大的协议族 一个是D(),一个是RAW().

###### D族是使用原生GO的形式来简单的构造一个BSON对象, D()有四种类型：

- D    一个bson格式的文档，并且是有序的。源码中的定义的是一个`E`类型的数组

  ```go
  // 		bson.D{{"foo", "bar"}, {"hello", "world"}, {"pi", 3.14159}}
  type D []E
  ```

- E    一个`bson.D`里面的单独的元素。 源码中的定义是一个结构体，有一个key和value

  ```go
  type E struct {
  	Key   string
  	Value interface{}
  }
  ```

- M   一个无序的bson格式的文档*可以和map结构互相转化*。 源码中的定义如下

  ```go
  // 		bson.M{"foo": "bar", "hello": "world", "pi": 3.14159}
  type M map[string]interface{}
  ```

- A   一个bson形式的数组

  ```go
  // 		bson.A{"bar", "world", 3.14159, bson.D{{"qux", 12345}}}
  type A []interface{}
  ```

#### CURD操作
[[mongo-driver驱动#opt参数使用详解]]

##### 查找数据库

###### 查找一个 collection.FindOne 

`collection.FindOne(context.TODO(),  bson.D{{"name", "feizzer"}})`   返回一个 `*mongo.SingleResult`对象。  `*mongo.SingleResult`提供一个Decode(interface{}) 方法可以将查询到的数据传入==需要引用传值==。 

```go
collection.FindOne(context.Background(), bson.D{{"name", "feizzer"}}).Decode(&res)
fmt.Println(res)
```

###### 查找多个 `collection.Find` 

`func (coll *Collection) Find(ctx context.Context, filter interface{},opts ...*options.FindOptions) (cur *Cursor, err error){}`

返回一个游标类型`*mongo.Cursor`和错误信息err

游标Cursor提供一个方法`All(context.TODO(), &[]interface)`  接收游标中指向的一组值。  ==传入的接收变量必须是slice的指针==







##### 插入数据

###### collection.insertOne

```go
var doc = bson.D{{"name", "out_feizzer"}}
one, err := collection.InsertOne(context.TODO(), doc)
```

`InsertOne()` 返回 `*mongo.InsertOneResult`和err信息，其中`*mongo.InsertOneResult`是一个结构体，只包含一个数据表示插入数据的主键_id

###### collection.insertMany

```go
var docs = []interface{}{
   bson.D{{"name", "out1"}},
   bson.D{{"name", "out2"}},
}
collection.InsertMany(context.TODO(),docs)
```

其中文档的数组的类型必须是`[]interface{}`



##### 更新数据

###### collection.UpdateOne

`func (coll *Collection) UpdateOne(ctx context.Context, filter interface{}, update interface{}, opts ...*options.UpdateOptions) (*UpdateResult, error)`

如果匹配了多个文档，则只会选择匹配的第一个文档。

```go
var updateDoc = bson.D{{"$set", bson.D{{"name", "out_changed"}}}}
one, err := collection.UpdateOne(context.TODO(), bson.D{{"name", "out_feizzer"}}, updateDoc)
```

返回一个更新信息`*mongo.UpdateResult`和错误信息err。更新信息`mongo.UpdateResult`的结构定义如下：

```go
type UpdateResult struct {
	MatchedCount  int64       // The number of documents matched by the filter.
	ModifiedCount int64       // The number of documents modified by the operation.
	UpsertedCount int64       // The number of documents upserted by the operation.
	UpsertedID    interface{} // The _id field of the upserted document, or nil if no upsert was done.
}
```

如果数据库中找不到匹配的文档使之自动添加则需要指定 opt参数 `updateDoc, options.Update().SetUpsert(true)`

```go
var updateDoc = bson.D{{"$set", bson.D{{"name", "out_changed2"}}}}
one, err := collection.UpdateOne(context.TODO(), bson.D{{"name", "out_feizzer1"}}, updateDoc, options.Update().SetUpsert(true))
```

###### collection.UpdateMany

将匹配到的文档全部更新。

##### 更新操作符

$set: 更新或者新增字段, 字段存在就是更新, 字段不存在就是新增

$unset:  删除字段

$rename:  重命名字段

$inc: 更新字段值(增加或者减少字段保存的值)

$mul: 更新字段值(乘以或者除以字段保存的值)

$min: 比较保留更小字段值

$max: 比较保留更大字段值

$addToSet: 向数组字段中添加元素

$push: 向数组字段中添加元素(不去重)

$pop: 从数组字段中删除元素

$pull: 从数组字段中删除特定元素

$pullAll:  从数组字段中批量删除特定元素

##### 比较操作符

- (>) 大于 - $gt
- (<) 小于 - $lt
- (>=) 大于等于 - $gte
- (<= ) 小于等于 - $lte

##### opt参数使用详解

opt参数类型是定义在 `go.mongodb.org/mongo-driver/mongo/options`下的`UpdateOptions` 可以使用 options.Update() 方法获得一个此对象

```go
type UpdateOptions struct {
   // A set of filters specifying to which array elements an update should apply. This option is only valid for MongoDB
   // versions >= 3.6. For previous server versions, the driver will return an error if this option is used. The
   // default value is nil, which means the update will apply to all array elements.
   ArrayFilters *ArrayFilters

   // If true, writes executed as part of the operation will opt out of document-level validation on the server. This
   // option is valid for MongoDB versions >= 3.2 and is ignored for previous server versions. The default value is
   // false. See https://www.mongodb.com/docs/manual/core/schema-validation/ for more information about document
   // validation.
   BypassDocumentValidation *bool

   // Specifies a collation to use for string comparisons during the operation. This option is only valid for MongoDB
   // versions >= 3.4. For previous server versions, the driver will return an error if this option is used. The
   // default value is nil, which means the default collation of the collection will be used.
   Collation *Collation

   // A string or document that will be included in server logs, profiling logs, and currentOp queries to help trace
   // the operation.  The default value is nil, which means that no comment will be included in the logs.
   Comment interface{}

   // The index to use for the operation. This should either be the index name as a string or the index specification
   // as a document. This option is only valid for MongoDB versions >= 4.2. Server versions >= 3.4 will return an error
   // if this option is specified. For server versions < 3.4, the driver will return a client-side error if this option
   // is specified. The driver will return an error if this option is specified during an unacknowledged write
   // operation. The driver will return an error if the hint parameter is a multi-key map. The default value is nil,
   // which means that no hint will be sent.
   Hint interface{}
   // 为true表示在update操作的时候，如果没有匹配的文档则主动添加一条新的信息。
   Upsert *bool

   // Specifies parameters for the update expression. This option is only valid for MongoDB versions >= 5.0. Older
   // servers will report an error for using this option. This must be a document mapping parameter names to values.
   // Values must be constant or closed expressions that do not reference document fields. Parameters can then be
   // accessed as variables in an aggregate expression context (e.g. "$$var").
   Let interface{}
}
```

- `options.Update().SetUpsert(true)`  方法设置Upsert参数





#### 
