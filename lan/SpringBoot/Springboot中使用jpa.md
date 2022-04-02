## 	SpringBoot中使用JPA

##### 首先引入依赖

```pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

##### yml相关配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/stu
    password: 1234
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root

  jpa:
    generate-ddl: true
    hibernate:
      ddl-auto: update
```

##### 创建实体类

- @Entity用于表明这个类是一个实体类，一个实体类与一个表对应，name=用于指定表名

- @Id用于指定主键

- @GeneratedValue用于设置主键的生成规则。有两种属性

  1. stratey：有四个值

     - GenerationType.IDENTITY   由数据库id自增长的方式管理主键，oracle不支持
     - GenerationType.AUTO  JPA自动选择合适的策略，是默认选项；
     - GenerationType.SEQUENCE     过序列产生主键，通过@SequenceGenerator 注解指定序列名，MySql不支持这种方式
     - GenerationType.TABLE   通过表产生主键，框架借由表模拟序列产生主键，使用该策略可以使应用更易于数据库移植。

  2. generator的值是字符串，，默认值是空的

     

  

- @Column用于声明他是简单的列

```java
package com.jjpa.jpa.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "stu")
public class Student {
    @Id
    @GeneratedValue
    private String id;
    @Column
    private String name;
    @Override
    public String toString() {
        return "Student{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

##### 定义DAO层接口用于进行数据库的操作

这个接口必须要继承另一个接口JpaRepository 里面有两个泛型值要指定，是我们数据库表的实体类，一个是该表的主键类型

```java
package com.jjpa.jpa.dao;

import com.jjpa.jpa.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentDao extends JpaRepository<Student,Long> {
}
```

##### 操作演示

```java
package com.jjpa.jpa;
import com.jjpa.jpa.dao.StudentDao;
import com.jjpa.jpa.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class JpaApplicationTests {
    @Autowired
    StudentDao studentDao;

    Student stu = new Student(8, "haha");
    @Test
    void contextLoads() {
        System.out.printf(stu.getName());
        System.out.println(stu.getId());
        System.out.println("-------add-------");
        studentDao.save(stu);
    }
}
```

这种情况下，表内的主键id不会由我们指定，尽管我们已经写了  `new Student(8, "haha")`但最终结果会由数据库自己情况自增生成

###### 如何实现自定义的主键生成

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "selfGenerator")
@GenericGenerator(name="selfGenerator", strategy = "com.jjpa.jpa.dao.SelfGenerator")
```

```java
package com.jjpa.jpa.dao;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentityGenerator;
import java.io.Serializable;

public class SelfGenerator extends IdentityGenerator {
    @Override
    public Serializable generate(SharedSessionContractImplementor s, Object obj) {
        if(obj == null) {
            throw new HibernateException(new NullPointerException());
        }
        Serializable id = s.getEntityPersister(null, obj).getClassMetadata().getIdentifier(obj, s);
        if (id == null) {
            System.out.println("------1--------");
            return super.generate(s, obj);
        }
        else  {
            System.out.println("------3--------");
            return id;
        }
    }
}
```

##### StudentDao的对数据库的操作

通过查看我们StudentDao继承的接口JpaRepository可以知道 有哪些方法可以操作数据库

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//
package org.springframework.data.jpa.repository;

