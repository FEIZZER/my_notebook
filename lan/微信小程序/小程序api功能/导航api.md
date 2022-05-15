### 小程序中页面导航有两种方式

#### 声明式导航

[navigator文档](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)

在页面上定义一个\<navigator\>导航组件， 通过点击\<navigator\>组件来实现导航，属性：

- target 只有两个合法值：self和miniProgramme. 默认值为self， miniProgramme表示跳转到另一个小程序。
- url 表示页面地址， 以 `/pages/...`开头
- open-type  
  - navigator  默认值，跳转到没有配置到tabBar中的页面
  - switchTab 跳转到配置到的tabBar中的值。

#### 编程式导航

通过调用小程序的导航api，实现页面的跳转。



