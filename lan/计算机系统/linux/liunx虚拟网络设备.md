

##### Network namespace

网络命名空间，允许你在Linux创建相互隔离的网络视图，每个网络名字空间都有独立的网络配置，比如：网络设备、路由表，ARP表等。不管是虚拟机还是容器，运行的时候仿佛自己就在独立的网络中。新建的网络名字空间与主机默认网络名字空间之间是隔离的。我们平时默认操作的是主机的默认网络名字空间

###### 本地空间创建Namespace

`ip netns add red`   创建一个名为red的namespace

`ip netns ls` 查看当前所有的namespace。可以在 `/var/run/netns/`目录下看到所有创建的namespace

每个netns都有自己的网卡、路由表、ARP 表、iptables 等。可以通过`ip netns exec NAMESPACE COMMAND` 子命令进行查看，该命令允许我们在特定的netns下执行任何命令，不仅仅是网络相关的命令。



##### veth-pair直连实现两个namespace之间通信



##### bridge连接两个以上的namespace

###### bridge的交换机模式



###### 给bridge分配ip地址，实现bridge的路由模式



#### tap/tun  虚拟设备

​	

