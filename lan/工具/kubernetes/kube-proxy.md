# kubernetes

## kube-proxy



### kube-proxy代理

在 Kubernetes v1.0 版本，代理完全在 userspace，`Service` 是 “4层”（TCP/UDP over IP）概念。

在 Kubernetes v1.1 版本，新增了 iptables 代理，但并不是默认的运行模式。新增了 `Ingress` API（beta 版），用来表示 “7层”（HTTP）服务。

从 Kubernetes v1.2 起，默认就是 iptables 代理。

在 Kubernetes v1.8.0-beta.0 中，添加了ipvs代理。

#### userspace代理模式



#### iptables代理模式



#### 