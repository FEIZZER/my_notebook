### pod

创建pod的 yaml文件样例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  labels: 
    app: my-app
spec:
  # 定义容器，可以多个
  containers:	
    - name: test-k8s				 # 容器名字
      image: nginx:latest 		 	 # 镜像
      imagePullPolicy: IfNotPresent  # 镜像拉去策略

```

- imagePullPolicy 镜像拉去策略，Never只使用本地镜像，没有就报错； IfNotPresent 如果本地没有就去远端拉取；  默认值为Always， 总是会使用远端镜像；

### deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  # 部署名字
  name: test-k8s
spec:
  replicas: 2
  # 用来查找关联的 Pod，所有标签都匹配才行
  selector:
    matchLabels:
      app: test-k8s
  # 定义 Pod 相关数据
  template:
    metadata:
      labels:
        app: test-k8s
    spec:
      # 定义容器，可以多个
      containers:
      - name: test-k8s # 容器名字
        image: nginx:latest # 镜像

```

