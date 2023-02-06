### slice学习记录

##### slice结构

slice结构定义在 `runtime/slice.go`中

```go
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```

