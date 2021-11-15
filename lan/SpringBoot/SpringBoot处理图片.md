

# SpringBoot在网页读取显示图片记录

#### 第一次实现

jpa + MultipartFile类存照片 + ImageIO类 + form表单提交。可以保存和显示正常的GIF动态。

```java
//对图片进行存取处理的 Service类，可以看到数据库里存放的是byte[]字节数组
public class ImageService {
    @Autowired
    ImageDao imageDao;
    public void saveImage(byte[] bytes){
        Image image = new Image();
        image.setImgBytes(bytes);
        imageDao.save(image);
    }
    public byte[] getImage(String id){
        Image image = imageDao.findById(Long.parseLong(id)).orElse(null);
        if (image == null){
            return null;
        }
        return image.getImgBytes();
    }
}
```

```java
//Controller里的处理
@GetMapping(value = "/getImage")
@ResponseBody
public void getImage(HttpServletResponse response){
    byte[] image = imageService.getImage("3");
    try{
        OutputStream out =response.getOutputStream();
        out.write(image);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
@PostMapping(value = "/addImage")
public String addImage(HttpServletRequest request, @RequestParam("imageFile") MultipartFile file){
    System.out.println(file);
    try{
        byte[] imagebytes = file.getBytes();
        imageService.saveImage(imagebytes);
    } catch (IOException e) {
        e.printStackTrace();
    }
    return "redirect:/login";
}
```

```html
<form action="/addImage" method="post" enctype="multipart/form-data">
    <input type="file" name="imageFile">
    <button type="submit">上传</button>
    <img src="/getImage" alt="" style="height: 200px; width: 200px">
</form>
```

###### 记录出现的错误

- 由于想要存入数据库的数据长度超过了该字段类型可接受的最大长度

  ![image-20210731190918687](SpringBoot%E5%A4%84%E7%90%86%E5%9B%BE%E7%89%87.assets/image-20210731190918687.png) 

- 由于在Contrller里接收图片时用了 `MultipartFile` 类form表单需要加上 `enctype="multipart/form-data"`属性。[[jquery#POST提交数据时，常见的contentType类型]]

  ![image-20210731191757037](SpringBoot%E5%A4%84%E7%90%86%E5%9B%BE%E7%89%87.assets/image-20210731191757037.png) 
  
- 由于SpringBoot中单次上传下载文件的限制是 1MB，当上传的图片超过时会抛出如下异常

  ![image-20210731193601197](SpringBoot%E5%A4%84%E7%90%86%E5%9B%BE%E7%89%87.assets/image-20210731193601197.png) 

  解决：在application.yml中添加 如下配置。

  ```yml
  spring:
    servlet:
      multipart:
        max-file-size: 3MB
        max-request-size: 3MB
  ```

  

