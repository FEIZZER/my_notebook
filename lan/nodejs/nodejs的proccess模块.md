### process

`process` 对象提供有关当前 Node.js 进程的信息并对其进行控制。 虽然它作为全局可用，但是建议通过 require 或 import 显式地访问，且process是 EventEmitter类的实例   

### API记录

##### exit()事件

只有两种情况会执行`exit()`, 显示的调用process.ext() 或 Node.js 事件循环不再需要执行任何额外的工作。此时没有办法阻止事件循环的退出，一旦所有 `'exit'` 监听器都运行完毕，则 Node.js 进程将终止。

使用监听器的回调函数拓展exit()方法时，可以传入`process.exitCode`属性作为参数:

```js
process.on('exit', (code) => {
	console.log(c)
});		
```

