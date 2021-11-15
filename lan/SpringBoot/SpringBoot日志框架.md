



### 日志框架的整理

最早的日志框架Log4J由 [Ceki Gülcü](https://stackoverflow.com/users/100970/ceki)个人在1996年开发 ,后作者将该项目捐献给 Apache基金会，由Apache维护更新。由于最初的入职框架存在较严重的性能问题，作者考虑重构一个框架。重构框架之前先编写一个抽象层 SLF4J ，今后更多的框架通过实现这个抽象层来搭建。随后开发了 Logback 日志实现层。Apache也在2014宣布停止对 Log4j的维护，而推荐使用 Log4J2 。在这个过程中，不仅java，各类语言的日志框架开始出现并完善。

| 日志抽象层                                              | 日志实现层                                             |
| ------------------------------------------------------- | ------------------------------------------------------ |
| JCL(Jakarta Common Logging)     SLF4J     Jboss-Logging | Log4J    JUL(Java.until.logging)     logback    Log4J2 |

JCL在2014年已经停止维护。Jboss-Logging应用的范围非常小。  现在SLF4j使用最广泛。

JUL是由java实现的。Log4j2是由Apache实现的新框架，非常优秀。  logback由Ceki Gülcü编写的。

### SpringBoot 默认的日志框架 

springBoot默认使用的是 SLF4J + logback。我们不需要专门加入依赖项就可以直接使用，因为在Spring-boot-starter中已经依赖了 。

##### 尝试开始使用 

###### 只需引入如下两个类就看可以用 logger来代替 sout进行测试输出等工作了

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
  public static void main(String[] args) {
    private static final Logger logger = LoggerFactory.getLogger(HelloWorld.class);
    logger.info("Hello World");
  }
}
```

如果项目中有lombak依赖，可以直接使用`@Slf4j`注解 简化上述声明logger的操作。

###### 各项配置

```properties
# 指定某个包下的类的日志输出级别
logging.level.com=trace
# 设置springboot默认的日志级别，springboot默认的日志级别就是root，这里指定root的具体级别
# logging.level.root=warn
# trace < debug < info < warning < error
# 不指定路径在当前项目下生成springboot.log日志
# 可以指定完整的路径；
#logging.file=D:/springboot.log
# 在当前磁盘的根路径下创建spring文件夹和里面的log文件夹；使用 spring.log 作为默认文件
logging.file.path=/spring/log
# 在控制台输出的日志的格式，在新的SpringBoot中像下面一样定义 输出格式会出现乱码
logging.pattern.console=%d{yyyy‐MM‐dd} [%thread] %‐5level %logger{50} ‐ %msg%n
# 指定文件中日志输出的格式 在新的SpringBoot中像下面一样定义 输出格式会出现乱码
logging.pattern.file=%d{yyyy‐MM‐dd} === [%thread] === %‐5level === %logger{50} ==== %msg%n
```

可以在 Externial Libraries 中找：<img src="SpringBoot%20%E6%97%A5%E5%BF%97%E6%A1%86%E6%9E%B6.assets/image-20210801203844271.png" alt="image-20210801203844271" style="zoom:63%;" /> 这个包：

<img src="SpringBoot%20%E6%97%A5%E5%BF%97%E6%A1%86%E6%9E%B6.assets/image-20210801203922037.png" alt="image-20210801203922037" style="zoom:67%;" />  

###### 当然 SLF4J也提供了 使用其他实现层类来进行日志输出的操作，如下图：

<img src="SpringBoot%20%E6%97%A5%E5%BF%97%E6%A1%86%E6%9E%B6.assets/concrete-bindings.png" alt="img" style="zoom:70%;" />

##### 在SpringBoot项目中出现问题不同框架日志依赖不同问题

在SpringBoot项目中依赖的一些项目 它本身有自己的日志框架而且与SpringBoot不相同。比如 Spring使用的是 JCL，Hibernate使用Jboss-logging。。。。该如何解决。

通过偷换包的方法：且这些工作SpringBoot会帮我们完成，我只需要在加入依赖的时候 将这些项目原有的 日志框架排除即可。看看就行，实际有待查证。

<img src="SpringBoot%20%E6%97%A5%E5%BF%97%E6%A1%86%E6%9E%B6.assets/legacy.png" alt="img" style="zoom:60%;" />



