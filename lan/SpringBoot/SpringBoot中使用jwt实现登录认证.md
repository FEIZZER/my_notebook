[[jwt实现token认证]]

[jwt官网](https://jwt.io/)   

### springboot中使用jwt实现权限认证

实现了jwt的库有很多，这里使用 auth0.java-jwt 实现  [auth0/java-jwt的项目地址](https://github.com/auth0/java-jwt) 

##### 1. 添加maven依赖

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.19.1</version>
</dependency>
```

##### 2. 生成和校验token的简单实例

```java
package com.feizzer.graduation_design_programme.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.feizzer.graduation_design_programme.entity.User;

/**
 * @program: Graduation_design_programme_back-end
 * @description: use com.auth0/java-jwt generate token
 * @author: feizzer
 * @email: feizzer@163.com
 * @create: 2022-03-31 16:30
 */
public class JWToken {
    private static String SECRET = "%$@$%@$%@$%(";
    public static String generateToken(User user) {
        String token = "";
        token = JWT.create()
                .withAudience(user.getName())
                .sign(Algorithm.HMAC256(SECRET));
        return token;
    }
}
```

#### `com.auth0.jwt.*`包的大致结构

###### 首先看 JWT入口主类 主要有三个方法分别对应了 生成 解码 校验

```java
package com.auth0.jwt;

import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.impl.JWTParser;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.Verification;

public class JWT {
    private final JWTParser parser = new JWTParser();
    public JWT() {}

    public static DecodedJWT decode(String token) throws JWTDecodeException {
        return new JWTDecoder(token);
    }

    public static Verification require(Algorithm algorithm) {
        return JWTVerifier.init(algorithm);
    }

    public static Builder create() {
        return JWTCreator.init();
    }
}
```

##### 首先看生成Token的部分

###### JWT.create()方法

该方法返回的是 `com.auth0.JWTCreator`中的一个内部类对象`Builder` 该类内部有两个主要属性，分别对应jwt中的Header和Payload部分:

```java
private final Map<String, Object> payloadClaims = new HashMap();
private final Map<String, Object> headerClaims = new HashMap();
```

###### 接着调用 .withAudience(string )方法

这个方法则是在负载部分 payloadClaims中添加了一个属性（一般表示为用户的信息）

```java
public JWTCreator.Builder withAudience(String... audience) {
    this.addClaim("aud", audience);
    return this;
}
```

```java
private void addClaim(String name, Object value) {
    if (value == null) {
         this.payloadClaims.remove(name);
    } else {
        this.payloadClaims.put(name, value);
    }
}
```

==其他几个比较主要的方法==

- .withPayload(Map<String, ?> payloadClaims) 直接传入Map存入payloadClaims
- .withExpiresAt(Date expiresAt)   传入过期时间
-  

###### 接着调用 sign(Algorithm algorithm) 方法 返回string类型的token字符串

同时给Header部分添加 typ字段和alg字段

```java
public String sign(Algorithm algorithm) throws IllegalArgumentException, JWTCreationException {
    if (algorithm == null) {
        throw new IllegalArgumentException("The Algorithm cannot be null.");
    } else {
        this.headerClaims.put("alg", algorithm.getName());
        if (!this.headerClaims.containsKey("typ")) {
            this.headerClaims.put("typ", "JWT");
        }

        String signingKeyId = algorithm.getSigningKeyId();
        if (signingKeyId != null) {
            this.withKeyId(signingKeyId);
        }

        return (new JWTCreator(algorithm, this.headerClaims, this.payloadClaims)).sign();
    }
}
```

其中 `com.auth0.jwt.algorithms.Algorithm`类中定义了可节后是的算法之类以及如何使用。

