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

![image-20220719230719535](D:\notebook\lan\Golang\Go基础记录.assets\image-20220719230719535.png)

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

