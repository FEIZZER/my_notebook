#### k8s中namespace的概念

*区别于linux虚拟网络基础中的namespace*， k8s中的namespace名字命名空间提供一种机制，将同一集群中的资源划分为不同的组。同意命名空间的内的资源名称不可重复。仅针对 `名字命名空间级别的资源`有作用 。例如Deployment Service等；

- kubectl get namespace  获取当前集群中的namespace

-  kubectl create namespace other-work  创建一个新的namespace

  也可以使用yaml文件

  ```yaml
  apiVersion: v1
  kind: Namespace
  metadata:
    name: <insert-namespace-name-here>
  ```

- kubectl delete namespaces other-work 这会删除该namespace下的所有资源，且删除时异步的，删除时namespace的状态为terminating

- 

##### 集群中资源的分类

###### 命名空间级别

- 工作负载型资源： Pod，ReplicaSet， Deployment， StatefulSet， DaemonSet， Job， CronJob
- 服务发现与负载均衡： Service， Ingress
- 配置与存储类型： Volume，CSI
- 特殊类型的存储卷： ConfigMap， Secret， DownWardAPI

###### 集群级别

Namespace， role， Node

###### 元数据类型

HPA， PodTemplate， LimitRange

#### 启动一个pod的过程



#### 几种控制器介绍

###### 无状态服务使用的控制器

- ReplicationController  确保容器pod应用的副本数始终保持用户定义的数目。
- ReplicaSet取代 ReplicationController。没有本质区别但是RS支持集合式的Selector。（创建pod时，打的标签）
- deployment取代RS。 滚动更新机制的实现（deployment本身不支持创建）  ==画图展示==

###### 解决有状态服务问题

- StatefulSet 解决有状态服务，如数据库等

