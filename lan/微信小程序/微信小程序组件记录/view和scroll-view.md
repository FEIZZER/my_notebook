##### view标签

view标签是小程序中的视图容器，类似于html中的 div标签。且==可以使用flex布局的一些css属性， 如过不使用就是普通的块级容器类似于 div== 

```html
<view class="container" style="flex-direction: row;">
    <view>1</view><view>2</view><view>3</view><view>4</view>
</view>
```

![image-20220123210643198](https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202201232106376.png) 横向布局的div效果了



##### scroll-view标签

[微信文档直链](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html) 

可以滚动的视图区域， 可以使用`scroll-x="true"`或`scroll-y="true"`属性指定是否允许横向或是竖向滚动。

需要注意的是： *由于使得该元素产生滚动条效果，必须要实现子元素宽度或高度大于scroll-view元素的宽高，所以scroll-view元素一般手动设置宽高，一般为手机对应显示区域的宽高*。



