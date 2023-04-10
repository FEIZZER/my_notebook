## kubernetes中的网络

##### k8s网络环境中的三种ip

- **Node Ip**  宿主机的ip
- **Pod Ip**     使用的网络插件创建的ip（如flannel）， 实现跨主机的pod之间的互通
- **Cluster Ip**  虚拟ip， 通过配置iptables规则来实现访问到达的。

##### k8s环境中存在几种网络通信

- 容器之间的通信： 同一个pod中多个容器的通信。
- **pod之间的通信**：通过pod ip进行通信
- **pod和service之间通信**： service的ip属于clusterIp， 基本是通过IPVS或iptables转发实现的
- **service和集群外部通信**： 实现方式ingress， nodeport， loadbalance 

> k8s网络实现不是集群内部自己实现，而是依赖于第三方网络插件---(CNI：Container Network Interface)。
>
> flannel、calico、canel等是目前比较流行的第三方网络插件。这三种的网络插件需要实现Pod网络方案的方式通常有以下几种：虚拟网桥、多路复用(MacVLAN)、硬件交换(SR-IOV)

### 扁平网络 Fannel

flannel是一种基于overlay网络的跨主机容器网络通信的解决方案， 就是将tcp数据包封装在另一层网络包里面进行网络转发。

#### fannel网络工作原理

fannle会为每一个集群中的node分配一个网段， pod会从这个网段获得一个ip，这个ip可以在同集群的不同主机之间通信（无需使用nat转发和端口映射）。其中node被分配的网段， node的ip会被存储在etcd中。

flannel的网络模式下数据包的在主机之间转发是由backend实现的， 目前支持的backend有：

- VxLAN
- host-gw
- udp



#### Calico网络

#### eBPF网络







