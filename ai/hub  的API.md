# tensorflow_hub 的API

TensorFlow Hub 是一个库，用于发布、发现和使用机器学习模型中可重复利用的部分。模块是一个独立的 TensorFlow 图部分，其中包含权重和资源，可以在一个进程中供不同任务重复使用（称为迁移学习）。

##### hub.KerasLayer()

返回得到一个keras图层   [函数链接](https://tensorflow.google.cn/hub/api_docs/python/hub/KerasLayer?hl=zh_cn) 

```py
hub.KerasLayer(
    handle, trainable=False, arguments=None, _sentinel=None, tags=None,
    signature=None, signature_outputs_as_dict=None, output_key=None,
    output_shape=None, **kwargs)
```

暂不做分析