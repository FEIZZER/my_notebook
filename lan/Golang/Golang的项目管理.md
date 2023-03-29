##### 发展变化

从 v1.5 版本开始就引入了 vendor模式  *暂时不去了解*

从 v1.11版本引入了GO MODULE 作为依赖解决方案。

#### GO MODULE模式使用

使用命令`go env -w GO111MODULE=on`开启GO111MODULE=on  全局使用GO MODULE项目管理模式。 几个常用的命令

- `go mod init`  初始化一个模块
- `go mod tidy`  增加缺失的包，删除多余的包

- `go mod download`  下载模块到本地缓存 缓存路径 `GOPATH/pkg/mod/cache`
- `go mod edit`  使用命令编辑go.mod文件
- `go mod vendor`将依赖拷贝到项目的/vendor目录下

###### go的项目管理模式不能改 ==暂定==  当前版本 gov1.18

1. go的项目在创建时就确定了项目管理方式 *GOPATH或GO MODULE* 在项目创建之后不能修改，
2. 使用GOPATH管理的项目似乎好像不会同步 go env的修改内容

##### 自定义go module模块并使用

### GO语言项目管理

  go语言一直到1.10，都是使用GOPATH设置模块搜索路径，但从1.11开始，引入了新的Go模块管理机制（go modules），不过一直到1.15，默认的模块管理方式仍然是GOPATH，直到Go1.16开始，将默认的模块管理方式改成了go modules，在这种工作模式下，每一个模块都必须使用go.mod文件指定模块的位置。

#### gopath模块管理

使用`go get xxx`命令下载包， 下载的包会放在 `$gopath/src`目录下。go get 命令可以借助代码管理工具通过远程拉取或更新代码包及其依赖包，并自动完成编译和安装。整个过程就像安装一个 App 一样简单。。这个命令可以动态获取远程代码包，目前支持的有 BitBucket、GitHub、Google Code 和 Launchpad。在使用 go get 命令前，需要安装与远程包匹配的代码管理工具，如 Git、SVN、HG 等，参数中需要提供一个包名。

golang最初推出的时候并没有这样的包管理方式，而是采用GOPATH的方式。所有程序必须放在 GOPATH目录下，import的包必须放在 GOROOT/src和GOPATH/src下。

#### go modules管理模块

go1.16开始默认的模块管理方式就改为了go modules.  go modules一经推出，就饱受诟病。最大的问题是如果go.mod文件中使用了绝对路径指定了模块路径，如果在git push时将每个模块的go.mod文件都上传到了服务器，那么在git pull到其他机器，由于路径可能不一样，如果进行git push操作的是macOS或Linux，而进行git pull操作的是Windows，那路径肯定是不一样的。所以每一次git pull时，都要修改模块的路径，尤其是当模块很多时，简直是一场噩梦。当然，你可以选择不上传go.mod文件，但go modules机制要求每一个模块的根目录必须有一个go.mod文件，所以即使不上传go.mod文件，你仍然需要为每一个模块创建新的go.mod文件。

[Go Modules Reference - The Go Programming Language](https://go.dev/ref/mod#go-get)

[(26条消息) 史上最全的Go语言模块（Module）管理详解（基于Go1.19）_go module_蒙娜丽宁的博客-CSDN博客](https://blog.csdn.net/nokiaguy/article/details/126827058)

#### 工作区概念
