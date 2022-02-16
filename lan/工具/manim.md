### 常见集合类

#### Line和Arrow类

##### Line是直线类

```python
class TestLine(Scene):
    def construct(self):
        # 默认的Line() 返回的是一个从 (-1，0，0)到(1, 0, 0)的直线
        line1 = Line()
        line2 = Line(np.array([-2, 1, 0]), np.array([1, 1, 0]), buff=0.5, stroke_width=2)
        self.add(line1)
        self.add(line2)
```

可以传入的几个重要的参数

- 两个`np.array([x, y, z])` , 表示直线两端
- buff=   ，表示直线到两端的距离。
- stroke_width=  , 表表示线宽
- path_arc=   , 将直线变成弧线（未测试）

##### DashedLine表示虚线

##### Arrow表示箭头类

```python
arrow1 = Arrow()
arrow2 = Arrow(np.array([-2, 1, 0]), np.array([1, 1, 0]))
self.add(arrow1)
self.add(arrow2)
```

Line的参数在Arrow中一样使用， 一些特有的参数使用：

- tip_length=  , 可以改变箭头的大小
- max_tip_length_to_length_ratio= ， 暂时没有测试过
- max_stroke_width_to_length_ratio=  ,

line对象调用 add_tip()函数也可以给自己增加一个箭头 ==line.add_tip()== 



### Arc圆弧类

#### arc类 用来绘制圆弧

```python
arc1 = Arc()
# 默认缺省情况下， 圆心为原点， 半径为1， 。。。。。
arc2 = Arc(arc_center=np.array([2, 0, 0]), radius=5,
           start_angle=90*DEGREES, angle=90*DEGREES, color=GREEN, stroke_width=2)
```

<img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202202152209753.png" alt="image-20220215220918565" style="zoom:33%;" />

- arc_center=  ,圆心
- raduis=   ，半径
- start_angle=    ,圆弧开始时的度数
- angle=   ,圆弧圆心角的度数
- color=    ,颜色
- stroke_width=  线宽

##### AnnularSector 环形 继承自Arc类

用来绘制一个唤环形区域，下面是他的一些参数：

```python
CONFIG = {
    "inner_radius": 1,
    "outer_radius": 2,
    "angle": TAU / 4,
    "start_angle": 0,
    "fill_opacity": 1,
    "stroke_width": 0,
    "color": WHITE,
}
```

<img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202202161610715.png" alt="image-20220216161050559" style="zoom:50%;" />

###### Sector  用来绘制一个扇形 继承自AnnularSector

其实就是AnnularSector类中参数 `inner_radius=0`的情况， 不多赘述.

#####  ArcBetweenPoint(np.array([]), np.array([]), angle)

这个子类可以通过两个端点和一个圆心角来定义绘制一段弧线

##### Circle类 用来绘制圆形

一些重要的参数

- strole_color=   ,线条颜色
- fill_color=   ，内部填充颜色
- fill_opacity=  ,内部填充色的透明度

##### Dot类  继承自Circle类用来绘制 点

```python
dot  = Dot(arc_center=ORIGIN, radius=0.08, stroke_width=0, fill_color=WHITE, fill_opacity=1)
# 以上参数都是默认值
```

##### Ellipse类 继承自Circle类 用来绘制椭圆

参数与Circle基本一致， radius参数改成： 

- width=  ，宽
- height=， 高 

##### Annulus类 继承自Circle  用来绘制圆环

他的一些参数信息。

```python
CONFIG = {
    "inner_radius": 1,
    "outer_radius": 2,
    "fill_opacity": 1,
    "stroke_width": 0,
    "color": WHITE,
    "mark_paths_closed": False,
}
```



### 多边形类 Polygen

通过传入点信息来确定多边形位置

```python
polygen2 = Polygon(np.array([-1, 0, 0]), np.array([1, 0, 0]), np.array([0, 1, 0]))
```

<img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202202161634884.png" alt="image-20220216163429810" style="zoom:50%;" />



此外它还支持使用`set_fill(color, opacity) `和`set_strole(color, width)`两个函数设置样式

也可以通过`round_corners(radius)`函数获得圆角效果

#### Rectangle类 是Polygen的子类

```python
rect = Rectangle(width=3, height=4, sheen_factor=0.8, sheen_direction=UR, fill_color=BLUE, fill_opacity=1)
```

其中的参数`sheen_factor`用来指定渐程度，`sheen_direction`指定渐变方向。*但是似乎有问题不可用*

==好像不能直接指定生成位置== 

##### Square正方形类 是RectAngle的子类

```python
square = Square(side_length = 2)
```

这是调用 `square.set_height()或是set_width()`都不会改变他是一个正方形。要把它变会长方形 ，需要`set_width(2, stretch=True)` 

### VGroup类

其数据结构与python中的list类似，可以使用 `add()`方法将 **所有VMobject类型及其子类型添加进去** ，还有 `add_to_back()`和`remove()`方法。便于进行统一处理操作

