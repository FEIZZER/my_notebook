# Kubernetes

[Kubernetes 基础教程 | 云原生资料库 (jimmysong.io)](https://lib.jimmysong.io/kubernetes-handbook/)

kubernetes是Google基于Borg开源的一个容器编排系统。 k8s作为CNCF（Cloud Native Computing Foundation）最重要的组件，

#### kubernetes的设计理念

kubernetes的设计理念和功能实际就是一个类似linux的**分层架构**

<img src="kubernetes架构.assets/006tNc79ly1fzniqvmi51j31gq0s0q5u.jpg" alt="Kubernetes 分层架构示意图" style="zoom:50%;" /> 

- **核心层：** kubernetes最核心的功能， 对外提供API构建高层应用， 对内提供插件式应用执行环境。

- **应用层：**部署包括 无状态应用，有状态应用，批处理任务， 集群应用等；  路由包括 服务发现，DNS解析等

- **管理层：** 系统度量（如基础设施 容器 网络的度量）；  自动化（自动拓展 动态Provision）； 策略管理（RBAC Quota PSP NetworkPolicy等） 

- **接口层：** kubectl命令行工具；   客户端SDK； 集权联邦；

- **生态系统：** 在接口层之上的庞大容器集群管理调度的生态系统， 可以划分为两个

  - Kubernetes外部： 日志 监控 配置管理 CI CD Workflow Faas OTS应用 chatOps等
  - Kubernets内部： CRI; CNI; CVI; 镜像仓库; Cloud Provider; 集群自身配置和管理等。

   

##### k8s中API的设计原则

对于云计算系统，系统 API 实际上处于系统设计的统领地位，正如本文前面所说，Kubernetes 集群系统每支持一项新功能，引入一项新技术，一定会新引入对应的 API 对象，支持对该功能的管理操作。

- **API应该是声明式的。** 声明式的操作相比于命令式的操作， 在重复操作的情况下更加稳定，这对于容易出现数据丢失或重复的分布式环境来说是很重要的。
- **API 对象状态不能依赖于网络连接状态**。由于众所周知，在分布式环境下，网络连接断开是经常发生的事情，因此要保证 API 对象状态能应对网络的不稳定，API 对象的状态就不能依赖于网络连接状态。
- **尽量避免让操作机制依赖于全局状态，因为在分布式系统中要保证全局状态的同步是非常困难的**。

##### k8s中控制机制的设计原则



#### kubernetes中的核心技术概念和常见API对象

**API对象**是Kubernetes集群中的管理操作单元。 Kubernetes集群系统每支持一项新功能， 引入一项新技术， 一定会新引入对应的API对象， 支持对改功能的管理操作。  每个API对象都有3大类属性：

- **元数据metadata**  元数据是用来表示API对象的， 每个对象至少有3个元数据：namespace;  name;  uid; 标签label是可选的
- **规范spec**                描述了用户期望kubernetes集群中分布式系统达到的理想状态。
- **状态status**            描述系统实际当前达到的状态



##### 常见API对象

| 类别     | 名称                                                         |
| :------- | ------------------------------------------------------------ |
| 资源对象 | Pod、ReplicaSet、ReplicationController、Deployment、StatefulSet、DaemonSet、Job、CronJob、HorizontalPodAutoscaling、Node、Namespace、Service、Ingress、Label、CustomResourceDefinition |
| 存储对象 | Volume、PersistentVolume、Secret、ConfigMap                  |
| 策略对象 | SecurityContext、ResourceQuota、LimitRange                   |
| 身份对象 | ServiceAccount、Role、ClusterRole                            |

