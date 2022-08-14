### StatefuSet

statefuSet是为了解决有状态服务的问题

- 稳定的持久化存储，基于pvc实现
- 稳定的网络标识，statefuset管理的pod重启后 podname和hostname不变
- 有序部署 和 有序收缩

###### statefuset创建管理pod的模板

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: mongodb
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongo
          image: mongo:4.4
          imagePullPolicy: IfNotPresent
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  selector:
    app: mongodb
  type: ClusterIP
  # HeadLess
  clusterIP: None
  ports:
    - port: 27017
      targetPort: 27017

```



现在是没有数据持久化支持的
