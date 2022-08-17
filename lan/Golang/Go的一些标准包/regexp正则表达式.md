### regexp正则表达式的使用

#### 常见的一些方法

##### 

##### MatchString()

```golang
matchString, err := regexp.MatchString(`^golang`, "olang")
```

返回字符串是否复合正则表达式的要求。如果 第一个参数的正则通不过 compile()  则返回的err不为nil

##### Compile()和MustCompile()

这两个方法返回两个编译好的正则对象。假如表达式不合法，Complie()返回的err不为nil，MustCompile()则是会直接抛出panic。一般情况下不推荐直接在代码中直接使用Compile()这两个方法，

