# 数字图像

> []: https://pillow-cn.readthedocs.io/zh_CN/latest/

色彩深度（位深度）来区分

二值图像（位深度为2）只有黑白两种颜色（或者说只有两种颜色）。

灰度图像（位深度为8，一个字节）可以表示0-255的不同亮度的颜色，0为黑色，255为亮度最大的某种颜色。

彩色图像（位深度为24）可以理解为有三种灰度图像组合（RGB） 

RGBA图像（位深度32）RGB图像+8位的透明度Alpha，Alpha=0时图像完全透明。

256色图像（位深度为8），每个像素是调色板的索引值，保存该种图片是需要将调色板一同保存。

### 其他色彩格式

CMYK-印刷四分色 C：青色          M：洋红色         Y: 黄色      K:   黑色

YCbCr   Y:亮度        Cb: 蓝色色度        Cr： 红色色度

HSI    H: 色调   S: 饱和度   I:亮度

## 图像格式

BBP格式：不支持文件压缩，空间大

JEGP 有损压缩 压缩率高 空间小 适用于颜色丰富，细节细腻的图像。如图像简单，颜色较少易出现色块。

PNG 无损压缩 适合有规律渐变色彩的图像

GIF 只支持颜色少图像小的图片

TIFF定义了四种不同的格式类型

二值图像（TIFF-B）  黑白灰度图像（TIFF-G）  RGB图像（TIFF-R)    调色板图像（TIFF-P）

## Pillow图像处理库

```
import PLT

from PLT import Image
```

img=Image.open("路径")  

img.save("路径")  更改后缀名可以转换格式

img.format 查看图像格式       img.size 查看图像尺寸       img.mode 色彩模式

plt.imshow（image对象/Numpy数组）

```
img=Image.open("things\ybyisaobi.jpg")//引入img
plt.figure(figsize=(5, 5))  //设置大小
plt.axis("off")  //不显示坐标轴
plt.imshow(img)//
plt.show()
```

### 转化图像的色彩模式

##### 转化图像色彩模式   img.convert("色彩模式")

| 取值  | 色彩模式                       |
| ----- | ------------------------------ |
| 1     | 二值图像（0表示黑，255表示白） |
| L     | 灰度图像                       |
| P     | 8位彩图                        |
| RGB   | 24位彩图                       |
| RBGA  | 32位彩图                       |
| CMYK  |                                |
| YCbCr |                                |
| I     | 32位整型灰度图像               |
| F     | 32位浮点灰度图像               |

##### img.spilt()   颜色通道的分离

```
img_r, img_g, img_b = img.split()
plt.subplot(2, 2, 1)
plt.axis("off")
plt.imshow(img_r)

plt.subplot(2, 2, 2)
plt.axis("off")
plt.imshow(img_g)

plt.subplot(2, 2, 3)
plt.axis("off")
plt.imshow(img_b, cmap="gray")//分离出来的图像在三个子图中显示
```

##### Image.merge()  图像通道合并

```
img_rgb = Image.merge("RGB", [img_r, img_g, img_b])
plt.imshow(img_rgb)
plt.show()
```

##### plt.xticks(loc[], label[],**kwargs)/plt.yticks()

使x轴显示我们想要的东西

label[]我们想要x轴的标签

loc[]数组表示label[]内标签的显示位置

```
x = range(0,3,1)
y = ["A", "B", "c"]
plt.xticks(x,y)
```

![d293aefa-b23b-11ec-8dca-4889e7a5c18d](https://s2.loli.net/2022/04/02/viVlx3F7LwecRkz.png)





## 图像转化为数组

##### np.array(imag对象)  //将imag中每个像素点转换为数组形式

```
arr_img = np.array(img)
print(arr_img.shape)
print(arr_img)
```

##### img.resize(尺寸)  重塑img的尺寸

##### img.tranpose(旋转方式)

| 旋转方式的值          | 效果               |
| --------------------- | ------------------ |
| Image.FLIP_LEFT_RIGHT | 水平翻转           |
| Image.FLIP_TOP_BOTTOM | 上下翻转           |
| Image.ROTATE_90       | 逆时针90°          |
| Image.TRANSPOSE       | 图像转置           |
| Image.TRANSVERSE      | 图像转置再水平翻转 |

##### img.crop((x0,y0,x1,y1))  

裁剪  x0 y0为裁剪矩形的左下角    x1 y1为右上角

























