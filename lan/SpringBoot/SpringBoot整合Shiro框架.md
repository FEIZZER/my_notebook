#   SpringBoot整合Shiro框架

**Apache Shiro**框架是一个 管理安全权限的框架。Shiro相比于SpringBootSecurity更轻量级，共有三个功能模块：

- Subject 主题，一般指用户
- SecurityManager：安全管理器，管理所有Subject，可以配合内部安全组件。(类似于SpringMVC中的DispatcherServlet)
- . Realms：用于进行权限信息的验证，一般需要自己实现。

#### 配置步骤

1. ##### 导入依赖

```xml
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-core</artifactId>
        <version>1.2.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-spring</artifactId>
        <version>1.2.2</version>
    </dependency>
    <!-- shiro ehcache -->
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-ehcache</artifactId>
        <version>1.2.2</version>
    </dependency>
    <dependency>
        <groupId>net.sf.json-lib</groupId>
        <artifactId>json-lib</artifactId>
        <version>2.4</version>
        <classifier>jdk15</classifier>
</dependency>
```

2. ##### 配置Config类和自定义一个 Realm实现类

   ```java
       //省去了导包和包名
       @Configuration
       public class ShiroConfig {
           /*创建一个realm对象, 这个realm类需要自定义，当用户访问的路径被拦截（需要用户认证和权限管理）的情况，就会执行这个
             realm对象里的方法进行处理*/
   
           @Bean(name = "getUserRealm")
           public UserRealm getUserRealm(){
               return new UserRealm();
           }
           //得到DefaultWebSecurityManager类的实例对象，该实例对象需要绑定一个realm实例对象
           @Bean(name = "getDefaultWebSecurityManager")
           public DefaultWebSecurityManager getDefaultWebSecurityManager(@Qualifier("getUserRealm") UserRealm userRealm){
               DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
               defaultWebSecurityManager.setRealm(userRealm);
               return defaultWebSecurityManager;
           }
           @Bean
           public ShiroFilterFactoryBean getShiroFilterFactoryBean(
                   @Qualifier("getDefaultWebSecurityManager") DefaultWebSecurityManager defaultWebSecurityManager){
               ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
               bean.setSecurityManager(defaultWebSecurityManager);
               /*
               * anon：无需认证就能访问
               * authc：必须认证了才能访问
               * user： 必须使用了记住我才能访问
               * perms：拥有对某个资源的访问权限。
               * roles：
               *常用的应该是 authc和 perms
               * */
               //在这里 添加Shiro的过滤器
               Map<String,String>  filtermap = new LinkedHashMap<>();
               /*添加了一个 过滤器过滤 admin/*路径下的内容，所有访问这个路径的请求会被拦截进入realm类 doGetAuthenticationInfo			方法，具体有哪些处理在realm类的注释解释*/
               filtermap.put("/admin/*","authc");
               bean.setFilterChainDefinitionMap(filtermap);
               //setLoginUrl()方法会
             
               return bean;
           }
       }
   ```

   ```java
   //省去了导包和包名
       /*这个自定义的realm实现类需要继承自 AuthorizingRealm 类，并重写doGetAuthorizationInfo(授权)和doGetAuthenticationInfo(认证/登录)*/
   public class UserRealm extends AuthorizingRealm {
       @Autowired
       AdminService adminService;
   
       @Override
       protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
           System.out.println("授权方法");
           return null;
       }
       
       /*这个方法只有当 又subject.login(token)请求时才会执行，当传回的token与数据表比对正确后就可以访问在ShiroConfig类中	  被设置为需要认证才能访问的资源了*/
       @Override
       protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
           System.out.println("认证方法");
           //获取当前用户
           Subject subject = SecurityUtils.getSubject();
           //这个函数的参数 AuthenticationTokenn 是由 Contrller层的代码传入的 把他强转为需要的类型
           UsernamePasswordToken token = (UsernamePasswordToken)authenticationToken;
           /*通过token获取 用户名查找数据表得到实体类对象，若实体类对象不存在 可以return null;shiro会直接视为抛出一个
           UnknownAccountException异常，异常处理应该在 Controller处体现*/
           Admin byName = adminService.findByName(token.getUsername());
           if (byName == null){
               return null ;
           }
           /*Shiro不允许我们进行密码的对比，只要返回一个SimpleAuthenticationInfo()对象，将密码作为参数传入，他会自动的对比
           如果密码不正确则会抛出IncorrectCredentialsException异常*/
           return new SimpleAuthenticationInfo(byname,byName.getPassword(),"");
       }
   }
   
   ```

#### 使用Shiro框架实现 用户的登录登出

`ShiroConfig`类与自定义的`realm`类参考上面，下面给出`Controller`和自定义`FormAuthenticationFilter`类的示范代码.

```java
//登录Controller
@RequestMapping(value = "/loginRequest2")
public String index2(String name, String password, HttpServletRequest request, Model model){
    System.out.println("controller start");
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken(name,password);
    //执行登录的方法
    try{
        System.out.println("controller in");
        subject.login(token);
        System.out.println("controller out");
        return "redirect:admin/admin.html";
    }catch (UnknownAccountException e){
        System.out.println("UnknownAccountException"+e);
        return "redirect:index.html";
    }catch (IncorrectCredentialsException e){
        System.out.println("IncorrectCredentialsException" + e);
        return "redirect:index.html";
    }
}
```

首先路径"/loginRequest2",不需要认证，直接访问。输出 "controller start" 然后输出"controller in"..这时执行`subject.login(token)`代码，会跳转进入自定义的realm类，执行`doGetAuthenticationInfo()`认证方法，认证成功则可以访问 "admin/admin.html"资源，认证失败抛出相关异常，异常由Controller层做处理，且不允许访问受限资源。

```java
//登出Contrller
@RequestMapping(value = "logoutRequest")
public String logout(){
    Subject subject = SecurityUtils.getSubject();
    subject.logout();
    Session session = subject.getSession();
    session.removeAttribute("user");
    return "redirect:index.html";
}
```