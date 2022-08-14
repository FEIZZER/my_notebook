#### Service 

-  service通过label关联对应的Pod
- service和pod的生命周期不绑定，，不会因为pod的重启二改变自己的cluster-ip
- 提供了负载均衡的功能，可以转发流量到不同的pod
- 可以对集群外部暴露端口
- 集群内部可以通过服务的名字访问

###### 创建Service的yaml文件

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8s-go-service

spec:
  selector:
    app: go-demo  # selector选择器，对应pod的yaml文件中的labels的app字段
  type: NodePort  # 对外访问的类型
  ports:
  - name: my-service
    protocol: TCP
    port: 8081        # 对集群内的本服务暴露端口
    targetPort: 8080  # 目标pod中容器使用的端口
    nodePort: 30081   # 对外暴露的服务端口， 端口限定范围 30000~32767 

```

- spec.type 的默认值为ClusterIP，只可以在集群内部访问 所以不用指定nodePort了。

- clusterIP:None   在指定spec.type为 ClusterIP 且 clusterIP为None.那么该服务就变为一个无头服务，不会为其分配集群内ip。

- spec.ports:  可以部署一个port也可以多个，多个的时候 name为必须字段。

  