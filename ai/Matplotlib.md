 # Matplotlib

## figure对象

```python
figure(num,figsize=( ，),dpi,facecolor,edgecolor,frameon)
```

num表示图像编号，一般为整形数字或字符串

figsize表示图像的宽高，单位为英寸

dpi 分辨率，缺省值为80

facecolor背景颜色   edgecolor边框颜色  frameon是否显示边框

```python
plt.figure(1,figsize=(2,3),facecolor="green")  //创建图像
plt.plot();  //绘制空图像
plt.show();  //展示图像
```

## subplot（）对创建的空画布划分子图

```
fig = plt.figure(facecolor="green")
plt.subplot(2, 2, 1)
plt .subplot(2, 2, 2)
plt.subplot(2, 2, 3)  //可缺省为plt.subplot(223)
plt.show()
//共创建了三个空子图
```

## 添加标题

设置合适的中文字体

```
plt.rcParams["font.sans_serif"] = "SimHei"   //设置中文字体
//  rcParams可以改变plt的很多全局设置
plt.rcdefaults()   //恢复设置
```

添加标题的suptitle全局标题，title小标题

```
fig = plt.figure(facecolor="green")
plt.suptitle("全局标题")
plt.subplot(2, 2, 1)
plt.title("子标题1")
plt .subplot(2, 2, 2)
plt.title("子标题2")
plt.subplot(2, 2, 3)
plt.title("子标题3")
```

title的其他属性不做记录。

## 散点图scatter（）

scatter(x,y,s,color,marker,label)

x,y  点的横纵坐标

s 数据点的大小，默认为36

marker 点的样式，他是一个字符，默认为‘o'，表示一个新小圆点

label  图列文字  配合plt.legend()显示图例

```
x = np.random.normal(0, 1, 1000)
y = np.random.normal(0, 1, 1000)
plt.scatter(x, y, color="blue"，label="图例显示")
plt.xlim(-4, 4)
plt.ylim(-4, 4)  //设置x，y轴的范围
plt.xlabel("x轴", fontsize=14)  //x轴的名称
plt.rcParams["axes.unicode_minus"]=false;  //解决默认字体为中文时，符号可能无法正常显示。
```

## 折线图plot（） 柱状图bar（）

plot（x,y,color,marker,label,linewidth,markersize）

x 默认值为1，2，3，4.。。。。

y 不可省

color 数据点的颜色

marker  数据点的样式，默认值为o

label 图例文字

linewidth 折线宽度

markersize 数据点的大小

```
x2 = np.random.randint(27, 37, 24)
y2 = np.random.randint(40, 60, 24)
plt.plot(x2, label="y1显示图例")
plt.plot(y2, label="y2显示图例")
plt.legend()
```

柱状图省略



