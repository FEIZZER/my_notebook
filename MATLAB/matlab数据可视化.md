# 数据可视化

##### 基本绘图

1. ```
   >>plot(x)
   //x是向量时，以元素索引为横坐标，元素为纵坐标 绘图
   //x时矩阵时，每一列视为一个向量，每一列都绘制一段线性图
   ```

2. ```
   >>x=(0: 1/pi :pi*2)
   >>y=sin(x)
   >>y1=cos(x)
   >>plot(x,y)
   //x为横坐标，y为纵坐标 绘制sin函数图
   >>plot(x,y,x,y1)
   // 绘制多个线性图像
   ```

##### 绘图修饰

1. xlabel('  ')和title('  ')

   ```
   >>plot(x,y)
   >>xlabel('x是向量元素的索引')
   >>ylabel('y是。。。')
   //用于添加对xy轴的介绍
   >>title('name of this plot')
   //添加图的标题
   ```

2. legend()

   ```
   >>plot(x,y,x,y1)
   >>legend('y','y1')
   //添加各条线的标签
   ```

3. 设置线条的颜色形式

   ```
   plot(x,y,'color_style_marker')
   ```

   'color_style_marker' 可以放入三个字符 如下图所示

   <img src="https://s2.loli.net/2022/04/02/LSA9JpT6KqiUl2N.png" alt="在这里插入图片描述" width="1200" />

##### 窗口管理

1. ```
   >>plot(x,y)
   >>hold on
   >>plot(x,y1)
   >>hold off
   ```

   多个plot时，第二个plot会将上一个留下的图像清空在绘制

   使用hold on可以使两个图像一同出现

2. ```
   >>figure
   //新建窗口
   >>figure(n)
   //设定n号窗口为当前工作窗口
   ```

3. ```
   >>clf reset
   //清空窗口
   ```

4. 一个窗口显示多个子图 sulplot()

   参考[[Matplotlib#subplot（）对创建的空画布划分子图]]
   

##### 轴管理

不做记录