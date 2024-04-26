##### 通过vcpkg 管理windows的cpp库



##### 编写 *.proto 文件并生成 .pb 文件和  .grpc.pb文件protoc --cpp_out=. base.proto

```cmd
protoc --cpp_out=. *.proto
protoc --grpc_out=. --plugin=protoc-gen-grpc=<grpc_cpp_plugin> *.proto
```

其中 \<grpc_cpp_plugin\>是 grpc_cpp_plugin.exe 的完整路径, 如果是windows通过 vcpkg安装的话 可以在 `<vcpkg_install_dir>\packages\grpc_x64-windows\tools\grpc` 找到
