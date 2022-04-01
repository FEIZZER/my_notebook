

   对象存储（Object Storage Service，OSS），也叫基于对象的存储，是一种解决和处理离散单元的方法，可提供基于分布式系统之上的对象形式的数据存储服务，具有可拓展、可管理、低成本等特点，支持中心和边缘存储，能够实现存储需求的弹性伸缩，主要应用于海量数据管理的各类场景。

### 场景一

###### 主要将各种大文件（图片，视频。。）存入aliyun的oss服务器，而不用放在自己的服务器上，再由https路径直接获取。

#### 通过编程语言API实现OSS文件的存储

##### 创建阿里云的accessKey用户

![image-20210930195824101](%E4%BD%BF%E7%94%A8aliyun%E7%9A%84oss%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8.assets/image-20210930195824101.png)

accesskey用户是访问阿里云api的密钥。在创建完用户后记得为他添加相关的权限。创建完成后的accessKey和accessSecret信息需要即是保存。

![image-20210930200204944](%E4%BD%BF%E7%94%A8aliyun%E7%9A%84oss%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8.assets/image-20210930200204944.png)



##### java语言上传文件

[官方文档](https://help.aliyun.com/document_detail/32009.html) 

阿里云官网的文档对每个产品的使用都有比较详细的介绍。

###### 安装

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.10.2</version>
</dependency>
```

###### 简单流上传文件演示

```java
//可以在oss的概览里看到
String endpoint = "yourEndpoint";
// 阿里云账号AccessKey用户的Key和Secret值，在创建用户的时候会显示
String accessKeyId = "yourAccessKeyId";
String accessKeySecret = "yourAccessKeySecret";

// 创建OSSClient实例。
OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

//输入文件流
InputStream testFile = new FileInputStream("C:\\Users\\xiao-jie\\Pictures\\primary.gif");

// 创建PutObjectRequest对象。
// 依次填写Bucket名称（例如examplebucket）和Object完整路径（例如exampledir/exampleobject.txt）。Object完整路径中不能包含Bucket名称。
PutObjectRequest putObjectRequest = new PutObjectRequest("examplebucket", "exampledir/exampleobject.txt", 																testFile);

// 如果需要上传时设置存储类型和访问权限，请参考以下示例代码。
// ObjectMetadata metadata = new ObjectMetadata();
// metadata.setHeader(OSSHeaders.OSS_STORAGE_CLASS, StorageClass.Standard.toString());
// metadata.setObjectAcl(CannedAccessControlList.Private);
// putObjectRequest.setMetadata(metadata);

// 上传字符串。
ossClient.putObject(putObjectRequest);

// 关闭OSSClient。
ossClient.shutdown();                   
```

###### ossClient实例类也可以在yml文件里配置，在直接导入

##### 前后端分离场景下 安全高效的上传图片 

![img](%E4%BD%BF%E7%94%A8aliyun%E7%9A%84oss%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8.assets/p139016.png)

###### 服务器端controller层返回policy信息

```java
@RestController
public class ReturnOss {
    String accessId = ".....; // 请填写您的AccessKeyId。
    String accessKey = "....."; // 请填写您的AccessKeySecret。
    String endpoint = "......"; // 请填写您的 endpoint。
    String bucket = "feizzer-mfmall-product"; // 请填写您的 bucketname 
    
    //获取今天日期的string作为存储路径前缀
    String formatDir = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
	// 用户上传文件时指定的前缀。
	String host = "https://" + bucket + "." + endpoint; // host的格式为 bucketname.endpoint。
    @GetMapping(value = "oss/policy")
    public R returnOssClient() throws FileNotFoundException {
        // callbackUrl为上传回调服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
        //String callbackUrl = "http://88.88.88.88:8888";

        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessId, accessKey);
        Map<String, String> respMap = null;
        try {
            long expireTime = 30;
            long expireEndTime = System.currentTimeMillis() + expireTime * 1000;
            Date expiration = new Date(expireEndTime);
            // PostObject请求最大可支持的文件大小为5 GB，即CONTENT_LENGTH_RANGE为5*1024*1024*1024。
            PolicyConditions policyConds = new PolicyConditions();
            policyConds.addConditionItem(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, 1048576000);
            //policyConds.addConditionItem(MatchMode.StartWith, PolicyConditions.COND_KEY, dir);

            String postPolicy = ossClient.generatePostPolicy(expiration, policyConds);
            byte[] binaryData = postPolicy.getBytes("utf-8");
            String encodedPolicy = BinaryUtil.toBase64String(binaryData);
            String postSignature = ossClient.calculatePostSignature(postPolicy);

            respMap = new LinkedHashMap<String, String>();
            respMap.put("accessid", accessId);
            respMap.put("policy", encodedPolicy);
            respMap.put("signature", postSignature);
            respMap.put("dir", formatDir);
            respMap.put("host", host);
            respMap.put("expire", String.valueOf(expireEndTime / 1000));
            //respMap.put("expire", formatISO8601Date(expiration));

            JSONObject jasonCallback = new JSONObject();
            //jasonCallback.put("callbackUrl", callbackUrl);
            jasonCallback.put("callbackBody",
                    "filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}");
            jasonCallback.put("callbackBodyType", "application/x-www-form-urlencoded");
            String base64CallbackBody = BinaryUtil.toBase64String(jasonCallback.toString().getBytes());
            respMap.put("callback", base64CallbackBody);

//            JSONObject ja1 = JSONObject.fromObject(respMap);
//            // System.out.println(ja1.toString());
//            response.setHeader("Access-Control-Allow-Origin", "*");
//            response.setHeader("Access-Control-Allow-Methods", "GET, POST");
//            response(request, response, ja1.toString());

        } catch (Exception e) {
            // Assert.fail(e.getMessage());
            System.out.println(e.getMessage());
        } finally {
            ossClient.shutdown();
        }
        return R.ok().put("data", respMap);
    }

}

```

###### web前端获取policy信息并上传文件

使用了element-ui的 Upload组件。

1. 其中 `data="dataObj"`指定了发送请求时的数据，将从服务器得到的policy数据传给它
2.  \<el-upload\> 标签里的button 点击会自动的包含选择并上传文件的功能。
3. 将getPolicy()方法获得的 Policy数据赋值给dataObj

```html
<template> 
  <div>
    <el-upload action="https://feizzer-mfmall-product.oss-cn-hangzhou.aliyuncs.com" :data="dataObj"
              list-type="picture" :multiple="false" :show-file-list="showFileList" :file-list="fileList"
              :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess"
              :on-preview="handlePreview">
      <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
    import {getPolicy} from "@/utils/third-part/oss.js"
    data() {
      return {
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: '',
          // callback:'',
        },
      };
    },
    methods:{
	  beforeUpload(file) {  
        let _self = this;
        return new Promise((resolve, reject) => {
          	getPolicy().then(response => {
            console.log("响应的数据",response);
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessid;
            _self.dataObj.key = response.data.dir + '/' + getUUID()+'_${filename}';
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            console.log("响应的数据222。。。",_self.dataObj);
            resolve(true)
          }).catch(err => {
            reject(false)
          })
        })
      },
    }
	    
</script>
```

```js
import http from "../httpRequest"
function getPolicy() {
    return  new Promise((resolve,reject)=>{
        http({
            url: http.adornUrl("/third-part/oss/policy"),
            method: "get",
            params: http.adornParams({})
        }).then(({ data }) => {
            resolve(data);
        })
    });
}

export {
    getPolicy
}
```



