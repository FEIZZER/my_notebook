### java使用jedis操作redis

下载 `jedis-2.9.0.jar` 后添加到项目依赖中就可以import使用了

##### 使用最普通的 new Jedis(host, port) 简历一个连接

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;
import redis.clients.jedis.exceptions.JedisDataException;
import java.util.List;
public class JedisTest {
    static private Jedis jedis = new Jedis("localhost", 6379);
    public void link(){
        try {
            jedis.ping();
            System.out.println("连接redis成功");
        }catch (JedisConnectionException e) {
            e.printStackTrace();
        }
    }
    public void set(String key, String value){

        jedis.set(key, value);
    }
    public String get(String key) {
        return jedis.get(key);
    }
    //value类型是 链表的情况
    public void lpush(String key, List<String> list) {
        for (String str: list
             ) {
            jedis.lpush(key, str);
        }
    }
    public List<String> lrange(String key) {
        return jedis.lrange(key, 0, -1);
    }
}
```

所有的方法名都与在Redis客户端操作库的指令一摸一样，这里不再全部演示[[redis#Redis的基本操作]]

```java
import com.xiaojie.jedistest.JedisTest;
import redis.clients.jedis.exceptions.JedisDataException;
import java.util.ArrayList;
import java.util.List;
public class Gomain {
     private static JedisTest jedisTest = new JedisTest();
     public static void main(String[] args) {
         jedisTest.link();
        
         List<String> strs = new ArrayList<>();
         strs.add("str1"); strs.add("str2");
         jedisTest.lpush("k1", strs);
         System.out.println(jedisTest.lrange("k1"));

         // 方法与redis内部的value匹配错误，用异常捕捉这些情况
         try{
             System.out.println(jedisTest.get("k1"));
         } catch (JedisDataException exception) {
             exception.printStackTrace();
         }
    }
}
```

jedis对Redis的各种数据操作，出现方法与value类型不匹配时都会抛出异常 JedisDataException，使用异常捕获可以优雅的解决这类繁杂的问题。



##### JedisPool