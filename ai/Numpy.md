# numpy

numpy的底层运算是由c来实现的，处理速度快效率高.

## 创建数组

array（[]，dtype）函数，要求内部数据类型一致 dtype确定数据类型

```
a=np.array([1,2,3],[1,3,2])
//创建了一个二位数组
print(a.shape)
>>(2,3)
print(a.dtype)
>>int64
```

### 创建特殊的数组

#### np.arange(起始数字，结束数字，步长=1，dtype)  创建数字序列数组

#### np.ones(shape,dtype)  创建一个全为1的数组

```
b = np.ones((2,3))  //创建了一个shape为（2，3）的数组
>>[[1,1,1],[1,1,1]]
```

#### np.zeros()  创建一个全为0的数组

#### np.eye(shape)  创建一个单位矩阵

```
c = np.eye(3)
>>([[1,0,0],
    [0,1,0],
    [0,0,1]])
d = np.eye(2,3)
>>([[1,0,0],
    [0,1,0]])
```

#### np.linspace(起始数字，结束数字，元素个数)  创建一个等差数列

#### np.logspace(起始指数，结束指数，元素个数，步长)  创建一个等比数列

```
e = np.linspace(1,5,5)
>>[1,2,3,4,5]
f = np.logspace(1,5,5,2)
>>[2,4,8,16,32]
```

#### 注意asaray与array的区别

## 数组的运算

#### reshape（shape） 和  resize(shape)

```
a = np.r=arange(12)
b = a.reshape(3,4)  //b的形状为[3,4],a仍然为一维数组
c = a.resize(4,3)  //a的形状也被改变
//reshape(-1,2)  -1为待定参数，计算机自己计算
```

#### 两数组形状相同时可以进行基本运算

#### a为一维数组，b为多维数组。满足a可以拓展成b的形状，也可运算

```
a = np.array([[1, 2, 3], [1, 3, 2]], dtype=np.int64)
b = np.array([1, 2, 1])
print(a*b)
>>[[1 4 3]
  [1 6 2]]
```

###  矩阵运算

#### a*b为上述基本运算法则

#### np.matmul(a,b) 实现a,b矩阵的矩阵运算

```
c = np.array([[2, 2], [1, 2]])
d = np.array([[1, 1], [1, 1]])
print(d*c)
>>[[2 2]
  [1 2]]
print(np.matmul(d, c))
>>[[3 4]
  [3 4]]
```

#### np.transpose（A） 对A矩阵进行转置运算

#### np.linalg.inv(B)  对矩阵B进行求逆运算

### 数组元素之间的运算

#### np.sum(a)  对数组a中所有元素求和

多维数组的每一维视为一轴，axis为轴的编号，rank为秩是轴的个数

np.sum(a,axis)可以指定求相应轴的和

```
a = np.arange(24).reshape(2, 3, 4)
print(a)
>>[[[ 0  1  2  3]
  [ 4  5  6  7]
  [ 8  9 10 11]]

 [[12 13 14 15]
  [16 17 18 19]
  [20 21 22 23]]]
print(np.sum(a))
>>276
print(np.sum(a, axis=0))
>>[[12 14 16 18]
 [20 22 24 26]
 [28 30 32 34]]
print(np.sum(a, axis=1))
>>[[12 15 18 21]
 [48 51 54 57]]
print(np.sum(a, axis=2))
>>[[ 6 22 38]
 [54 70 86]]
```

可以推广到更高维

#### np.prod(a,axis)求所有元素的积

#### np.diff()  求相邻元素直接的差

#### np.sqrt()  计算个元素的平方根

#### np.exp()  计算各元素的指数值

#### np.abs()  计算个元素的绝对值

#### np.stack((数组1，数组2，....), axis)

这里的axis指定堆叠后新产生的轴是哪个。

```
a = np.arange(3)
b = np.array([2, 3, 4])
print(a.shape, b.shape)
>>(3,) (3,)
print(np.stack((a, b), axis=0))
>>[[0 1 2]       //shape(2, 3)
 [2 3 4]]        //(2,3) axis=0处shape值堆叠为2
print(np.stack((a, b), axis=1))
>>[[0 2]
 [1 3]           //shape(3, 2)
 [2 4]]          //axis=1处  shape值堆叠为2
```

可推广到高维  

#### np.matrix()是一个矩阵类型

```
n = np.mat([[2, 3], [3, 4]])
m = np.mat([[0, 1], [1, 3]])
print(n*m)        //矩阵类型相乘直接是矩阵乘法
n.T  //矩阵转置
m.I  //矩阵求逆
```

## numpy.random  随机数模块

#### np.random.rand(shape)  产生[0,1)区间的均匀分布数组，浮点数

#### np.random.uniform(low,high,size)  产生[low,high）均匀分布数组，浮点数

#### np.random.randint(low,high,size)   同上，整型

#### np.random.normal(均值，方差，shape)  产生正态分布随机数

#### np.random.randn(shape)  产生标准正态分布，浮点数

### np.random.seed（n）可以设置随机种子，仅一次有效，随机种子一样则产生的随机数一样。

#### np.random.shufffle(arry) 随机打乱数组，对于多维数组他只会打乱第一维

















































































