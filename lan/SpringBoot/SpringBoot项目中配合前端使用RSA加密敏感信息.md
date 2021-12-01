## SpringBoot项目中的配合前端实现加密

### RSA加密流程

#### 利用java.security.\*.\*下的一系列包与类

生成的公钥与私钥对需要配套使用。大致流程为：

1. 客户端在传送一些敏感信息之前（如登录请求），先发送get请求，获取公钥publicKey。

2. 客户端用js实现公钥加密信息，传送信息。
   [[利用jsencrypt.js进行加密]]
3. 服务端使用对应的私钥解密后获取信息。

```java
public class RSAUtils {
    /**
     * @return 返回HashMap类型，将keys数据转为String返回
     * */
    static public HashMap<String, String> getKeyPair() {
        HashMap<String, String> keyMap = null;
        try {
            keyMap = new HashMap<>();
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(1024, new SecureRandom());
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            String privateKey = new String(Base64.encodeBase64(keyPair.getPrivate().getEncoded()));
            String publicKey = new String(Base64.encodeBase64(keyPair.getPublic().getEncoded()));

            keyMap.put("public", publicKey);
            keyMap.put("private", privateKey);
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return keyMap;
    }
    /**
     *  @param msg 传入String类型待加密信息
     *  @param key String类型的公钥，一般用公钥加密
     *  @return 返回String类型的加密后信息
     * */
    static public String encrypt(String msg, String key) {
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
        String res = null;
        try {
            RSAPublicKey rsaKey = (RSAPublicKey) KeyFactory.getInstance("RSA").
                    generatePublic(new X509EncodedKeySpec(Base64.decodeBase64(key)));
            Cipher cipher = Cipher.getInstance("RSA/None/PKCS1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, rsaKey);
            res = new String(cipher.doFinal(msg.getBytes("UTF-8")), "ISO-8859-1") ;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return res;
    }
    /**
     * @param msg 传入String类型的待解密信息
     * @param key String类型的私钥
     * @return 返回String类型的解密后数据
     * */
    static public String decrypt(String msg, String key) {
        String res = null;
        try {
            RSAPrivateKey rsaKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
                   .generatePrivate(new PKCS8EncodedKeySpec(Base64.decodeBase64(key)));
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, rsaKey);
            byte[] r = Base64.decodeBase64(msg);
            res = new String(doSectionEncrypt(cipher, r));
        }catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return res;
    }
    /**
     * @deprecated doFinal()一次最多处理等长于密钥字节数的数据，待解密数据长于128时 用于分段解密
     * */
    static private byte[] doSectionEncrypt(Cipher cipher, byte[] msgByte)
            throws BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException {
//        byte[] msgByte = msg.getBytes("UTF-8");
        int MAX_BLOCK = 128;
        int msgLen = msgByte.length;
        int offset = 0;
        byte[] res = {};
        byte[] cache = {};
        while (msgLen - offset > 0) {
            if  (msgLen - offset > MAX_BLOCK) {
                cache = cipher.doFinal(msgByte, offset, MAX_BLOCK);
                offset = offset + MAX_BLOCK;
            } else {
                cache = cipher.doFinal(msgByte, offset, msgLen-offset);
                offset = msgLen;
            }
            res = Arrays.copyOf(res, res.length + cache.length);
            System.arraycopy(cache, 0, res, res.length - cache.length, cache.length);
        }
        return res;
    }
}
```
