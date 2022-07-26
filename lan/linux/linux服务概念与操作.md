### 服务（service) 的管理方式Systemd

##### 在早期linux服务的管理方式相对简单 init。

当时的管理方式为SysV的init脚本程序处理方式， 所有的服务启动脚本通通放置于/etc/init.d/ 底下，基本上都是使用bash shell script 所写成的脚本程式，需要启动、关闭、重新启动、观察状态时， 可以	使用`/etc/init.d/daemon start|stop|restart|status`命令。自从centos7.X开始，管理方式变为Systemd。

![image-20220726174539172](linux服务概念与操作.assets/image-20220726174539172.png) 



###### daemons（守护进程）的概念

 系统为了成功实现一个服务，必须要运行的一些程序。为了实现这个服务，所需要的进程就称为这个服务的守护进程daemon。

#### systemd管理方式

基本上， systemd将过去称为daemon的执行脚本统称为服务单位(unit), 而每种服务单位依据功能来区分时，就分类为不同的类型  (type)。  基本的类型有包括系统服务、数据监听与交换的插槽档服务  (socket)、储存系统状态的快照类型、提供不同类似执行等级分类的操作环境  (target)  等等。相关的配置文件都会被放在如下几个文件中：

- /usr/lib/systemd/system/： 每个服务最主要的启动脚本设定，有点类似以前的  /etc/init.d  底下的文件
- /run/systemd/system/：系统执行过程中所产生的服务脚本，这些脚本的优先序要比  /usr/lib/systemd/system/  高！
- /etc/systemd/system/：管理员依据主机系统的需求所建立的执行脚本，其实这个目录有点像以前 /etc/rc.d/rc5.d/Sxx  之类的功能！执行优先序又比  /run/systemd/system/  高!

