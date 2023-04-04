### K8s中的资源对象



#### kubernetes中常见API对象

**API对象**是Kubernetes集群中的管理操作单元。 Kubernetes集群系统每支持一项新功能， 引入一项新技术， 一定会新引入对应的API对象， 支持对改功能的管理操作。  每个API对象都有3大类属性：

- **元数据metadata**   元数据是用来表示API对象的， 每个对象至少有3个元数据：namespace;  name;  uid; 标签label是可选的
- **规范spec**                 描述了用户期望kubernetes集群中分布式系统达到的理想状态。
- **状态status**              描述系统实际当前达到的状态

##### 常见API对象

| 类别     | 名称                                                         |
| :------- | ------------------------------------------------------------ |
| 资源对象 | Pod、ReplicaSet、ReplicationController、Deployment、StatefulSet、DaemonSet、Job、CronJob、HorizontalPodAutoscaling、Node、Namespace、Service、Ingress、Label、CustomResourceDefinition |
| 存储对象 | Volume、PersistentVolume、Secret、ConfigMap                  |
| 策略对象 | SecurityContext、ResourceQuota、LimitRange                   |
| 身份对象 | ServiceAccount、Role、ClusterRole                            |

#### api对象详解

