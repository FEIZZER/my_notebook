## spring基础

### Spring中IOC容器的实现与理解



#### BeanFactory



#### ApplicationContext的四种实现

##### ClassPathXmlApplicationContext和FileSystemXmlApplicationContext

要求一个 xml配置文件的 路径作为参数。其中FileSystemXmlApplicationContext传入磁盘路径。

```java
ApplicationContext applicationContext =
        new ClassPathXmlApplicationContext("spring-config.xml");
```

##### 	

##### AnnotationConfigApplicationContext



##### AnnotationConfigWebApplicationContext

