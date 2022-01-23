##### swiper和swiper-item实现轮播图效果

swiper和swiper-item是视图容器标签

[文档直链](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html) 

###### 重要属性

-  `indicator-dots`传入boolen值，默认为false.是否显示面板指示点。

```html
<swiper indicator-dots="true" style="border: 1px solid red; height: 100px;">
    <swiper-item style="height: 100%;">
        <view style="line-height:100px ;text-align: center;">1</view>
    </swiper-item>
    <swiper-item style="height: 100%;">
        <view style="line-height: 100px; text-align: center;">2</view>
    </swiper-item>
    <swiper-item style="height: 100%;">
        <view style="line-height: 100px; text-align: center;">3</view>
    </swiper-item>
</swiper>
```

![image-20220123213227979](https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202201232132054.png)