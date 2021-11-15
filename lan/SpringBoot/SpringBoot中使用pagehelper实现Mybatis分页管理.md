# 使用pagehelper实现Mybatis分页管理

#### 配置步骤

1. ##### 添加依赖

   ```xml
   <dependency>
       <groupId>com.github.pagehelper</groupId>
       <artifactId>pagehelper-spring-boot-starter</artifactId>
       <version>1.2.5</version>
   </dependency>
   ```

2. ##### 配置Pagehelper

   - 方法一 ：编写一个配置类，并把他做一个组件注入。

     ```java
     @Configuration
     public class PagehelperConfig {
         @Bean
         public PageHelper getPageHelper(){
             PageHelper pageHelper=new PageHelper();
             Properties properties=new Properties();
             properties.setProperty("helperDialect","mysql");
             properties.setProperty("reasonable","true");
             properties.setProperty("supportMethodsArguments","true");
             properties.setProperty("params","count=countSql");
             pageHelper.setProperties(properties);
             return pageHelper;
         }
     }
     ```

   - 方法二：直接在 yml文件中添加配置参数

     ```yml
     # 配置pagehelper参数
     pagehelper:
       helperDialect: mysql
       reasonable: true
       supportMethodsArguments: true
       params: count=countSql
     ```

3. ##### 注意写好 Dao层和Mapper.xml之间的关系

4. ##### controller层使用 pagehelper和Dao层的方法

   `pagehelper.startPage(pageNum,limit)` ；pageNum表示查询第几页的内容，limit表示每一页有几条内容。

   在执行完一条 `pagehelper.startPage(pageNum,limit)`代码后，下一条 通过Dao层由Mapper实现的 查询指令就会实现分页查询。

   为一个一个注意点就是 *要保证每一个 `satrtPage()`指令都被一条查询指令消耗* 。

   ```java
   //注意使用注入的组件的前提是使用了 配置类的方法注入pagehelper组件，前面的第二步。
   @Autowired
   PageHelper pageHelper;
   @GetMapping(value = "fenye")
   @ResponseBody
   public List<com.example.mybaitstest.entity.Admin> fenye(){
       /*如果没有使用注入组件的方法，可以使用 PageHelper静态类,
     	  PageHelper.startPage(2,3); */
       pageHelper.startPage(2,3);
       List<com.example.mybaitstest.entity.Admin> admins = adminDao.findAll2();
       PageInfo<com.example.mybaitstest.entity.Admin> pageInfo = new PageInfo<>(admins);
       return pageInfo.getList();
   }
   ```