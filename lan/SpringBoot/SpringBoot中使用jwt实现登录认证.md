[[jwt实现token认证]]

[jwt官网](https://jwt.io/)   

实现了jwt的库有很多，这里使用 auth0.java-jwt 实现  [auth0/java-jwt的项目地址](https://github.com/auth0/java-jwt) 

### springboot中使用jwt实现权限认证

##### 1. 添加maven依赖

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.19.1</version>
</dependency>
```

##### 2. 
