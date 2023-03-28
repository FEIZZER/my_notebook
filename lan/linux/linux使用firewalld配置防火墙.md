[firewall官网]()

从centos7开始默认使用firewalld作为防火墙工具。 但是firewalld底层使用iptables作为防火墙规则管理入口， 并且firewalld的底层还是netfilter内核，只是firewalld修改了daemon和service。 *firewalld中没有链的概念*
![[Excalidraw/Drawing 2023-02-28 21.04.09.excalidraw.png]]

##### firewall与iptables的区别
- firewall可以修改单条规则， 不必像iptables一样必须全部刷新后才可以生效
- firewall的默认策略是阻断， 而iptable是的默认策略是放通
- firewall里面没有链的概念， 但是加入看zone的概念。

### firewalld配置防火墙
##### firewall的区域zone

zone是firewall预设的几类防火墙策略模板， 一个有九类。其配置文件都存储在`/usr/lib/firewalld/zones/`下.

|   zone   |                    default configuration                     |
| :------: | :----------------------------------------------------------: |
| trusted  |                  允许所有流入或流出的数据包                  |
|   home   | 允许任何数据包流出 和 部分预定义的服务（ssh mdns ipp-client sbmclient dhcp6-client）数据包流入 |
| internal |                 等同于home区域                                             |
|   work   |     阻断数据包流入，只允许预定义的服务(ssh)的数据流入。      |
|  public  |    阻断数据包流入，只允许预定义的服务(ssh)的数据流入。...    |
| external | 阻断数据包流入，只允许预定义的服务(ssh)的数据流入。允许数据包流出，但是从该区流出的数据包都将映射成该区绑定的网卡的ip。 |
|   dmz    | 阻断数据包流入，只允许预定义的服务(ssh)的数据流入。且允许数据包流入 |
|  block   |      任何流入的数据包阻断，会做响应。但是允许数据包流出      |
|   drop   | 任何流入的网络数据包都将被丢弃， 且不做回应， 提高效率。但是允许数据包流出 |

#### firewalld命令行 `firewall-cmd`

##### 查看预定义信息

- `firewall-cmd --get-zones`  	 查看firewall中可用的zone
- `firewall-cmd --getservices`   查看firewall中可用的服务定义
- `firewall-cmd --get-icmptypes ` 查看防火墙可用的icmp阻塞类型

#####  全局阻断

- `firewall-cmd --panic-on`		 拒绝所有的报
- `firewall-cmd --panic-off`       取消拒绝所有的报
- `firewall-cmd --query-panic`   查看当前是否开启全局阻断

##### 区域管理

`firewall-cmd --get-default-zone`  查看网络连接或者接口的默认区域

