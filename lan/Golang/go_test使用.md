#### 单元测试

要进行一个单元测试，首先准备一个go源码的测试文件**该文件必须以 _test.go**结尾，`go test`命令不需要任何的参数，它会自动把你源码包下面所有 test 文件测试完毕，当然你也可以带上参数。

- -run \<Reg\>  运行和
- -v    显示测试的详细命令
- -mod    -mod = vendor， 指定使用vendor模式。
- -bench
- -cover  开启测试覆盖率

```go
func Test_Test(t *testing.T) {
   t.Logf("t is logging")
   fmt.Println("hahah")
}
```

在命令行中使用>> go test -run Test_Test -v

注意在使用go test时，如果使用命令行去运行test内容，go使用的是go env中指定的编译方式 **即GOOS的值**。 如果使用Goland去与运行go test，走的是IDE中设置的系统类型。*在setting->go->build Tags & vendoring*中设置。

##### testing.T 参数的使用

