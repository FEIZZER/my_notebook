### Go的包导入

[(2条消息) 彻底搞懂golang的GOROOT和GOPATH_知更鸟女孩的博客-CSDN博客_goroot和gopath](https://blog.csdn.net/qq_38151401/article/details/105729884) 

Go语言似乎弱化了项目的概念，强化包的概念。有两个主要的路径GOPATH和GOROOT。

- GOROOT   GOROOT就是go的安装路径，类似于java的JDK

- GOPATH    GOPATH是工作空间路径， 保存go的项目代码和第三方依赖包。  GOPATH目录下有bin， pkg， src。 bin目录存放编译后的二进制文件。

  src目录存放我们的项目代码文件，和默认模式下go get下载的包文件。pkg目录。。。。。

在import包时， Go会优先在 `%GOROOT%/src`文件中寻找 该目录中保存了Go标准库的代码，然后在`%GOPATH%\`该目录中存放的是自身代码和依赖的包。

### GO MODULES管理

### Go的基本数据类型

##### Go中的string为什么是基本数据类型

字符串虽然在 Go 语言中是基本类型 string, 但是它实际上是由字符组成的数组，类似于 C 语言中的 char [] ,作为数组会占用一片连续的内存空间。

==语言中的字符串其实只是一个只读的字节数组，不支持直接修改 string 类型变量的内存空==。

```go
func main() {
	str := "hahaha"
	str[0] = 'a'
	fmt.Print(str)
}
```

上面的代码会报错：

![image-20220719230719535](.\Go基础记录.assets\image-20220719230719535.png)

**如果我们想修改字符串，我们可以将这段内存拷贝到堆或者栈上，将遍历的类型转换为 []byte 之后就可以进行，修改后通过类型转换就可以变回 string, 对原变量重新赋值即可。**

```go
func main() {
	str := "hahaha"
	byte_str := []byte(str)
	byte_str[0] = 'a'
	str = string(byte_str)
	fmt.Print(str)
}
```

### Go中的复合类型（Aggregate Types）

##### 定长数组

go语言中的定长数组是默认值传递的， 因此它可以直接使用 `==` 符号去判断两个定长数组的值是否一样 *必须要是长度相同的定长数组，否则编译不通过。*

##### slice或切片 （变长数组[]int）

###### 切片底层结构

slice的定义可以在`runtime/slice.go` 中看到 

```go
type slice struct {
   array unsafe.Pointer
   len   int
   cap   int
}
```

包含一个指向数组开头的指针， 两个int值表示长度和容量。

###### 为什么append()  要返回并赋值

显然的我们说切片在传值时是引用传值是因为，slice中包含一个指针指向数组开头，但是另外两个int值代表的信息是值传递。在调用append()函数的过程中，

==长度和容量甚至指针== 都有可能会发生变化， 必须要返回赋值来更新。

###### 切片的扩容策略

```go
a1 := make([]int, 3, 3)
new_a1 := append(a1, 666)
fmt.Printf("pointer= %p, cap= %d\n", &a1, cap(a1))
fmt.Printf("pointer= %p, cap= %d", &new_a1, cap(new_a1))
```

![image-20220722153207891](.\Go基础记录.assets\image-20220722153207891-16584751452061.png) 

当cap<1024时， 扩容时直接 *2，，当cap>=102时，扩容时 *1.25.

###### 切片底层数据共享









