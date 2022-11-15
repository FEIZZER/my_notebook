#### etcdctl操作数据库 

`kubectl -it exec ues-etcd-0 bash`进入etcd相关pod

etcdctl --cacert=/opt/bitnami/etcd/certs/client/ca.crt --cert=/opt/bitnami/etcd/certs/client/cert.pem --key=/opt/bitnami/etcd/certs/client/key.pem get / --prefix --keys-only

**etcdctl命令**

##### get





