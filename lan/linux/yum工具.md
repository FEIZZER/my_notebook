## yum 

yum安装就是在线安装RPM包。 yum工具安装软件会根据yum源来查找软件。 yum的原配置文件保存在 `/etc/yum.repo.d/`目录下。 *只要是该目录下， 且文件拓展名为`*.repo`就会生效*

#### `*.repo`文件内容

```bash
#必选值，定义软件仓库(Repository)的名称，用作Yum识别不同仓库，因此满足唯一性             
[base]                               
#定义仓库仓库名和描述信息，也可用作配置说明等用途，通常设置该值是为了方便阅读仓库配置文件，支持$releasever $basearch这样的变量，可省略
name=CentOS $releasever base
mirrorlist=URL     #指定当前仓库的镜像地址
#必选值，定义仓库文件路径。可选的协议值为http, https, file:///, ftp:// ；后跟一个或多个URL(但只能有一个baseurl)，需要特别注意的是，URL必须指向该Repository软件列表目录的上一级，简练的说明就是必须指向Repository repodata的上一级目录；特别需要注意的是，由于在类Unix系统(Unix Like OS) 中，正斜杠"/"用作路径分隔符及根目录，因此使用绝对路径表示本地RPM仓库路径时，必须使用3个正斜杠。变量$releasever用于识别系统发行版本，通常是5,6,7等数字; $basearch用于识别CPU架构，可能的值为i386、i686、x86_64等，设置这些变量是为了方便通过yum安装或升级仓库软件包。
baseurl=URL1://path/to/repository/
        URL2://path/to/repository/
        URL3://path/to/repository/
#是否开启当前仓库，0表示关闭，1表示开启。如未指明，默认为1
enabled={1|0}            
#是否检查软件包的GPG签名，1为开启，0为关闭。若为官方源或其它可信机构源可设置为0，否则建议开启GPG检查
gpgcheck={1|0}             
#用于指定GPG签名文件的URL，当gpgcheck=1时，该项为必选项，否则yum安装时将报错，提示当前Repository不被信任
gpgkey=URL               
#设定YUM仓库的路径选择方式，默认为roundrobin，即随机选择，在当前URL连接失败情景下，yum将自动随机选择下一个，依次类推；当设定failovermethod的值为priority时，将根据Repository URL的次序依次选择
failovermethod={roundrobin | priority}        
```

##### .repo文件中的变量

-  **\$basearch**     系统硬件架构(CPU指令集), 可以在shell中通过 `arch` 查看 
- **\$releasever**    当前系统的发行版本.当前系统为centos-7. 该值就是 7



#### yum命令行

##### 安装软件

- `yum install -y xxx`  

##### 卸载软件包

- `yum remove -y xxx`

##### 升级软件包

- `yum update`   升级所有软件包
- `yum update xxx`  升级某一个软件包。
- `yum check-update`  查看可以更新的软件包

##### 查找与显示

- `yum list ` 查看所有的包（安装的和可以安装）
- `yum list xxx` 查看所有报包名为xxx的包
- `yum list installed`  查看所有安装的包
- `yum list asciinema` 查看所有可以安装的包

- `yum deplist tomcat` 列出该软件包的依赖关系