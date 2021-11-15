

# SpringBoot拦截器和过滤器实现登录拦截

#### 浅淡两者的区别

- 触发时机不一样，Filter的触发时机见下面。
- 过滤器的实现基于回调函数。而拦截器（代理模式）的实现基于反射
- **拦截器**可以获取IOC容器中的各个bean，而过滤器就不行，因为拦**截器是spring提供并管理的**，spring的功能可以被拦截器使用，在拦截器里注入一个service，可以调用业务逻辑。而过滤器是JavaEE标准，只需依赖servlet api ，不需要依赖spring。
- 过滤器可以修改 `Request`和`Response `而拦截器不能
- 拦截器可以使用IOC容器中的各种依赖，过滤器不能

## SpringBoot的过滤器 Filter

- 在HttpServletReques进入容器后到达Servlet之前，拦截客户的HttpServletRequest。
- 根据需要检查HttpServletRequest，也可以修改HttpServletRequest头和数据。
- 在HttpServletResponse被servlet处理完成后到达客户端之前，拦截HttpServletResponse。
- 根据需要检查HttpServletResponse，也可以修改HttpServletResponse头和数据。

*注意Filter这个类的包是 javax.servlet.Filter ,* 去实现这个这个接口,总体需要重写三个方法  `init()`初始化方法,`doFilter()`过滤方法, `destroy()` 销毁方法.   在类前加上 `@WebFilter`注解 指定要过滤处理的路径,并在入口类上加上`@ServletComponentScan`注解 ，不加@ServletComponentScan注解无法注入Filter，这个注解的作用就是去扫描@WebServlet、@WebFilter、@WebListener这类特殊注解。如果不加，spring容器是不会主动扫描的

```java
package com.example.mybaitstest.Filter;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;
import java.util.Date;
//使用方法是在类前加上 @WebFilter注解 指定要过滤处理的路径
@WebFilter(urlPatterns = "/*")
public class FilterTest implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("过滤器初始化");
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain 		        				  filterChain) throws IOException, ServletException {
        //将ServletRequest类型强转为  HttpServletRequest,为了能使用getSession()获取Session
        HttpServletRequest httpServletRequest = (HttpServletRequest)servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse)servletResponse;
        System.out.println("开始执行过滤器"+httpServletRequest.getSession().getAttribute("user"));
        
        if (httpServletRequest.getSession().getAttribute("user") != null){
            //重要方法,把servletRequest和servletResponse移交给下一个Filter处理,如果没有Filter则由Controller处理
            filterChain.doFilter(servletRequest, servletResponse);
        }
        else {
            //可以对 httpServletResponse处理senRedirect() 实现重定向.
            httpServletResponse.sendRedirect(httpServletRequest.getContextPath()+"/loginh");
            System.out.println("nothing");
        }
    }
    @Override
    public void destroy() {
        System.out.println("过滤器销毁");
    }

}
```

###### filterChain.doFilter(servletRequest, servletResponse) 更多细节

如果有多个Filter实现类，可以在上面加上 `@Order(1)` 注解，其中的数字越小，代表越优先被该过滤器捕捉到。



## SpringBoot中使用拦截器  *HandlerInterceptor接口*

新建一个类用于实现 `org.springframework.web.servlet.HandlerInterceptor`这个接口，重写三个方法，三个方法何时执行见代码。加上`@Compenent`注解

```java
package com.example.mybaitstest.Fliter;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HandleIntercepterTest implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("在处理拦截之前运行");
        //只有这里返回true才会触发下面的拦截处理函数，返回false直接跳过了。
        return false;
    }
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("路径被拦截成功后才会执行，这里就是拦截后运行处理代码的地方");
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("拦截处理完以后才会执行，不管拦截成功与否");
    }
}
```

还没有实现组件的注入，新建一个类继承  `org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter`类

重写`addInterceptors()`方法

```java
package com.example.mybaitstest.Fliter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.annotation.Resource;

@Component
public class HandleIntercepterConfig extends WebMvcConfigurerAdapter {
    @Autowired
    HandlerInterceptor handlerInterceptor;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration interceptorRegistration = registry.addInterceptor(handlerInterceptor);
        interceptorRegistration.addPathPatterns("/admin/*");
    }
}
```

#### 拦截器和过滤器的执行顺序

![32361-20180530095349427-444141538.png](SpringBoot%E8%BF%87%E6%BB%A4%E5%99%A8Fliter%E5%92%8C%E6%8B%A6%E6%88%AA%E5%99%A8Intercepter.assets/32361-20180530095349427-444141538.png) 

