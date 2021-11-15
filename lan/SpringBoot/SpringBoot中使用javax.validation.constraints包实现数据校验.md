#### 引入javax.validation.constraints包

#### springboot引入

```xml
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <optional>true</optional>
</dependency>
```

#### 在实体类属性上加注解

其中注解中value的值是校验失败后需要返回的提示信息。

groups用来区分不同的controller方法传递entity参数时是否适用该校验规则，其值`ProductBrandSave.class`可以是任何空类（接口）不需要任何实现，仅用于区分。

```java
@Data
@TableName("tb_brand")
public class BrandEntity implements Serializable {
   private static final long serialVersionUID = 1L;
   /**
    * 品牌id
    */
   @TableId
   @Null(groups = {ProductBrandSave.class}, message = "id不能指定")
   @NotNull(groups = {ProductBrandUpdate.class},  message = "修改已有品牌信息，必须要指定品牌id")
   private Integer id;
   /**
    * 品牌名称
    */
   @NotBlank(message = "品牌名不能为空", groups = {ProductBrandSave.class})
   private String name;
   /**
    * 品牌图片地址
    */
   @URL(message = "图片地址必须是一个合法的路径", groups = {ProductBrandSave.class, ProductBrandUpdate.class})
   private String image;
   /**
    * 品牌的首字母
    */

   @Pattern(regexp = "^[a-zA-Z]$", message = "首字母必须是一个字母",
               groups = {ProductBrandUpdate.class, ProductBrandSave.class})
   private String letter;
   /**
    * 排序
    */
   @Min(value = 0, message = "排序字段只接收非负数",
               groups = {ProductBrandUpdate.class, ProductBrandSave.class})
   private Integer seq;

}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190415154441232.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Rhem91MQ==,size_16,color_FFFFFF,t_70#center_500) 

#### 在Controller层的传入的参数上加 `@Validated`注解

在@Validated()注解中也需要加入 `ProductBrandSave.class`参数，参数类型与Entity层的 groups指定的值一致则会进行数据格式的校验。如果校验不通过会抛出 MethodArgumentNotValidException  异常,可以在controller直接获取异常信息进行处理，也可以配置统一 的异常处理。

```java
@RestController
@RequestMapping("mfmallproduct/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;
    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("mfmallproduct:brand:save")
    public R save(@Validated({ProductBrandSave.class}) @RequestBody BrandEntity brand，/*BindException e*/) 	   {
        brandService.save(brand);
        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("mfmallproduct:brand:update")
    public R update(@Validated({ProductBrandUpdate.class}) @RequestBody BrandEntity brand){
      brandService.updateById(brand);
        return R.ok();
    }
}
```

#### 

#### 统一异常处理

@RestControllerAdvice() 指定需要扫面的包，*注意包路径用点分隔*。

@ExceptionHandler () 指定该方法捕获处的异常类型，越是精细的异常写在最上面。

```java
@Slf4j
@RestControllerAdvice(basePackages = "com.feizzer.mfmall.mfmallproduct.controller")
public class ControllerProductException {
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public R handleValidationException(MethodArgumentNotValidException e) {
        log.warn("提交数据不合法");
        BindingResult result = e.getBindingResult();
        Map<String,String> resMap = new HashMap<>();
        result.getFieldErrors().forEach(fieldError -> {
            String field = fieldError.getField();
            String fieldMessage = fieldError.getDefaultMessage();
            resMap.put(field, fieldMessage);
        });
        return R.error(ProductExceptionEnum.PARAMTERTYPE_EXCEPTION.getCode(),
                        ProductExceptionEnum.PARAMTERTYPE_EXCEPTION.getMsg())
                .put("data",resMap);
    }

}
```

##### 统一异常信息管理

将异常信息放在一个枚举类里面进行统一的管理

```java
public enum  ProductExceptionEnum {
    UNKNOW_EXCEPTION(10000, "未知的异常"),
    PARAMTERTYPE_EXCEPTION(10001, "提交参数发生校验异常");

    private int code;
    private String msg;

    ProductExceptionEnum(int code, String msg) {
        this.msg = msg;
        this.code = code;
    }
    public int getCode() {
        return code;
    }
    public String getMsg() {
        return msg;
    }
}
```