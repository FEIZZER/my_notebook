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

##### go module模式使用

**1.  go版本v1.11及以上**

**2. GO111MODULE**

GO111MODULE由三个值  on auto 和 off

- GO111MODULE=off      go命令行将不会支持module功能，寻找依赖包的方式将会沿用旧版本那种通过vendor目录或者GOPATH模式来查找。通过`go get`命令下载的包都会在`$gopath/src/`目录下面

- GO111MODULE=on      go命令行会支持go module的管理方式， 不论在哪里执行`go get` 都会将包下载到 `$gopath/pkg/mod/`，目录下。
- GO111MODULE=auto  go命令行会视情况决定从哪导入包， 
  - 当前目录包含合法的go.mod文件
  - 当前目录在包含go.mod目录的子目录下

**3. gotoolchain工具使用**

- `go get `
- 

**4. goland注意添加配置go module生效**

**5. go.mod文件格式**

go.mod文件有四个关键字：

- `module`     指定的包的名字(路径)

- `require`   指定包的依赖项

- `replace`   替换项目中的依赖项模块

  出现在`go get`无法正常下载到包的情况。 因为**网络原因** 或者 **这个包无法直接放入$gopath/pkg/mod/ 目录下**， 可以使用这个关键字 修改项目对某一个包的依赖路径。

- `exclude`   忽略依赖项模块

  排除指定的包 （不想引用的包可能由重大bug或者有冲突等）。 go的包引用还会由很多被动引入， exlude可以用来避免这种被动引入某一个包的情况。

```
module moduleTest

go 1.19

require (
	github.com/Bhinneka/golib v1.0.7
	gopkg.in/rethinkdb/rethinkdb-go.v5 v5.1.0
	github.com/feizzer/moduleA v0.0.1
)

replace github.com/feizzer/moduleA => ../moduleA

require (
	github.com/bitly/go-hostpool v0.1.0 // indirect
	github.com/bmizerany/assert v0.0.0-20160611221934-b7ed37b82869 // indirect
	github.com/cenkalti/backoff v2.0.0+incompatible // indirect
	github.com/go-redis/redis v6.15.7+incompatible // indirect
	github.com/golang/protobuf v1.2.0 // indirect
	github.com/google/jsonapi v0.0.0-20200226002910-c8283f632fb7 // indirect
	github.com/hailocab/go-hostpool v0.0.0-20160125115350-e80d13ce29ed // indirect
	github.com/jinzhu/gorm v1.9.12 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/konsorten/go-windows-terminal-sequences v1.0.2 // indirect
	github.com/kr/pretty v0.1.0 // indirect
	github.com/kr/text v0.1.0 // indirect
	github.com/opentracing/opentracing-go v1.1.0 // indirect
	github.com/sirupsen/logrus v1.4.2 // indirect
	golang.org/x/crypto v0.0.0-20200320181102-891825fb96df // indirect
	golang.org/x/net v0.0.0-20190404232315-eb5bcb51f2a3 // indirect
	golang.org/x/sync v0.1.0 // indirect
	golang.org/x/sys v0.0.0-20200321134203-328b4cd54aae // indirect
	gopkg.in/check.v1 v1.0.0-20180628173108-788fd7840127 // indirect
	gopkg.in/fatih/pool.v2 v2.0.0 // indirect
)
```

#### go vendor模式

##### 问题

IDE工具goland中一个项目中有 vendor ， goland就会自动使用vendor模式查找依赖， 不再兼容使用 `go module项目管理`

##### 下载安装govendor工具

`go get -u  github.com/kardianos/govendor`

`go install github.com/kardianos/govendor`



#### go work工作区模式

使用工作区管理Go模块必须使用Go1.18或以上版本，

==暂时不做学习 使用==

#### 
