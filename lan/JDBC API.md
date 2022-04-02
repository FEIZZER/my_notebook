#   JDBC

理解JDBC

1. JDBC的API 提供各种驱动 Connection ,PreparedStatement, ResultSet等等
2. JDBC DriverManager 管理不同的数据库驱动
3. 各种数据库驱动由数据库厂商提供

<img src="https://s2.loli.net/2022/04/02/DlkHAvG1hIEpnC3.png" alt="image-20201024200743029" style="zoom:50%;" />  

## java来连接数据库的四个步骤

1. 导入驱动，加载具体驱动类
2. 与数据库建立联系
3. 发送sql ，执行
4. 处理结果集

#### 导入驱动，加载具体驱动类

以mysql为例将下载好的mysql驱动（mysql-connector-java-xxx.jar）放入项目文件中，同时右键选择 build path导入， 

再用    *Class.forName("com.mysql.jdbc.jc.Driver");*     加载驱动类

5.0以上的驱动包写 *com.mysql.jdbc.jc.Driver*  。5.0及以下的为 *com.mysql.jdbc.Driver*

#### 与数据库建立联系

这里以mysql为例

```java
import java.sql.*;
//导入java.sql的所有的包
public class JDBCdemo {
	public static void main(String[] args) {
		Statement statement = null;
		ResultSet res = null;
		try {
			Class.forName("com.mysql.jdbc.jc.Driver");
			//con = DirverManager.getConnection("jdbc:mysql://localhost:3306/stu","xiaojie","132791");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/stu?
                                                          serverTimezone=UTC", "roo,  "1234");
			}
		catch(Exception e){
			out.println(e);
		}
```

DriverManager.getconnection()的参数



## JDBC的各类接口

### Driver类

先忽略

### DriverManager接口的常用方法

##### void registerDriver(driver driver)   和  void deregisetrDriver(driver driver)

用于注册驱动程序和删除驱动程序

```java
Driver driver = new com.mysql.jdbc.Driver();
 DriverManager.registerDriver(driver);
```

另一种加载驱动的方式，区别于Class.forName();

##### connection getConnection(String url, String user, String password);

```java
Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/stu?serverTimezone=UTC", 														 "root","1234");
```

建立数据库连接

?serverTimezone=UTC是为了设置时区。



### Connection接口

##### Statement createStatement();

返回一个sql语句对象 适合执行无参数的的语句。

```java
Statement statement = null;
statement = con.createStatement();
String sql = "select * from stu";
res = statement.executeQuery(sql);
```

###### ResultSet executeQuery(String sql)

用于select查询语句，查询结果返回给ResultSet对对象

###### int executeUpdate(String sql)

用于更新数据库内的数据，返回更新的记录数

###### void addBatch(String sql)和void clearBatch() 和int[] executeBatch()

###### void close()

##### PreparedStatement prepareStatement(String sql) 

创建返回一个PreparedStatement sql语句对象 适合带参数的语句，且进行了语句的预编译。

```java
String sql = "select * from stu where id=?";
PreparedStatement state = con.prepareStatement(sql);
state.setString(1," ");
```

###### void state.setXXX(int index,para)

用于设置sql语句中 *？* 位置的值，para参数值，index为参数顺序。

###### void state.clearParameter()

清除参数值

###### void state.executeQuery()和 void state.executeUpdate()

###### void close()

##### CallableStatement prepareCall()

创建CallableStatement对象。该语句用于执行调用存储过程。

##### 事务处理的想法setAutoCommit(boolean )

是否启用自动提交模式

```java
//conn使一个Connection对象
conn.setAutoCommit(false);//关闭自动提交
...
...
...
//stmt是一个PreparedStatement对象
stmt.executeUpdate(sql); //executeUpdate()只会加入sql语句，不会执行。
conn.Commit();           //这时所有的sql语句才会执行
//如果中间出了什么错误，会自动rollBack()回到setAutoCommit(false)的位置
conn.setAutoCommit(true);
```



##### void close()

关闭数据库连接



### ResultSet结果集接口

ResultSet对象由state经executeQuery()产生

###### boolean first() last() 

指针移动到第一行或最后一行，若res为空 则返回false；

###### boolean isFirst() isLast() 和  boolean isAfterLast() isBeforeFirst()

判断是否在第一个最后一个，第一个之前最后一个之后的位置

###### boolean previous() 和 next()

指针移动到当前位置的前一个后一个，如果移动超出返回false

###### boolean absolute(int index) 和relative(int index)

absolute()指针直接移动到第index行，index可为负数

relative() 指针在当前行向下移动index行，index可为负数。

###### int getRow()

获取当前指针位置。

###### XXX getXXX(index|column)

获取表内的数据

```java
String name = rs.getString("name"); //获取当前行列为name 的数据值
String column = rs.getString(2); //获取当前行的第二列的值
```



## 存储过程和存储函数

## 处理大文件

### CLOB类型 能存储文本数据

在mysql里为text类型

存放文件

```java
String sql="insert into medius values(?, ?);";
statement = con.prepareStatement(sql);
statement.setInt(1,1);
File file = new File("D:\\novel.txt");
InputStream in = new FileInputStream(file);
Reader reader = new InputStreamReader(in, "UTF-8");
statement.setCharacterStream(2, reader,file.length());
statement.executeUpdate();
```

读取文件有问题代码

```
sql = "select novel from medius where id=1;";
statement = con.prepareStatement(sql);
ResultSet rs = statement.executeQuery();
rs.next();
Reader reader_out = rs.getCharacterStream("novel");
FileWriter  write_down = new FileWriter("src/novel.txt");
char[] chs = new char[100];
int len = -1;
while((len = reader_out.read(chs)) != -1) {
write_down.write(chs,0,len);
}
```



### BlOB类型，二进制文件可以存放图片音频视频。

