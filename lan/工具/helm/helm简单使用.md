### helm

> helm是k8s的包管理工具，使用helm，可以使用更为简化和系统化的方式对k8s应用进行部署、升级。
>
> 这种说法当然不算夸张，Helm其实是一个Kubernetes应用的包管理工具，用来管理chart（一种预先配置好的安装包资源），有点类似于Ubuntu 的APT和CentOS中的YUM。因此，helm的出现解决了k8s应用管理能力缺失的问题。

##### helm中的概念

- **chart**：chart就是helm package，包含了一个k8s app应用运行起来的所有要素，比如service, deployment, configmap, serviceaccount, rbac, 等，这些要素都是以template文件的形式存在，再结合values文件，最终渲染出能够被k8s执行的yaml文件；

- **repository**：仓库是charts的集合，方便进行分享和分发。下面是官网仓库和阿里云仓库的地址，可以进去看看，感受一下；

- - [https://artifacthub.io/](https://link.zhihu.com/?target=https%3A//artifacthub.io/)
  - [https://developer.aliyun.com/hub](https://link.zhihu.com/?target=https%3A//developer.aliyun.com/hub)

- **release**：release是helm chart在kubernetes的一个运行实例，你可以用不同的release name多次安装同一个chart，比如：当集群中需要多个redis实例，你可以使用不同的配置文件安装redis chart。

