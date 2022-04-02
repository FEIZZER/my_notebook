# SpringBoot整合Swagger

认识Swagger:
 Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。总体目标是使客户端和文件系统作为服务器以同样的速度来更新。文件的方法，参数和模型紧密集成到服务器端的代码，允许API来始终保持同步。

#### 配置步骤

1. ##### 加入依赖向

   ```xml
   <dependency>
       <groupId>io.springfox</groupId>
       <artifactId>springfox-swagger2</artifactId>
       <version>2.9.2</version>
   </dependency>
   <dependency>
       <groupId>io.springfox</groupId>
       <artifactId>springfox-swagger-ui</artifactId>
       <version>2.9.2</version>
   </dependency>
   ```

2. ##### 为Swagger添加配置类

   `docket()`方法返回一个Docket实例，并对初始信息进行修改。这些信息由一个 `ApiInfo`封装了。具体各个参数代表上面信息可以自行去源码了解。

   ```java
   //省略了导包和包名
   @Configuration
   @EnableSwagger2
   public class SwaggerConfig {
       @Bean
       Docket docket(){
           return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo());
       }
       private ApiInfo apiInfo(){
           Contact contact = new Contact("FEIZZER",
                   "http://www.baidu.com",
                   "jwhfui@163.com");
           return new ApiInfo("mybatistest document",
                   "FEIZZER test project",
                   "1.1",
                   "www.baidu.com", contact,
                   null,
                   "www.licenseurl.com",
                   new ArrayList<>());
       }
   } 
   ```

3. ##### 访问项目路径+swagger-ui.html 就可以访问了

#### 配置API文档的分组

可以在返回的`Docket`对象的最后使用 `groupName("")`方法来指定组名，有多个组就要返回多个Bean实例。

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).groupName("FEIZZER");
    }
    @Bean
    Docket docket2(){
        return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).groupName("FEIZZER2");
    }
}
```

#### 配置扫描接口

###### 第一种方式通过包名或注解名

通过链式调用方法，在`select()`方法和`build()`方法之间 调用`apis()` 方法，注意`apis()`方法里的参数：

- RequestHandlerSelectors. basePackage("")  ；basePackage()的参数时包名 *注意使用点分路径*。 

- RequestHandlerSelectors.any()； 没有参数，表示扫描启动类所在包内的所有的 Controller

- RequestHandlerSelectors.none() ；

- RequestHandlerSelectors.withClassAnnotation(Controller.class)  指定类上的注解，扫描该类中的所有接口，

  如本例就是，扫描所有 `@Controller`注解类中的接口方法。

- RequestHandlerSelectors.withMethodAnnotation(RequestMapping.class)  指定方法上的注解。

```java
@Bean
Docket docket(){
    return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo())
            .select().
        	apis(RequestHandlerSelectors.
                  basePackage("com.example.mybaitstest.controller.admin"))
            .build();
}
```

###### 第二种方法

通过链式调用方法，在`select()`方法和`build()`方法之间 调用`paths()` 方法，注意`paths()`方法里的参数：

- PathSelectors.ant("/**") 
- PathSelectors.any()
- PathSelectors.none()
- PathSelectors.regex("") 使用正则表达式选择。

```java
@Bean
Docket docket(){
    return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.example.mybatistest.controller"))
            .paths(PathSelectors.ant("/**"))
            .build().groupName("FEIZZER");
}
```

##### 可以通过 `.enable(false)` 方法设置关闭Swagger，默认是开启的。

#### 添加接口描述

<img src="https://s2.loli.net/2022/04/01/JUXtFrbWdMEGuQf.png" alt="image-20210714210216333" style="zoom:37%;" /> 

##### 信息部分的添加已经有所展示

##### 接口部分

- `@Api(value="")` 放在 `Controller` 类之前，解释该`Controller`的作用
- `@ApiOperation(value = "注销功能")` 放在具体的  `Mapping` 方法之前

```java
@Controller
@Api(value = "管理员拥有的功能")
public class Admin {
    @ApiOperation(value = "注销功能")
    @RequestMapping(value = "logoutRequest")
    public String logout(){
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        Session session = subject.getSession();
        session.removeAttribute("user");
        return "redirect:index.html";
    }
}
```

##### 实体类部分，如果 `Controller` 把实体类对象传回前端页面（直接 return的情况），添加对model的解释很有必要

- @`ApiModel(value = "admin实体类") ` 放在实体类之前

- `@ApiModelProperty(value = "uid主键")` 放在实体类属性之前。

- @ApiImplicitParams   和  @ApiImplicitParam 

  放在 **传参类型**为 **表单**的接口会比较合适

  ```java
  /*
  * name参数名, example=默认值, value=参数内容提示
  */
  @ApiImplicitParams({
     @ApiImplicitParam(name = "name", example = "feizzer", value = "用户名"),
     @ApiImplicitParam(name = "password", example = "123456", value = "密码")
  })
  ```

