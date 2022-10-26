### protobuf序列化

protobuf是google提出的一种跨平台跨语言的数据序列化方式。 非常适合作为网络通讯中的数据载体；是二进制流的方式，比json更加高效。

*基本的使用见代码注释部分*

```protobuf
//.proto 文件的第一个非注释行用于指定语法版本，此处为“proto3”，如果不指定，则默认为“proto2”；
syntax = "proto3";
//package的定义主要是为了proto中的命名冲突
package test;
//最基本的单元是message
//此外 .proto文件行尾必须要加; 区别与 .go文件
//生成的go语言路径和包名，使用go语言时此参数必须
option go_package = "./test;test"; //这里是在当前文件夹下的test文件夹内生成test.pb.go文件
message element {
	//message中一个字段包含三部分 字段类型 字段名称 字段编号
	string keyword = 1;
	int number = 2;
}
```

##### 生成go文件的命令   `protoc --proto_path=. --go-grpc_out=. search.proto`



#### 特殊字段

| 标识     | 说明                                                  | 备注                              |
| :------- | :---------------------------------------------------- | :-------------------------------- |
| enum     | 枚举（数字从0开始），作用是为字段指定某“预定义值序列” | enum Type {MAN=0;WOMAN=1;OTHER=2} |
| message  | 消息体                                                | message SearchRequest{}           |
| repeated | 数组/集合                                             | repeated User users = 1;          |
| import   | 导入定义                                              | import “protos/user.proto”;       |
| extend   | 扩展                                                  | extend User{}                     |
| package  | 包名                                                  | 相当于命名空间，用于防止命名冲突  |

#### 数据类型

##### 关于字段编号

- 每个字段都有一个唯一的编号，用于在二进制的消息体中识别定义的字段。因此如果message在使用中，则不允许修改字段编号
- 将message编码为二进制的消息体时，编号1-15会占一个字节，16-2047会占两个字节
- 编号19000-19999属于保留编号， 定义message时不可用。

##### 基础数据类型

| 类型     | 备注                                                         |
| :------- | :----------------------------------------------------------- |
| double   | 浮点数，可以理解为float64                                    |
| float    | 单精度浮点数，可以理解为float32                              |
| int32    | 使用可变长编码方式。编码负数时不够高效，如果字段可能含有负数，建议使用sint32 |
| int64    | 使用可变长编码方式。编码负数时不够高效，如果字段可能含有负数，建议使用sint64 |
| uint32   | 无符号整数，使用可变长编码                                   |
| uint64   | 无符号整数，使用可变长编码                                   |
| sint32   | 有符号整数，使用可变长编码，编码时比通常的int32高效          |
| sint64   | 有符号整数，使用可变长编码，编码时比通常的int64高效          |
| fixed32  | 总是4个字节，如果数值总是比2^28大的话，这个类型会比uint32高效 |
| fixed64  | 总是8个字节，如果数值总是比2^56大的话，这个类型会比uint64高效 |
| sfixed32 | 总是4个字节                                                  |
| sfixed64 | 总是8个字节                                                  |
| bool     | 布尔类型                                                     |
| string   | 字符串，必须是utf-8编码或者7-bit ASCII编码的文本             |
| bytes    | 可能包含任意顺序的字节数据                                   |

##### 枚举类型

```go
syntax = "proto3";
option go_package = "./;test";
package main;
enum Gender{
	UNKONW = 0;
	MNA = 1;
	WOMAN = 2;
}
message String {
	string value = 1;
	Gender gender = 2;
}
```

所有的枚举定义都需要包含一个常量映射到0的首行定义。必须要有0值，作为枚举类型的默认值。

##### 嵌套类型

```protobuf
message Person {
	string value = 1;
	Gender gender = 2;
	dep.Soul soul = 3;
	message Leg {
		int32 lenght = 1;
	}
}
message Dog{
	Person.Leg leg = 1;
}
```

##### 使用其他message类型

对于同一个文件的proto文件的message结构体，可以直接使用。如果在不同的proto文件，可以使用import引入 。 

**option go_package=**指定的是生成的xxx.pb.go文件的**路径和package名**， 所以要**避免go_package=指定两个proto文件生成的go文件在同一个路径却不是同一个package** 

###### ./dep.proto文件

```protobuf
syntax = "proto3";
option go_package = "./;test";

package dep;

message Soul {
    int32 weight = 1;
}
```

###### ./test.proto文件

```protobuf
syntax = "proto3";
option go_package = "./;test";
package main;
import "dep.proto";
enum Gender{
	UNKONW = 0;
	MNA = 1;
	WOMAN = 2;
}
message Person {
	string value = 1;
	Gender gender = 2;
	//使用Soul类型时， 带上dep所属的package
	dep.Soul soul = 3;
}
```

##### 映射map类型

使用map关键字可以创建一个映射，语法如：

```
map<key_type, value_type> map_field = N;
```

其中：

- key_type 只能是整数或字符串，enum不能作为key_type;
- value_type 是除了映射（map）意外的任意类型；

示例如：

```
map[int64, User] users = 2;
```

关于映射需要注意：

- 映射的字段不能是数组，即不能使用repeated规则；
- 映射的值是无序的，所以不要依赖映射里元素的顺序（想想golang）；
- 如果键重复，则以最后的为准，如果是从文本文件解析，存在重复键时，解析可能会失败；

##### 数组repeated类型

#### import依赖导入

##### 导入路径

##### 公共依赖项

偶尔会出现一个**main.proto**文件需要非常多的其他proto文件的依赖，可以考虑使用一个**dep.proto**文件导入所需的全部定义，最后main.proto只需要import此文件就可以了。当然一般情况下只能直接导入的proto文件定义。

如果需要多级import导入的定义（公共依赖项），可以使用 **`import public`** 的方式来导入。

