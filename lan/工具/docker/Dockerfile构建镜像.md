[优秀Docker中文文档](https://yeasy.gitbook.io/docker_practice/image/dockerfile) 

Dockerfile有一行一行的语句组成且支持 # 开头的注释。 Dockerfile文件分为四个部分 **基础镜像信息  维护者信息  镜像操作指令  容器启动时指令**  

```shell
FROM ubuntu

MAINTAINER  docker_user docker_user@email.com

ADD ./k8s-demo_v2 /
RUN cd /
RUN chmod 777 k8s-demo_v2

CMD ./k8s-demo_v2
```

#### 构建镜像

docker build [选项] <上下文路径/URL/->

##### 上下文路径的概念

在使用docker build命令时最后往往会有一个 `.` 。这个`.` 表示docker build执行时的当前目录。这其实就是在指定 **上下文路径**。

首先我们要理解 `docker build` 的工作原理。Docker 在运行时分为 Docker 引擎（也就是服务端守护进程）和客户端工具。我们好像是在本机上执行各种doker指令，但其实一切都是以远程调用的方式实现的。一般来说，应该会将 `Dockerfile` 置于一个空目录下，或者项目根目录下。如果该目录下没有所需文件，那么应该把所需文件复制一份过来。如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 `.gitignore` 一样的语法写一个 `.dockerignore`，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。

#### Dockerfile文件内指令格式            `INSTRUCTION  arguments`

Dockerfile中的每一个指令都会建立一层文件。对于同一种指令同一种类型的执行，尽可能的将他们合并到一起，避免创建很多层联合文件。可以使用`&&`连接多条语句，使用`\`表示换行。

```shell
FROM ubuntu

MAINTAINER  docker_user docker_user@email.com

ADD ./k8s-demo_v2 /
RUN cd / \
&& chmod 777 k8s-demo_v2

CMD ./k8s-demo_v
```

##### 常见指令

###### FROM

格式   FROM \<image\>    或   FROM  \<image\>:\<tag\>  *一个特殊的基础镜像scratch 空镜像  `FROM scratch `表示不以任何镜像为基础* 

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。就像我们之前运行了一个 `nginx` 镜像的容器，再进行修改一样，基础镜像是必须指定的。而 `FROM` 就是指定 **基础镜像**，因此一个 `Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令。

###### MAINTAINER

格式  MAINTAINER  \<user_name\>  \<user_msg\>

###### COPY复制文件

格式   COPY [--chown=\<user\>:\<group\>] \<源路径\>... \<目标路径\>  。从构建的上下文目录中的源路径文件或目录复制到新一层的镜像文件目标路径处。此外，还需要注意一点，使用 `COPY` 指令，源文件的各种元数据都会保留。比如读、写、执行权限、文件变更时间等。这个特性对于镜像定制很有用

###### ADD 更高级的文件复制

ADD指令的格式和概念和COPY指令基本上一致。但是在此基础上新增了一些功能。

\<源路径\> 是一个链接时，ADD会尝试下载该文件并放入的新增镜像的目的地址处。

###### RUN

格式为  RUN \<command\>

###### CMD

- CMD ["executable","param1',"param2"] 使用 exec 执行，推荐方式。
- CMD command param1 param2 在 /bin/sh 中执行，提供给需要交互的应用。
- CMD ["param1","param2"] 提供给 ENTRYPOINT 的默认参数。
   指定启动容器时执行的命令，每个Dockerfile 只能有一条 CMD命令。如果指定了多条命令，只有最后一条会被执行。
   如果用户启动容器时指定了运行的命令，则会覆盖掉 CMD 指定的命令。



