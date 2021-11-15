# tensorflow_datasets  API

##### 数据集下载tfds.load()

```py
tfds.load(
    name, split=None, data_dir=None, batch_size=None, shuffle_files=False,
    download=True, as_supervised=False, decoders=None, read_config=None,
    with_info=False, builder_kwargs=None, download_and_prepare_kwargs=None,
    as_dataset_kwargs=None, try_gcs=False
)
```

|                               |                                                              |
| ----------------------------- | ------------------------------------------------------------ |
| `name`                        | `str` ， `DatasetBuilder`的注册名称（类名的蛇形版本）。对于带有`BuilderConfig`的数据集，可以为`"dataset_name"`或`"dataset_name/config_name"` 。为方便起见，此字符串可能包含用于构建器的逗号分隔的关键字参数。例如， `"foo_bar/a=True,b=3"`将使用`FooBar`数据集传递关键字参数`a=True`和`b=3` （对于具有配置的构建器，它将是`"foo_bar/zoo/a=True,b=3"`使用`"zoo"`的配置，并传递给构建器关键字参数`a=True`和`b=3` ）。 |
| `split`                       | 要加载的数据拆分方式  [[]]                                   |
| `data_dir`                    | `str` ，用于读取/写入数据的目录。如果设置，则默认为环境变量TFDS_DATA_DIR的值，否则返回“〜/ tensorflow_datasets”。 |
| `batch_size`                  | `int` （如果已设置），则将批次尺寸添加到示例中。请注意，可变长度功能将填充0。如果`batch_size=-1` ，将以`tf.Tensor`的形式返回完整的数据集。 |
| `shuffle_files`               | `bool` ，是否随机播放输入文件。默认为`False` 。              |
| `download`                    | `bool` （可选），是否在调用[`tfds.core.DatasetBuilder.download_and_prepare`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetBuilder#download_and_prepare)之前先调用`tf.DatasetBuilder.as_dataset` 。如果为`False` ，则数据应位于`data_dir` 。如果为`True`且数据已经在`data_dir` ，则`download_and_prepare`为空。 |
| `as_supervised`               | `bool` ，如果为`True` ，则根据`builder.info.supervised_keys` ，返回的[`tf.data.Dataset`](https://tensorflow.google.cn/api_docs/python/tf/data/Dataset)将具有2元组结构`(input, label)` 。                                                            如果为`False` （默认值），则返回的[`tf.data.Dataset`](https://tensorflow.google.cn/api_docs/python/tf/data/Dataset)将具有包含所有功能的字典。 |
| `decoders`                    | 可以自定义解码的`Decoder`对象的嵌套字典。该结构应与要素结构匹配，但是仅需要显示自定义的要素密钥。有关更多信息，请参见[指南](https://github.com/tensorflow/datasets/tree/master/docs/decode.md) 。 |
| `read_config`                 | [`tfds.ReadConfig`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/ReadConfig) ，用于配置输入管道的其他选项（例如，种子，并行读取数，...）。 |
| `with_info`                   | `bool` ，如果为True，则tfds.load将返回包含与构建器关联的信息的元组（tf.data.Dataset，tfds.core.DatasetInfo）。 |
| `builder_kwargs`              | `dict` （可选），要传递给[`tfds.core.DatasetBuilder`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetBuilder)构造函数的关键字参数。 `data_dir`将默认通过。 |
| `download_and_prepare_kwargs` | 如果`download=True` ， [`tfds.core.DatasetBuilder.download_and_prepare`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetBuilder#download_and_prepare) `dict` （可选）关键字参数传递给[`tfds.core.DatasetBuilder.download_and_prepare`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetBuilder#download_and_prepare) 。允许控制在何处下载和提取缓存的数据。如果未设置，则将从data_dir中自动推断出cache_dir和manual_dir。 |
| `as_dataset_kwargs`           | `dict` （可选），关键字参数传递给[`tfds.core.DatasetBuilder.as_dataset`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetBuilder#as_dataset) 。 |
|                               |                                                              |
| `try_gcs`                     | `bool` ，如果为True，则tfds.load将在本地构建数据集之前查看该数据集是否存在于公共GCS存储桶中。 |

| 退货      |                                                              |
| :-------- | ------------------------------------------------------------ |
| `ds`      | [`tf.data.Dataset`](https://tensorflow.google.cn/api_docs/python/tf/data/Dataset) ，即请求的数据集；如果`split`为None， `dict<key: tfds.Split, value: tfds.data.Dataset>` 。如果`batch_size=-1` ，这些将是完整数据集，如[`tf.Tensor`](https://tensorflow.google.cn/api_docs/python/tf/Tensor) 。 |
| `ds_info` | [`tfds.core.DatasetInfo`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/core/DatasetInfo) ，如果`with_info`为True，则[`tfds.load`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/load)将返回一个包含数据集信息（版本，功能，拆分，num_examples等）的元组`(ds, ds_info)` ）。请注意， `ds_info`对象记录了整个数据集，而与请求的`split`无关。特定于拆分的信息可在`ds_info.splits`中`ds_info.splits` 。 |

