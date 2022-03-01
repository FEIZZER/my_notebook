## docker

docker是一个开源的应用容器引擎，基于go语言。时开发者能够打包他们的应用以及依赖包到一个可移植的容器中去。

##### docker的三要素

###### 镜像image

docker的镜像就是只读的模板，一个镜像可以创建很多个容器。

###### 容器container

看作是一个简易的版的linux环境和运行在其中的应用程序

###### 仓库repository

仓库（repository）是集中存放镜像文件的场所 

##### centos7的docker安装

###### 卸载旧版的docker

```
 sudo yum remove docker \
 docker-client \
 docker-client-latest \
 docker-common \
 docker-latest \
 docker-latest-logrotate \
 docker-logrotate \
 docker-engine
```

###### 安装yum工具包和其他的工具

```
 sudo yum install -y yum-utils
```

###### 使用yum-config-manager --add-repo 添加安装库

```
sudo yum-config-manager \
 --add-repo \
 https://download.docker.com/linux/centos/docker-ce.repo
```

###### 安装docker

```
yum install docker-ce docker-ce-cli containerd.io
```

###### 设置docker随linux开机自启

```
systemctl enable docker
```

###### 配置阿里云的镜像

按照网站上的步骤即可 https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

##### ==docker的一些原理==



#### docker的常见操作

##### 镜像命令

- ·`docker images [option]` 查看本机现有的镜像.可选的option有：
  -  -a,带上中间层
  - -q， 只显示镜像的ID
  - --digests，显示关于该镜像的备注
  - --no-trunc,显示镜像完整的信息（完整的镜像ID）
- `docker search [option] <images>`  去远程仓库搜索与 images 有关的镜像。可选的opiton：
  - -s 30 只显示 stars数在30以上的的镜像
- `docker pull <image:tag> `从远程仓库依据 镜像名和tag 拉取镜像，tag缺省是就是latest
- `docker rmi <image:tage>`  删除本地的镜像，tag缺省就是latest

##### 容器命令

- `docker run [option] <image>` 通过本机现有 的镜像新建并启动容器，可选的option有：
  - -it ， i表示保持打开状态，分配一个交互终端； t 表示分配一个伪tty设备，容器启动后会进入命令行。
  - -d ,  让容器在后台运行
  - --name ,  为新建的容器指定名字
- `docker ps [option]` 列出当前本机所有运行的容器。可选的option有：
  - -a ，显示所有容器包未运行的
  - -l ， 显示最近创建的容器
  - -n \<n\>， 列出最近创建的n个容器
  - -q ， 静默模式，只显示容器的ID
- `docker stop <containerID>`  依据容器的ID关闭容器
- `docker kill <containerID>` 依据容器ID 直接关闭容器
- `docker start <containerID>` 启动容器
- `docker restart <containerID>` 重启容器
- `docker rm <containerID>` 删除容器
- `docker logs [option] <containerID>` 显示容器运行过程的打印日志，可选的option有：
  - -f ， 实习显示新的log
  - -t ，显示日志生成的时间，，默认是中时区
  - --tail \<n\> , 显示最后n条logs

