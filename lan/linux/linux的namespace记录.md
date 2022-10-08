### namespace命名空间/名称空间

> namespace是 linux提供的一直内核级别隔离环境的方法。提供了一套方法使得PID，IPC，Network等资源不再是全局的了，而是 属于特定的namespace。 linux的namespace机制为基于容器的虚拟化技术实现提供了很好的基础。

#### linux namespace实现了6种类型的资源隔离

![img](https://images2018.cnblogs.com/blog/431521/201803/431521-20180313190332372-333977915.png) 

##### pid namespace

隔离了进程ID号空间，不同的PID Namespace中的进程可以拥有相同的PID。PID Namespace的好处之一是，容器可以在主机之间迁移，同时容器内的进程保持相同的进程ID。PID命名空间还允许每个容器拥有自己的init（PID 1），它是 "所有进程的祖先"，负责管理各种系统初始化任务，并在子进程终止时收割孤儿进程。
　　从特定的PID Namespace实例来看，一个进程有两个PID：Namespace内的PID和主机系统上命名空间外的PID。PID命名空间可以嵌套：一个进程从它所在的PID Namespace一直到根PID Namespace，每一层的层次结构都有一个PID，一个进程只能看到他自己PID Namespace和嵌套在该PID Namespace下面的Namespace中包含的进程。