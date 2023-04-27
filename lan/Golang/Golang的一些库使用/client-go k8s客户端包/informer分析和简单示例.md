## k8s informer

cnblogs.com/wuchangblog/p/16730669.html

##### informer基本使用示例

```go
func PodInformerSimple() {
	clientSet, err := getConfig.NewClientSet("")
	if err != nil {
		panic(err)
	}
    // 创建一个 informerFactory
	informerFactory := informers.NewSharedInformerFactory(clientSet, 5*time.Second)
    // 由Factory得到具体一个类型的 informer
	podInformer := informerFactory.Core().V1().Pods().Informer()
    // 添加informer的事件回调函数
	podInformer.AddEventHandler(&cache.ResourceEventHandlerFuncs{
		AddFunc: func(obj interface{}) {
			podObject := obj.(*v1.Pod).DeepCopy()
			fmt.Printf("get a new pod: %+v\n", podObject.Name)
		},
		UpdateFunc: nil,
		DeleteFunc: nil,
	})
	ctx := context.TODO()
    // 启动informer， 该函数会阻塞住直到 传入的channel被close
	podInformer.Run(ctx.Done())
    // 用来阻塞， 直到 传入的channel被close 或 所有的 informer.HasSynced的返回值都为true时。
	cache.WaitForCacheSync(context.Background().Done(), podInformer.HasSynced)
}
```

##### 动态informer的使用

```go
func PodInformerDynamic() {
	clientSet, err := getConfig.NewDynamicClientSet("")
	if err != nil {
		panic(err)
	}
	dynamicInformerFactory := dynamicinformer.NewDynamicSharedInformerFactory(clientSet, 5*time.Second)
	podInformer := dynamicInformerFactory.ForResource(podResources).Informer()
	podInformer.AddEventHandler(&cache.ResourceEventHandlerFuncs{
		AddFunc: func(obj interface{}) {
			cm := obj.(*unstructured.Unstructured)
			fmt.Printf("Informer event: Pod ADDED %s/%s\n", cm.GetNamespace(), cm.GetName())
		},
		UpdateFunc: nil,
		DeleteFunc: nil,
	})
	ctx := context.TODO()
	podInformer.Run(ctx.Done())
	cache.WaitForCacheSync(ctx.Done(), podInformer.HasSynced)
}
```



### informer实现分析

