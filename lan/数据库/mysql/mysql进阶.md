### 简单的mysql架构分层

<img src="mysql%E8%BF%9B%E9%98%B6.assets/1066923-20190221103706946-1180917597.png" alt="img" style="zoom:67%;" />

##### mysql常见引擎的区分

###### InnoDB

默认的mysql引擎，支持**外键和事务**，是以**行锁**的形式保证数据安全，不仅会缓存索引还会缓存真实数据，对内存的要求高，关注点在事务上。

###### myISAM

不支持**外键和事务**，以 **表锁**保证数据安全，一次不适合高并发的环境。只缓存索引，关注性能。

##### sql语句的机读顺序

正常sql语句

```sql
select * form [] where [] group by [] having [] o
```

###### 机读顺序

from,  on,  join,  where,  group by,  having,  select,  distinct,  order by,  limit .


### mysql的索引原理



