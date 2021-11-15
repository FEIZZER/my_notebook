 

# tensoefow框架整体学习

#### 资料

[电子书《简单粗暴 TensorFlow 2》](https://tf.wiki/zh_hans/basic/models.html) 

#### 需要了解各类python库
[[Numpy]]
[[Matplotlib]]
[[Pillow]]

#### 需要了解的一些数学概念



#### 第一个逻辑回归程序示例---mnist数据集

1. ##### 下载数据集
    具体见[[tfds的API]]

  ```python
  import tensorflow as tf
  (train_data, train_label), (test_data, test_label) = tf.keras.datasets.mnist.load_data()
  ```

2. ##### 构建模型

   具体见[[Tensorflow2.0]] [[tensorflow.keras 的API]]
   
   ```python
   model = tf.keras.models.Sequential()
   model.add(tf.keras.layers.Flatten(input_shape=(28, 28)))
   model.add(tf.keras.layers.Dense(128, activation="relu"))
   model.add(tf.keras.layers.Dense(10, activation="softmax"))
   model.compile(optimizer='adam',
                 loss='sparse_categorical_crossentropy',
                 metrics=['accuracy'])
   ```
   
3. ##### 训练验证模型

   ```python
   model.fit(train_data, train_label, epochs=5)
   model.evaluate(test_data,  test_label, verbose=2)
   ```
   
4. ##### 保存训练结果变量

   使用tensorflow内的Checkpoint模块[[Tensorflow2.0#用于训练结果的变量的模块Checkpoint]]

   ```python
   checkpoint = tf.train.Checkpoint(myModel=model)
   checkpoint.save("./save/myModel.ckpt")
   ```
   
   这样一个简单的手写字识别训练模型已经完成
   
5. ##### tensorBoard实现训练过程可视化

6. ##### tensorflow如何创建，处理保存数据集

   [[Tensorflow2.0#用于数据集处理的模块tf data Dataset]]

   







