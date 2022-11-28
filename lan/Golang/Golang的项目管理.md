##### 发展变化

现在几乎所有语言都有一套完善的包管理工具。golang最初推出的时候并没有这样的包管理方式，而是采用GOPATH的方式。所有程序必须放在 GOPATH目录下，import的包必须放在 GOROOT/src和GOPATH/src下。

go get 命令可以借助代码管理工具通过远程拉取或更新代码包及其依赖包，并自动完成编译和安装。整个过程就像安装一个 App 一样简单。

这个命令可以动态获取远程代码包，目前支持的有 BitBucket、GitHub、Google Code 和 Launchpad。在使用 go get 命令前，需要安装与远程包匹配的代码管理工具，如 Git、SVN、HG 等，参数中需要提供一个包名。

`go get xxx`  下载的包会放在 GOPATH/src的对于目录下

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

不做记录了