

### Commonjs和es6在模块引用上的区别

#### Commonjs

在 Commonjs 中，一个文件就是一个模块。定义一个模块导出通过 `exports` 或者 `module.exports` 挂载即可。 导出： 

```js
//module.js
exports.test_number = 1
```

###### 导入一个模块也很简单，通过 `require` 对应模块拿到 `exports` 对象。

```js
//main.js
const counter = require('./module');
console.log(counter.count);
```

##### Commonjs如何引用模块

1. 当运行 `node main.js`时， Node会调用Module上的静态方法 _load(process.argv[1]) 加载这个模型，并标记为主模块，并赋值给`process.mainModule` 和`require.main` ,通过这两个字段可以判断当前模块是否为主模块
2. Commonjs在代码运行时会同步阻塞式的加载模块在执行代码过程中遇到 `require(X)`时会停下来等待，直到新的模块加载完成之后再继续执行接下去的代码。
3. 模块加载是有缓存机制的。模块加载过程中会以模块的绝对路径作为`key`,对应的module对象作为`value` 存入cache。在读取模块的时候会优先判断是否已在缓存中，如果在，直接返回 `module.exports`；如果不在，则会进入模块查找的流程，找到模块之后再写入 `cache`。 对于Commonjs的同步阻塞引用和缓存在nodejs笔记中有提到  [[node.js#循环应用]]。**模块缓存可以使用`require.cache`** 打印查看。
3. 值得留意：`cache key` 使用的是模块在系统中的绝对位置，由于模块调用位置的不同，相同的 `require('foo')`代码并不能保证返回的是统一个对象引用。这种情况暂时我无法复现。



#### ES6

