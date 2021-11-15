[[mybaits分页插件]]

## 在SpringBoot中使用Mybaits

##### 首先引入依赖

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>
```

##### 创建与表相对应的实体类

![image-20210419205547035](Springboot%E4%B8%AD%E4%BD%BF%E7%94%A8Mybaits.assets/image-20210419205547035.png)  表结构

```java
//对应的实体类
package com.example.mybaitstest.entity;

public class Test {
    private Long id;
    private String name;
    private Long class_name;
    public Test() {
    }
}
```

##### Dao层接口创建

这个接口要加上组件注解@Repository。这里定义了一个select方法具体实现还未写。

```java
package com.example.mybaitstest.dao;

import com.example.mybaitstest.entity.Test;
import org.springframework.stereotype.Repository;

@Repository
public interface TestDao {
    Test select(Long id);
}
```

##### 添加mapper映射文件

这里我放在resources下的mapper文件加下。mapper文件的格式见注释

[mybatis的映射文件规则](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html) 



```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--这里的namespace指向我们想要实现的Dao接口处-->
<!--这个xml文件实际就是通过映射sql语句来实现Dao接口里的关于查询的方法.一般一个映射文件对应一个Dao接口-->
<mapper namespace="com.example.mybaitstest.dao.TestDao">
    <resultMap id="BaseResultMap" type="com.example.mybaitstest.entity.Test">
        <!--指定数据表列与实体类属性之间的联系，一般要求两者字段完全一致，不然挥发传值-->
        <result column="id" jdbcType="BIGINT" property="id" />
        <result column="name" jdbcType="VARCHAR" property="name" />
        <result column="class_name" jdbcType="BIGINT" property="class_name"/>
    </resultMap>
    <!--这种方法是利用了 resultMap建立表与数据库表之间的联系-->
    <select id="select" resultMap="BaseResultMap">
        select * from test where id = #{id}
    </select>
    <!--id 值必须我们要实现的查询方法的名称,这种情况没有resultMap的介入如果实体类属性名和数据表字段名不一样就会导致该数据查不			到-->
    <select id="select" resultType="com.example.mybaitstest.entity.Test">
        select * from test where id = #{id}
    </select>
    
</mapper>
```

##### 注意点：

<img src="Springboot%E4%B8%AD%E4%BD%BF%E7%94%A8Mybaits.assets/image-20210419210445699.png" alt="image-20210419210445699" style="zoom:50%;" /> 项目结构。

1. 需要在主程序类中指定Dao接口的扫描范围：

   ```java
   package com.example.mybaitstest;
   
   import org.mybatis.spring.annotation.MapperScan;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   
   //如果不加这个注解，也可以在所有的实体类上加上 @Mapper 注解告诉SpringBoot。
   @MapperScan("com/example/mybaitstest/dao")
   @SpringBootApplication
   public class MybaitstestApplication {
       public static void main(String[] args) {
           SpringApplication.run(MybaitstestApplication.class, args);
       }
   }
   ```

2. application.yml配置文件中指定xml映射文件的扫描路径

   ```yml
   mybatis:
     mapper-locations: classpath:mapper/*.xml
   ```

   1. 由于springboot 在build项目文件时会过滤掉xml文件，所以我们要在pom文件中指定某一路径下的文件不被过滤.在\<build\>元素中

   ```xml
   <build>
       <resources>
           <resource>
               <directory>src/main/resources</directory>
               <!-- src/main/resources下的指定资源放行 -->
               <includes>
                   <include>**/*.properties</include>
                   <include>**/*.yml</include>
                   <include>**/*.xml</include>
               </includes>
               <filtering>false</filtering>
           </resource>
       </resources>
   </build>
   ```

#### mybatis多表查询简单记录

目前不是很明白多表查询的应用场景

##### 一对一的形式

不想测试了

##### 一对多

两个实体类，由`Article`类管理外键，所以 `Article`类中的adminuid在数据表中有体现，而`Admin` 类中的article_list在表中是没有体现的，所以想要 搜索得到的 `Admin`对象结果的 article_list必须要关联查询才不会是 null

```java
public class Admin {
    @ApiModelProperty(value = "uid主键")
    private Long uid;
    @ApiModelProperty("用户名，不可重复")
    private String username;
    @ApiModelProperty("密码")
    private String password;

    private List article_list = new ArrayList();
    public Admin() {
    }
}
```

```java
public class Article {
    private Long article_id;
    private String content;
    private String title;
    private Date create_time;
    private Date update_time;
    private Long adminuid;
    public Article() {
    }
}
```

###### 联合查询  

在使用联合查询的时候，如果其中一个表没有任何记录那么查出来的表也一定没有任何记录。应该可以用左(右)连接查询解决.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mybaitstest.dao.AdminDao">
    <resultMap id="AdminResultMap2" type="com.example.mybaitstest.entity.Admin">
        <result column="uid" jdbcType="BIGINT" property="uid" />
        <result column="name" jdbcType="VARCHAR" property="username" />
        <result column="password" jdbcType="VARCHAR" property="password"/>
        <collection property="article_list" ofType="com.example.mybaitstest.entity.Article">
            <result property="article_id" jdbcType="BIGINT" column="article"></result>
            <result property="content" jdbcType="VARCHAR" column="content"></result>
            <result property="title" jdbcType="VARCHAR" column="title"></result>
            <result property="create_time" jdbcType="DATE" column="create_time"></result>
            <result property="update_time" jdbcType="DATE" column="update_time"></result>
        </collection>
    </resultMap>
    <select id="findAll" resultMap="AdminResultMap2">
        select a.uid,a.name,a.password,b.* from admin as a,article as b where a.uid=#{id} and b.adminuid=a.uid;
    </select>
</mapper>
```

###### 分布查询与懒加载

```java
@Mapper
@Repository
public interface ArticleDao {
    /**
     * @Description find all article
     * @return  List<com.feizzer.blogsystem.PO.Article>
     */
    List<Article> findArticleAll();
}
```

```java
Repository
@Mapper
public interface LabelDao {
    /**
     * @param id   articel_id
     * @return     list of com.feizzer.blogsystem.po.Label
     */
    List<Label> findLabelsByArticleId(Long id);
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--这里的namespace指向我们想要实现的Dao接口处-->
<!--这个xml文件实际就是通过映射sql语句来实现Dao接口里的关于查询的方法.一般一个映射文件对应一个Dao接口-->
<mapper namespace="com.feizzer.blogsystem.dao.ArticleDao">
    <resultMap id="ArticleResultMap" type="com.feizzer.blogsystem.po.Article">
        <!--指定数据表列与实体类属性之间的联系，一般要求两者字段完全一致，不然挥发传值-->
        <id column="article_id" jdbcType="BIGINT" property="articleID" />
        <result column="title" jdbcType="VARCHAR" property="title" />
        <result column="content" jdbcType="CLOB" property="content"/>
        <collection property="labels" ofType="com.feizzer.blogsystem.po.Label"
                    select="com.feizzer.blogsystem.dao.LabelDao.findLabelsByArticleId"
                    column="article_id">
            <id property="labelContent" column="label_content" jdbcType="VARCHAR"/>
        </collection>
    </resultMap>
    <select id="findArticleAll" resultMap="ArticleResultMap">
        select * from article
    </select>
</mapper>
```

