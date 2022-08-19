### 实际场景中注意点
[[http协议详解#各种MIME类型]]

#### 以application/json编码 post数据

##### axios + SpringMVC为例

```js
axios({
    url: '/login',
    method: 'post',
    data: {
        name: 'feizzer',
        password: '123456'
    },
    headers: {
        //axios默认的编码方式就是 application/json
        'Content-Type': 'application/json'
    }
})
```

*注意我们把信息放在了data字段下*，这个时候信息会被放在请求体里传输到服务器端。SpringMVC侧可以通过

 `@RequestBody POJO pojo`将传输的信息映射到服务器端的实体类中。或 `@RequestBody Hashmap<String, String> map`将信息意义映射到这个map中去。

```java
public Result login(@RequestBody Admin admin) {
    String name = admin.getName();
    String password = admin.getPassword();
    System.out.println(name + password);
}
```

#### 以application/x-www-form-urlencoded编码post数据

##### axios+SpringMVC为例

```js
axios({
    url: '/login',
    method: 'post',
    params: {
        name: 'feizzer',
        password: '123456'
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
```

*此时信息放在params字段下*，SpringMVC侧可以通过 `@RequestParam`注解在接口方法的参数里接收传输的数据。甚至当形参名和表单里的名一样时 `@RequestParam`都可以省略。

```java
public Result login(@RequestParam("name") String name, @RequestParam("password") String password) {
    System.out.println(name + password);
}
```

*这种情况下如果错用了注解 `@RequestBody` 会出现 http code为 415的报错（Unsupported Media Type 服务器无法处理请求附带的媒体格式）*

### 请求头中Content-Type的几种类型

在进行数据传输的过程中，需要区分数据类。在http协议的请求头中用Content-Type字段来表示传输信息的类型。Content-type（Internet Media Type），在有一些地方也用 MIME表示。

#### application/x-www-form-urlencoded

较为常见的 POST 提交数据的方式，网页原生Form表单，如果不设置表单\<form\>标签的enctype 属性，默认为application/x-www-form-urlencoded 方式提交数据。提交数据时会将表单数据转化为 `name=feizzer&password=123456` 类似的键值对形式。

jquery中用AJAX进行数据提交时，也可以设置使用这个类型的Content-Type 。	

#### multipart/form-data

表单属性设置`enctype="multipart/form-data"`后，post传输数据类型就发生变化。此编码类型目的是为了提高二进制文件的传输效率。因此适合传输如图片，视频，压缩文件这类资源。

该编码方式的另一个主要字段是 boundary。该字段为分隔符将多个文件或表单符分割开来。，

后续在做测试。。。。。。。。。。

#### application/json

是现在非常重要的编码方式。在前后端分离的场景中更为常见（vue-cli中使用axios请求库默认的Content-Type就是application/json）。

#### text/xml

#### binary (application/octet-stream)