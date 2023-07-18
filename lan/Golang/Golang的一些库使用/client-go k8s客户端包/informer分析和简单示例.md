## k8s informer

cnblogs.com/wuchangblog/p/16730669.html

https://www.jianshu.com/p/0c1c462c19d0

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

##### 使用示例分析

1.  从创建informerFactory开始，` informers.NewSharedInformerFactory(clientSet, 5*time.Second)`, 这个函数返回一个 `k8s.io/client-go@v0.27.1/informers/factory.go：sharedInformerFactory` 结构体对象， 这个结构体实现了一个接口`pkg/mod/k8s.io/client-go@v0.27.1/informers/factory.go:SharedInformerFactory`，接口部分源码如下:

   ```go
   type SharedInformerFactory interface {
   	internalinterfaces.SharedInformerFactory
   
   	Start(stopCh <-chan struct{})
   
   	Shutdown()
   
   	WaitForCacheSync(stopCh <-chan struct{}) map[reflect.Type]bool
   
   	ForResource(resource schema.GroupVersionResource) (GenericInformer, error)
   
   	InformerFor(obj runtime.Object, newFunc internalinterfaces.NewInformerFunc) cache.SharedIndexInformer
   
   	Admissionregistration() admissionregistration.Interface
   	Internal() apiserverinternal.Interface
   	Apps() apps.Interface
   	Autoscaling() autoscaling.Interface
   	Batch() batch.Interface
   	Certificates() certificates.Interface
   	Coordination() coordination.Interface
       ......
       ......
   }
   ```

   显然的该接口定了一个仓库型类型， 用于指定返回一个具体资源组， 版本， 资源类型的informer*(这种实现方式和clientset一样， 不再赘述)*， 并且对由该factory产生的informer提供统一的启动 通知 管理方法， 对于这些方法的使用在上面的源码中用注释记录。

2. 由informerFactory产生具体类型的informer， 每个资源类型都有自己的实现， 我们已pod为例， 在`k8s.io/client-go@v0.27.1/informers/core/v1/pod.go` 文件中可以看到他的实现：

   ```go
   type PodInformer interface {
   	Informer() cache.SharedIndexInformer
   	Lister() v1.PodLister
   }
   
   type podInformer struct {
   	factory          internalinterfaces.SharedInformerFactory
   	tweakListOptions internalinterfaces.TweakListOptionsFunc
   	namespace        string
   }
   ```

   
