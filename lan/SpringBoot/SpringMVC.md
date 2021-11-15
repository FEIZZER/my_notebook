## SpringMVC

springMVC的model往往指项目中的dao和servide层，view是项目中的页面(html, thymeleaf)等，controller就是控制层实际就是servlet

##### 首先配置web.xml

关注其中的DispatcherServlet类，这个是整个工作的核心类。在tomcat服务器启动时就会创建DispatcherServlet类的对象实例。因为在DispatcherServlet对象实例创建中，会同时创建springmvc容器对象，读取springmvc的配置文件并将配置文件中的对象都创建好。

所以要配置\<load-on-startup\>1\</load-on-startup\> 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/applicationContext.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
<!--    <init-param>-->
<!--        <param-name>contextConfigLocation</param-name>-->
<!--        <param-value>classpath:test.xml</param-value>-->
<!--    </init-param>-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

这里的springmvc配置文件如果不配置就会默认是 \<servlet-name\>的值加上  -servlet  就是dispatcher-servlet.xml。

想要配置专门的xml配置文件，看注释掉的内容。

##### 编写dispatcher-servlet.xml

把有关/hello的请求处理方式映射到controller.HelloController这个类中。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="simpleUrlHandlerMapping"
          class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
        <property name="mappings">
            <props>
                <!-- /hello 路径的请求交给 id 为 helloController 的控制器处理-->
                <prop key="/hello">helloController</prop>
            </props>
        </property>
    </bean>
    <bean id="helloController" class="controller.HelloController"></bean>
</beans>
```

##### 编写controller类

在这个类中返回一个模型视图给某一个页面，页面显示结果

```java
package controller;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class HelloController implements Controller {
    @Override
    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView mav = new ModelAndView("index.jsp");
        mav.addObject("msg", "MVC test");
        return mav;
    }
}
```

这里的 ModelAndView mav = new ModelAndView("index.jsp");如果  index.jsp的路径过于繁琐，可以通过在dispatcher-servlet.xml文件中用视图解析器设置前缀和后缀。

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value=""></property>
    <property name="suffix" value=""></property>
</bean>
```

##### 整个过程

1. 注意看wen.xml文件，所有的请求都会请求给DispatcherServlet这个中央控制器。
2. DispatcherServlet根据我们给他配置的xml文件，这里是dispatcher-servlet.xml文件得知不同的请求转到不同的请求类中。
3. DispatcherServlet把请求交由controller.HelloController来处理。



#### controller类中具体要实现的内容，@Controller注解学习

##### ModelAndView

译为模型和视图，使用ModelAndView类用来存储处理完后的结果数据，以及显示该数据的视图。业务处理器调用模型层处理完用户请求后，把结果数据存储在该类的model属性中，把要返回的视图信息存储在该类的view属性中，然后让该ModelAndView返回该Spring MVC框架。框架通过调用配置文件中定义的视图解析器，对该对象进行解析，最后把结果数据显示在指定的页面上。 

1. setName()方法设置最后跳转到的页面。注意dispatcher-servlet.xml中有视图解析器的话，页面路径会被解析为 ：

   前缀+setViewName的参数数+后缀

2. addObject()  传递要返回的值

##### ModelAndView和Model

- Model是每次请求都含有的默认参数，通过addAttribute()设置值，并传递到下一个页面中去。

  ```java
  @RequestMapping(value = {"/index","/"} )
  public String indexContrller(Model model){
      model.addAttribute("name", "xiaojie");
      return "index";
  }
  ```

- ModelAndView使用时需要我们自己进行实例化，设置跳转页面等等

  ```java
  @RequestMapping(value = {"/index","/"} )
  public ModelAndView indexContrller(){
      ModelAndView mav = new ModelAndView();
      mav.setViewName("index");
      List<Article> allarticle = articleDao.findAll();
      mav.addObject("allarticle",allarticle);
      return mav;
  }
  ```

