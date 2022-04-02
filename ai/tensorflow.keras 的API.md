# keras API 记录

keras有两个重要概念，model模型和layer层。层将各种计算流程和变量进行封装，模型则将层进行组织连接，封装成一个整体。

## keras.layers

layers包括有常用层（Core）、卷积层（Convolutional）、池化层（Pooling）、局部连接层、递归层（Recurrent）、嵌入层

（ Embedding）、高级激活层、规范层、噪声层、包装层，当然也可以编写自己的层。

[各个layers的可视化](https://www.cs.ryerson.ca/~aharley/vis/conv/) 

###  各种对于层的操作

### keras.Input()/ keras.layers.Input()

```
model = keras.Sequential()
model.add(keras.Input(shape=()))
```

实际情况下该层和第一个层放到一起

```
# 例如第一层是Dense()层
model.add(keras.layers.Dense(128,activation=, input_shape=()))
```

### keras.layers.Dense()层
```
tf.keras.layers.Dense(
    units, activation=None, use_bias=True, kernel_initializer='glorot_uniform',
    bias_initializer='zeros', kernel_regularizer=None, bias_regularizer=None,
    activity_regularizer=None, kernel_constraint=None, bias_constraint=None,
    **kwargs
)
```

dense()层的实现运算为  $ouput=activation(dot(input,kernel)+bias)$ 

| 参数                   |                                                              |
| ---------------------- | ------------------------------------------------------------ |
| `units`                | 正整数，输出空间的维度。                                     |
| `activation`           | 激活功能的使用。如果没有指定任何东西，没有激活应用（即“线性”激活： `a(x) = x` ）。 |
| `use_bias`             | 布尔值，是否层使用的偏置矢量。                               |
| `kernel_initializer`   | 初始化为`kernel`权重矩阵。                                   |
| `bias_initializer`     | 初始化为偏移矢量。                                           |
| `kernel_regularizer`   | 正则化功能应用到`kernel`权重矩阵。                           |
| `bias_regularizer`     | 正则函数施加到偏置向量。                                     |
| `activity_regularizer` | 正则函数施加到所述层（它的“活化”）的输出。                   |
| `kernel_constraint`    | 约束功能应用到`kernel`权重矩阵。                             |
| `bias_constraint`      | 约束函数施加到偏置向量。                                     |

#### Dense()层中的激活函数activation  [链接](https://ke ras.io/api/layers/activations/#usage-of-activations)

激活函数实际是对输出的变换，却省使则不变换

###### relu

<img src="https://s2.loli.net/2022/04/02/8aTmXnGb3zOIJhD.png" alt="image" style="zoom:50%;" />.

 总体就是执行max(0,x)函数 可设置alpha斜率，max_value最大值等参数

###### sigmoid

<img src="https://s2.loli.net/2022/04/02/pH3AruvNzomjB9a.png" width="250"/> 执行函数$y=\frac{1}{1+e^x}$ .

######  softmax

Softmax 将真实向量转换为分类概率的矢量。通常作为最后一层因为它的输出可以看作是概率分布

###### softsign

###### softplus

###### tanh

###### selu

###### elu

###### exponential


### keras.layers.Flatten()

```
tf.keras.layers.Flatten(  data_format=None, **kwargs)
```

把多维输入一维化

### keras.layers.dropout()

### keras.layers.Conv2D()

实现对图像卷积的操作，优先理解卷积的含义和实现方法。

```python
tf.keras.layers.Conv2D(
    filters, kernel_size, strides=(1, 1), padding='valid', data_format=None,
    dilation_rate=(1, 1), activation=None, use_bias=True,
    kernel_initializer='glorot_uniform', bias_initializer='zeros',
    kernel_regularizer=None, bias_regularizer=None, activity_regularizer=None,
    kernel_constraint=None, bias_constraint=None, **kwargs
)
```

| 参数        |                                                              |
| :---------- | ------------------------------------------------------------ |
| filter      | 含义是过滤器个数，或者叫卷积核个数，这个与卷积后的输出通道数一样 |
| kernel_size | 卷积尺寸，用两个两个整数对表示。（n,n)也可以审略为一个n      |
| strides     | 表示步长，卷积核在图像中移动的步长                           |
| padding     | 有两个值valid表示边缘不填充，same表示边缘用0填充，会影响最后输出的形状。 |
| data_format | 有两个值，channels_last(缺省)表输入数据的通道数在最后，channels_first表通道数在元素数之前。 |
|             |                                                              |
|             |                                                              |

### tf.keras.layers.MaxPooling2D()

池化层，为了省去一部分信息，提高效率减少计算量。MaxPooling2D()函数是最大值池化，跟能保留卷积层获得的特征，一般会使用这个，还有平均数池化等等。