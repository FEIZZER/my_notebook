## SpringBoot中使用kaptcha实现图片验证码

##### 配置步骤

1. ###### 加入依赖

   ```xml
   <dependency>
       <groupId>com.github.penggle</groupId>
       <artifactId>kaptcha</artifactId>
       <version>2.3.2</version>
   </dependency>
   ```

2. ###### 配置类，

   ```java
   @Configuration
   public class KpatchaConfig {
       @Bean
       public DefaultKaptcha defaultKaptcha(){
           DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
           //使用java.utils包的 Properties 封装属性。
           Properties properties = new Properties();
           //是否显示边框
           properties.setProperty(Constants.KAPTCHA_BORDER, "no");
           //设置高度
           properties.setProperty(Constants.KAPTCHA_IMAGE_WIDTH,"110");
           properties.setProperty(Constants.KAPTCHA_IMAGE_HEIGHT,"40");
           //设置字体大小
           properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_SIZE,"32");
           // 验证码随机字符库
           properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_CHAR_STRING,
                                   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYAZ");
           // 验证码图片默认是有线条干扰的，我们设置成没有干扰
           properties.setProperty(Constants.KAPTCHA_NOISE_IMPL,
                                   "com.google.code.kaptcha.impl.NoNoise");
           //使用com.google.code.kaptcha.util.Config这个配置类
           Config config = new Config(properties);
           defaultKaptcha.setConfig(config);
           return defaultKaptcha;
       }
   }
   ```

   kaptcha 配置的参数说明（定义在 Constants 常量类中）：

   - `kaptcha.border`：是否有图片边框，合法值：yes，no；默认值为 yes。
   - `kaptcha.border.color`：边框颜色，合法值：rgb 或者 white，black，blue；默认值为 black。
   - `kaptcha.border.thickness` 边框厚度，合法值：>0；默认为 1。
   - `kaptcha.image.width`：图片宽，默认值为 200px。
   - `kaptcha.image.height`：图片高，默认值为 50px。
   - `kaptcha.producer.impl`：图片实现类，默认值为`com.google.code.kaptcha.impl.DefaultKaptcha`。
   - `kaptcha.textproducer.impl`：文本实现类，默认值为`com.google.code.kaptcha.text.impl.DefaultTextCreator`。
   - `kaptcha.textproducer.char.string`：文本集合，验证码值从此集合中获取，默认值为 `abcde2345678gfynmnpwx`。
   - `kaptcha.textproducer.char.length`：验证码长度，默认值为 5。
   - `kaptcha.textproducer.font.names`：字体，默认值为 Arial, Courier。
   - `kaptcha.textproducer.font.size`：字体大小，默认值为 40px。
   - `kaptcha.textproducer.font.color`：字体颜色，合法值：rgb 或者 white，black，blue；默认值为black。
   - `kaptcha.textproducer.char.space`：文字间隔，默认值为 2px。
   - `kaptcha.noise.impl`：干扰实现类，`com.google.code.kaptcha.impl.NoNoise`为没有干扰。默认值为 `com.google.code.kaptcha.impl.DefaultNoise`。
   - `kaptcha.noise.color`：干扰线颜色，合法值：rgb 或者 white，black，blue；默认值为 black。
   - `kaptcha.obscurificator.impl`：图片样式，合法值：水纹 `com.google.code.kaptcha.impl.WaterRipple`，鱼眼 `com.google.code.kaptcha.impl.FishEyeGimpy`， 阴影 `com.google.code.kaptcha.impl.ShadowGimpy`；默认值为 `com.google.code.kaptcha.impl.WaterRipple`。
   - `kaptcha.background.impl`：背景实现类，默认值为`com.google.code.kaptcha.impl.DefaultBackground`。
   - `kaptcha.background.clear.from`：背景颜色渐变，开始颜色，默认值为`light grey`。
   - `kaptcha.background.clear.to`：背景颜色渐变， 结束颜色，默认值为 white。
   - `kaptcha.word.impl`：文字渲染器 实现类，默认值为 `com.google.code.kaptcha.text.impl.DefaultWordRenderer`。
   - `kaptcha.session.key`：session key，默认值为`KAPTCHA_SESSION_KEY`。
   - `kaptcha.session.date`：session date，默认值为`KAPTCHA_SESSION_DATE`。

3. ###### Controller层创建使用

   ```java
   @Autowired
   private DefaultKaptcha defaultKaptcha;
   @GetMapping(value = "imgCode")
   public void getImgeCode(HttpServletResponse response, HttpServletRequest request)
   throws IOException{
       // 创建验证码文本
       String capText = defaultKaptcha.createText();
       // 创建验证码图片
       BufferedImage image = defaultKaptcha.createImage(capText);
       // 将验证码文本放进 Session 中
       request.getSession().setAttribute(Constants.KAPTCHA_SESSION_KEY, code);
       // 将验证码图片返回，禁止验证码图片缓存
       response.setHeader("Cache-Control", "no-store");
       response.setHeader("Pragma", "no-cache");
       response.setDateHeader("Expires", 0);
       response.setContentType("image/jpeg");
       ImageIO.write(image, "jpg", response.getOutputStream());
   }
   @RequestMapping(value = "/loginRequest2")
       public String index2(String name, String password, String imageCode, HttpServletRequest request, Model model){
           //验证码检测
           //从 Session中把保存的 trueCode取出来
           Object object = request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY);
           String truecode = ((String) object).toLowerCase();
           if (!truecode.equals(imageCode.toLowerCase())){
               return "index";
           }
           //后续验证登录的方法
       }
   ```

4. ###### 网页表单

   ```html
   <form action="/loginRequest2">
       用户名 <input type="text" placeholder="用户名" name="name"><br>
       密码 <input    placeholder="密码" name="password" type="password"><br>
       验证码 <input placeholder="验证码" name="imageCode" type="text">
       <img th:onclick="this.src='/imgCode'" th:src="@{/imgCode}" alt=""><br>
       <button type="submit">提交</button>
   </form>
   ```

