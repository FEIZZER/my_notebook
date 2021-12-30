```js
export default function encrypt(data) {
	//获取服务端发送来的公钥信息
    let publicKey = sessionStorage.getItem("publicKey")
    let encrypt = new JSEncrypt
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(data,)
}
```