import java.util.List;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;
@NoRepositoryBean
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
    List<T> findAll();
    List<T> findAll(Sort var1);
    List<T> findAllById(Iterable<ID> var1);
    <S extends T> List<S> saveAll(Iterable<S> var1);
    void flush();
    <S extends T> S saveAndFlush(S var1);
    void deleteInBatch(Iterable<T> var1);
    void deleteAllInBatch();
    T getOne(ID var1);
    <S extends T> List<S> findAll(Example<S> var1);
    <S extends T> List<S> findAll(Example<S> var1, Sort var2);
}
```

###### findAll()函数

可以获取表中所有数据，存放在对应的实体类中

```java
List<Student> stus = studentDao.findAll();
for (Student stu: stus) {
    System.out.println(stu);
}
```

###### findAll(Sort sort)

可以指定按什么列数来进行排序

### 对象关联映射学习

在数据库中的表和表之家是由外键来维持关系。在实体类之间也需要维持一些关系

##### 一对多的关系  @OneToMany注解       多对一的关系  @ManyToOne注解

学生实体类和班级实体类的关系是学生对班级多对一，用如下的注解关系进行配置

```java
package com.jjpa.jpa.entity;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
@Entity(name = "stu")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "selfGenerator")
    @GenericGenerator(name="selfGenerator", strategy = "com.jjpa.jpa.dao.SelfGenerator")
    private long id;
    @Column
    private String name;
    @ManyToOne
    @JoinColumn(name = "ClassName")
    private Classroom classroom;
}
```

```java
package com.jjpa.jpa.entity;
import javax.persistence.*;
import java.util.List;
@Entity(name="classroom")
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clssId;
    @OneToMany(mappedBy = "classroom")
    private List<Student> students;
}
```

为了能够让两个实体类建立联系，分别在对方的类定义中使用@注解标值，在Student的表中定义了一个@JoinColumn(name = "ClassName")外键列，name为class_name。在Classroom类中的对应注解处就要使用mappedBy属性定位到  classroom。

最终Student表中会有一个class_name外键列，类型为Classroom的主键类型，且在设置值的时候。外键列的值必须要在Classroom主键中有所体现。

其中mappedby只有在OneToOne OneToMany ManyToMany上有，表示自己放弃该外键的维护权由另一个表来维护外键，所以另一个表要有@joinColumn注解。

###### 一对多的关系如何进行数据库操作

- 插入值

  为了能让Student和Classroom建立联系，在Student对象上设置的classroom对象只要主键能在数据库中有所体现，就可以建立联系了。

  ```java
  @SpringBootTest
  class JpaApplicationTests {
      @Autowired
      StudentDao studentDao;
      @Autowired
      ClassroomDao classroomDao;
      @Test
      void contextLoads() {
          Student stu = new Student(30, "wuxiaojie");
          Classroom classroom = new Classroom();
          //这时的classroom表中已经有一条classId为1的数据了，如果没有就会报错
          classroom.setClssId((long) 1);
          stu.setClassroom(classroom);
          studentDao.save(stu);
      }
  }
  ```

  ![image-20210410151402806](https://s2.loli.net/2022/04/01/wktQ38APyXmo4jD.png)           ![image-20210410151324232](https://s2.loli.net/2022/04/01/V5xLwtI7p64fcMY.png) 

- 懒查询问题

  懒查询问题出现在OneToMany的情况下，为了提高sql语句的效率

  ```java
  SpringBootTest
  class JpaApplicationTests {
      @Autowired
      StudentDao studentDao;
      @Autowired
      ClassroomDao classroomDao;
  
      @Test
      void contextLoads() {
          List<Classroom> classrooms = classroomDao.findAll();
          //在执行完上面这条语句的时候，session已经关闭。下面继续使用classroom.getStudents()懒查询 会出现        		//no session的问题。
          for (Classroom classroom: classrooms
               ) {
              System.out.println(classroom.getStudents());
          }
      }
  ```

  这时可能会出现一个异常

  *org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role: com.jjpa.jpa.entity.Classroom.students, could not initialize proxy - no Session*

  多对多      @ManyToMany注解

  解决：

  1. 在classroom类定义处设置  List\<Student\>立即加载

     ```java
     @OneToMany(mappedBy = "classroom",fetch = FetchType.EAGER)
     //fetch = FetchType.EAGER  主动立即加载
     //fetch = FetchType.LAZY    默认值，懒加载
     private List<Student> students;
     ```

  2. 延长session的声明周期：

- 删除操作的注意点

  如果表中的一行数据的主键是其他表的外键，我们无法直接删除该数据。。解决

  1. 级联删除     在两个数据表连接处 加上cascade = CascadeType.ALL

     ```java
     @OneToMany(mappedBy = "classroom",fetch = FetchType.EAGER, cascade = CascadeType.ALL)
     private List<Student> students;
     ```

  2. 先断开主外键的连接，在删除数据

     即先把其他表中关联到我们要删除的主键的外加按关联，在删除。
  
  再有如果我们要删除的数据中有外键引用了其他表的主键。可以：
  
  ```java
  @ManyToOne(cascade = CascadeType.REMOVE)
  @JoinColumn(name = "ClassName")
  private Classroom classroom;
  ```

##### 多对多的关系@ManyToMany

数据库关系：老师和班级，，一个老师负责多个班级，一个班级也有多个老师。

```java
//Teacher类声明结构
package com.jjpa.jpa.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity(name="teacher")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

    @ManyToMany(mappedBy = "teachers")
    private List<Classroom> classroom = new ArrayList<>();
}
```

```java
//Classroom类声明的结构展示
package com.jjpa.jpa.entity;

