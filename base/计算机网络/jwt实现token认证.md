##### 传统的session和cookie实现认证的方式

[[前端浏览器的存储技术]]

由服务端的session存储用户的登录信息， 浏览器端cookie中携带sessionID来确认用户的身份。

### jwt实现授权认证

jwt(jsonwebtoken) 是一种开放的标准(rfc7519), 定义一种紧凑的自包含的方式在各方之间进行json数据的传递。

##### jwt的组成

jwt有三个部分 用`.`来拼接。这三个部分分别是：

- 标头  Header : -Header一般有两个信息 令牌类型和所使用的算法。 会使用Base64编码组成JWT结构的Header部分

  ```json
  { 
      "alg" :"HS256", //常用算法
      "tye": "JWT"
  }
  ```

- 负载  Payload : 该部分是有效负载部分，可以将一些需要的用户信息放在里面. 也是使用base64编码

  ```json
  {
      "name": "feizzer",
      //"password": "123456" //注意这部分信息是可解码的，不应该将将密码直接放入
  }
  ```

- 签名  signnature ： signnature部分需要使用编码后的Header和Payload加上我们提供的一个密钥 ，然后使用Header中使用的的加密算法进行加密。 签名的作用是保证token没有篡改过。

##### jwt实现token验证的简单流程

![jwt token流程](https://s2.loli.net/2022/03/31/JBlbTFjOdg3Zipm.png)

