### 打开关闭文件

```python
file = open(file_name [, access_mode][, buffering])
```

各个参数的细节如下：

- file_name：file_name变量是一个包含了你要访问的文件名称的字符串值。

- access_mode：access_mode决定了打开文件的模式：只读，写入，追加等。所有可取值见如下的完全列表。这个参数是非强制的，默认文件访问模式为只读(r)。

  <img src="https://www.runoob.com/wp-content/uploads/2013/11/2112205-861c05b2bdbc9c28.png" alt="img" style="zoom:53%;" />

- buffering:如果buffering的值被设为0，就不会有寄存。如果buffering的值取1，访问文件时会寄存行。如果将buffering的值设为大于1的整数，表明了这就是的寄存区的缓冲大小。如果取负值，寄存区的缓冲大小则为系统默认。

##### file的一些属性

`file.name` 打开的文件的文件名； `file.closed` 这个文件是否已经关闭； `file.mode` 文件的访问模式；



最后应该关闭文件 `file.close()`

### 打开文件定位处理