import javax.persistence.*;
import java.security.AllPermission;
import java.util.ArrayList;
import java.util.List;

@Entity(name="classroom")
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clssId;

    @OneToMany(mappedBy = "classroom",fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Student> students = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "classroom_teachers",
    joinColumns = {@JoinColumn(name = "clssId" ,referencedColumnName = "clssId")},
    inverseJoinColumns = {@JoinColumn(name = "teacherId", referencedColumnName = "teacherId")})
    private List<Teacher> teachers = new ArrayList<>();
}
```

首先各自的类定义中都要使用@ManyToMany注解进行声明。在Teacher类中我们@ManyToMany有属性mappedBy = "teachers"。这里的`teachers`  指向Classroom类中的属性。 同时意味者teacher表 放弃对外键的维护，由Classroom表定义维护第三关系表。

在Classroom类中由  @JoinTable注解来定义第三关系表，表名 = "classroom_teachers"。

属性joinColoumns用于指定当前表也就是Classroom表的主键在第三关系表中的体现。

属性inverseJoinColumns则是用于指定 另一个表 Teacher表的主键在第三关系表中的体现

![image-20210411141656962](D:\notebook\lan\SpringBoot\Springboot中使用jpa.assets\image-20210411141656962.png)  这是最后形成的表结构。

###### 多对多关系表的数据库操作

- 插入值时的注意点：

  这里我们是由Classroom类来维护外键的，所以应该由classroom建立与teacher的联系，再保存calssroom对象即可。

  再者，有一个临时对象的问题，在代码中细看。

  ```java
  @SpringBootTest
  class JpaApplicationTests {
      @Autowired
      StudentDao studentDao;
      @Autowired
      ClassroomDao classroomDao;
      @Autowired
      TeacherDao teacherDao;
      @Test
      void contextLoads() {
          Classroom clss1 = new Classroom();
          clss1.setClssId((long) 1);
          Classroom clss2 = new Classroom();
          clss2.setClssId((long) 2);
  
          Teacher teacher1 = new Teacher();
          teacher1.setTeacherId((long) 1);
          Teacher teacher2 = new Teacher();
          teacher2.setTeacherId((long) 2);
  		//这里的teacher1和2 ，如果数据表中并没有这两条数据，那么他们就是临时对象会出现NUllPointException
          //这是就需要先保存teacher1和2 teacherDao.save(teacher1),teacherDao.save(teacher2)
          clss1.getTeachers().add(teacher1);
          clss1.getTeachers().add(teacher2);
          
          classroomDao.save(clss1);
      }
  }
  ```

- 查询信息的用法，懒查询问题

- 删除时对于删除维护外键的类中的数据时，会自动删除它的第三关系表中的引用。如果要删除另一个表中的数据就要保证这条数据没有被引用。

next







