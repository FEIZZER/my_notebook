### kubernetes中的身份与权限认证

在k8s集群中发起请求， 与资源进行交互时， 便然要经过apiserver。 每一个请求都需要经过apiserver的检查。 包括 **身份认证**  **鉴权**  **准入控制** 

#### 认证Authentication

##### k8s中又两套账户系统 serviceAccount和 userAccount

- userAccount是给**用户**用的，  serviceAccount是给Pod里的进程用的。 *所谓的用户是指可以通过 kubectl 命令、或通过REST请求访问 API的客户端，**但是请注意K8s不提供普通用户管理的资源对象**）*
- userAccount是全局的， 而serviceAccount是属于







#### 基于角色的访问控制（RBAC）

