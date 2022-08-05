### docker数据卷

docker的镜像是由多个只读的文件系统叠加在一起形成的。当我们在我启动一个容器的时候，docker会加载这些只读层并在这些只读层的上面(栈顶)增加一个读写层。这时如果修改正在运行的容器中已有的文件，那么这个文件将会从只读层复制到读写层。该文件的只读版本还在，只是被上面读写层的该文件的副本隐藏。当删除docker,或者重新启动时，之前的更改将会消失。在Docker中，只读层及在顶部的读写层的组合被称为Union File System（联合文件系统)

##### 常见命令

docker create volume

docker volume ls

docker inspect  \<卷名\>

docker volume rm \<卷名\>

docker volume prune  删除无主的卷

docker rm -v \<容器id\>

##### 匿名挂载

指定了容器内的路径

```shell
docker run -it -d -v /etc/vol ubuntu
```

##### 具名挂载

指定  卷名:容器内挂载路径。  如果卷名已经存在则使用该卷，如不存在则新建一个数据卷并命名

```
docker run -it -d -v 卷名:/etc/vol ubuntu
```

##### 指定路径挂载

```shell
docker run -it -d -v  宿主机路径:容器路径  ubuntu
```

==通过这种方式创建的卷 docker volume ls无法查看== 

##### 和其他容器一起挂载

```shell
docker run -it -d --volumes-form container_id/container_name:容器内路径 ubuntu
```



##### 设定卷的权限

```shell
docker run -it -d -v  宿主机路径:容器路径:ro/wr  ubuntu
```

- ro ;  	read only 只能读取,表示容器内部无权操作该目录下文件，宿主机可以写
- wr；   可读写

