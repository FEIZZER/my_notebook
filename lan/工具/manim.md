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



### manim中的颜色

##### 表示

manim中颜色可以用rgb表示`np.array([102, 140, 255])` 或十六进制hex表示 `'#66ccff'` 。并且在 constants.py中定义了54中颜色可以使用。

##### 颜色表示形式之间的转换

hex形式在python中时字符串;   rgb则是np.array([x, y, z]), xyz在 0~1之间； rgb也是np.array(), 范围是 0~255.

在 manimlib/utils/color.py 中定义一些颜色表示形式之间转换的函数：

- `hex_to_rgb('#66ccff')` 返回 np.array([0.4, 0.8, 1.0])
- `rgb_to_hex( np.array([0.4, 0.8, 1.0]))` 返回 '#66ccff'
- `rgb_to_color( np.array([0.4, 0.8, 1.0]))` 返回一个Color类的对象 \<Color #6cf\>
- `color_to_rgb(color)` 返回   np.array([0.4, 0.8, 1.0])

###### 处理颜色信息的函数

- `invert_color(color)` 取反色；参数可以是hex格式或Color对象， 返回一个Color对象
- `interpolate(color1, color2, alpha)`将两钟颜色按比例混合， 参数hex/Color对象， 返回Color对象
- `average_color(*color)` 混合传入的颜色 参数hex/Color对象， 返回Color对象
- `random_color()` 返回随机一个constants.py中定义的颜色。返回Color对象
- `color_gradient([*color], q)` 返回一个取色列表。

##### VMobject及其子类修改颜色样式

VMobject与其子类有关颜色的style： stroke， fill， background_stroke  :

- vmobject.set_color(color)  改变 fill和stroke的颜色 不改opacity
- vmobject.set_stroke(width=, color=, opacity=) 改变线的 宽度 颜色 透明度 
- vmobject.set_fill(color=, opacity=) 修改填充色的颜色与透明度

##### VGroup的上色处理

- vg.set_color(color)  全员上色

- vg.set_colors_by_gradient(*color) 给vg的图从首到尾分配颜色。 参数只接受hex/Color对象

  ```python
  group = VGroup()
  for i in range(5):
      for j in range(5):
          square = Square(side_length=1, fill_opacity=1)
          square.set_color(BLUE)
          square.move_to(DOWN*i+RIGHT*j)
          group.add(square)
  group.set_color_by_gradient(BLUE, GREEN, RED, BLACK)
  self.add(group)
  ```

  <img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202203011155141.png" alt="image-20220301115548987" style="zoom:50%;" />

##### 光泽与渐变色

我的manim版本似乎没有 sheen属性。暂不记录。 



### 坐标轴系统

#### NumberLine构建一个数轴

```python
axis = NumberLine(
    x_min=-10, x_max=10, 			# 数轴最小值与最大值
    x_step=1,						# 表示数轴添加刻度的频率
    include_tick=True,				# 是否显示刻度
    include_tip=True,				# 石佛显示箭头
    include_numbers=True,			# 是否显示数字
    line_to_number_direction=UP, 	# 显示数字的位置
    unit_size=1.0					# 表示数轴上一个单位代表manim中几个单位
)
```

注意当 `x_step=0.5`时， 会显示许多代表float的刻度，而数轴上数字显示只能为整数。所以这时`include_numbers最好赋值False` 。然后使用 `axis.add_numbers(1,2,3)`手动添加要显示的数字.

###### 常用函数

- `n2p()`  是number_to_point的简写，参数是一个数字，返回该点在数轴上的坐标

  ```python
  print(axis.n2p(1.5)) 	# [1.5, 0.0, 0.0]
  ```

- `p2n()` 传入一个坐标 返回该坐标在数轴上的位置  ==有问题==

###### 下面是 NumberLine()构造函数使用的一些 config

```python
CONFIG = {
    "color": GREY_B,
    "stroke_width": 2,
    # List of 2 or 3 elements, x_min, x_max, step_size
    "x_range": [-8, 8, 1],
    # How big is one one unit of this number line in terms of absolute spacial distance
    "unit_size": 1,
    "width": None,
    "include_ticks": True,
    "tick_size": 0.1,
    "longer_tick_multiple": 1.5,
    "tick_offset": 0,
    # Change name
    "numbers_with_elongated_ticks": [],
    "include_numbers": False,
    "line_to_number_direction": DOWN,
    "line_to_number_buff": MED_SMALL_BUFF,
    "include_tip": False,
    "tip_config": {
        "width": 0.25,
        "length": 0.25,
    },
    "decimal_number_config": {
        "num_decimal_places": 0,
        "font_size": 36,
    },
    "numbers_to_exclude": None
}
```

#### Axes构建坐标系

```python
axes = Axes(x_range=[-1, 10], y_range=[-1, 2],    	# 表示x轴和y轴范围 
            axis_config={							# 两个轴共同的属性
                'include_numbers': True,
                'include_tick': True,
                'unit_size': 1.0,
            },
            y_axis_config={							# x或y轴独自不一样的属性
                "line_to_number_direction": DOWN,
            },
            x_axis_config={
            })
self.add(axes)
```

<img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202203011725727.png" alt="image-20220301172544603" style="zoom:50%;" />

如果不想显示所有的刻度数字 可以设置属性 `include_numbers: False`. 然后使用函数传入两个数组`axes.add_coordinate_labels([1,2,3,4], [1,2])`，如果参数为空，还是会显示所有数字。

注意：==当建的系上下左右不对称， manim中坐标原点与自己建的系的原点是偏离的== 

###### 常用函数

#### NumberPlane构建坐标系网格

在暂时不做了解

#### ParametricCurve 绘制函数图像

```python
pcurve = ParametricCurve(
    lambda t: np.array([np.sin(3*t)*np.cos(t),	
                        # 传入一个参数房产， 可以是lambda表达
                        np.sin(t*3)*np.sin(t), 0]),     # 式，或def定义函数。
    t_range=[0, 2*PI]    								# 表示参数方程中参数范围
)
```

<img src="https://gitee.com/feizzer/feizzer_gallery/raw/master/img/202203011842384.png" alt="image-20220301184217274" style="zoom: 67%;" />

##### 子类 FunctionGraph



