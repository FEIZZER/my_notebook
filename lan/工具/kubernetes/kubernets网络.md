## kubernetes中的网络

##### k8s网络环境中的三种ip

- **Node Ip**  宿主机的ip
- **Pod Ip**     使用的网络插件创建的ip（如flannel）， 实现跨主机的pod之间的互通
- **Cluster Ip**  虚拟ip， 通过配置iptables规则来实现访问到达的。

##### k8s环境中存在几种网络通信

- **容器之间的通信**： 同一个pod中多个容器的通信。
- **pod之间的通信**：通过pod ip进行通信
- **pod和service之间通信**： service的ip属于clusterIp， 基本是通过IPVS或iptables转发实现的 [Service](Service.md)
- **service和集群外部通信**： 实现方式ingress， nodeport， loadbalance 

> k8s网络实现不是集群内部自己实现，而是依赖于第三方网络插件---(CNI：Container Network Interface)。
>
> flannel、calico、canel等是目前比较流行的第三方网络插件。这三种的网络插件需要实现Pod网络方案的方式通常有以下几种：虚拟网桥、多路复用(MacVLAN)、硬件交换(SR-IOV)





### pod和pod之间通信实现

#### 同一个node节点的pod通信

对于同节点的pod的之间的通信方式， 可以参考docker的bridge网络模式下使用同一个bridge的容器的通信方式。

![同节点内pod通信方式](kubernets网络.assets/未命名文件 (11).png) 

我的k8s环境中cluster-pod-cidr的范围是  **10.244.0.0/16**， 该node节点环境中有一个网桥cni0 10.244.0.1。  所有被部署到该节点的pod之间通信， 都是经过该网桥转发的。

#### 不同node节点之间的node通信

##### 扁平网络fannel工作原理

fannle会为每一个集群中的node分配一个网段， pod会从这个网段获得一个ip，这个ip可以在同集群的不同主机之间通信（无需使用nat转发和端口映射）。其中node被分配的网段， node的ip会被存储在etcd中。

flannel的网络模式下数据包的在主机之间转发是由backend实现的， 目前支持的backend有：

- VxLAN

  > vxlan(virtual extensible local area network) 虚拟拓展网络， 是由IETF定义的NVO3(Network Virtualization over Layer3) 的标准技术之一， 是对传统VALN的一种拓展。 特点是将**layer2的以太帧封装到UDP的报文中， 并在layer3的网络中进行传输**。 

  本质上vxlan是一种隧道技术。 在源网络设备与目的网络设备之间的ip网络上，建立一条逻辑隧道， 将用户侧报文经过特定的封装走这条隧道转发。对于通过这种方式通信的两台终端，就像是连接在一个虚拟交换机的不同端口一样

  

  ==为什么cni0的mtu是1450==

- host-gw
- udp



##### Calico网络

##### eBPF网络







