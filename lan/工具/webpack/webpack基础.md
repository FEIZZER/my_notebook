#  webpack基础

[官网](https://www.webpackjs.com/loaders/)

#### webpack5个基本概念 并配置

1. entry(入口)  提示webpack从哪个文件开始打包。
2. output(输出)  指示webpack打包完的晚间输出到哪里。
3. loader(加载器) webpack本身只能处理js json文件， 其他类型的文件如 .vue .css  需要引入加载器来处理。
4. plugins(插件)  webpack的拓展功能
5. mode(模式)  主要有两个模式 development和production

##### 使用webpack配置文件配置他们 

在项目根目录下新建文件 `webpack.config.js`文件，作为webpack配置文件。在完成该配置文件的编写后，直接执行`webpack` 即可实现打包。==如果配置文件中 plugins:{}属性为空，则把它注释掉，否则会报错。==

*如果没有写webpack.config.js配置文件,可以在执行webpack时手动指定关键参数，如*

*`webpack ./src/main.js --mode=development`*

```js
const path = require('path')
module.exports = {
    //入口文件要求使用相对路径
    entry: './src/main.js',
    output: {
        // 输出 要求使用绝对路径
        // resolve()方法中的 __dirname参数为当前的文件的文件夹路径
        path: path.resolve(__dirname, "dist"),
        filename: 'main2.js',
        //打包前将上面配置的path目录清空。
        clean: true
    },
    //加载器
    module:{
        rules:[ 
        ]
    },
    //插件
    plugins:{
    },
    //模式
    mode: 'development'
}
```

##### development开发模式 和 production生产模式

开发模式就是在开发过程中使用的模式，该模式下会完成两件事： 

1. 编译代码，使浏览器能识别运行。
2. 对代码进行一些检查，让代码运行更加健壮。检查代码规范，统一编码风格。





#### webpack对各种资源的处理

##### 处理样式资源

webpack本身是不能处理样式资源的，需要借助loader来帮助webpack解析样式资源。可以从官网或github找到相应的loader。 以下为处理 .css文件为例

###### 下载相应的loader

```shell
npm install css-loader -D
npm install style-loader -D
```

###### 在webpack.config.js中配置

==需要注意：use:[]中加载器的执行顺序是从后往前。==

```js
module.exports = {
    //加载器
    module:{
        rules:[ 
            {
                //正则表达式，以 .css结尾的文件适用
                test: /\.css$/,
                //使用的加载器，执行顺序是从后往前。
                //'css-loader'是将css资源编译成commonjs模块添加到js中, 
                //'style-loader'将js中的css资源通过创建style标签的方式添加到html文件中。
                use: ['style-loader', 'css-loader']
            }
        ]
    },
}
```

##### 主要文件的加载器配置

- .less 文件

  ```js
  rules:[ 
      {
          test: /\.less$/,
          //less-loader 将less编译为css
          use: ['style-loader', 'css-loader', 'less-loader']
      }
  ]
  ```

- 图片资源

  webpack4的时候，处理图片资源是通过 file-loader和url-loader来实现的。进入webpack5版本，这两个。loader已经内置了，只需要简单的配置即可。

  ```js
  rules:[ 
      {
          test: /\.(png|jpe?g|gif|webp|svg)$/,
          type: 'asset',
          parser:{
              dataUrlCondition: {
                  //配置小于10kb的图片会被转化成base64字符串，可以减少请求次数，但是体积会增大。
                  maxSize: 10*1024
              },
              generator: {
                  //进一步配置图片打包的路径， 会在 dist/images/ 路径下
                  filename: 'images/[hash][ext][query]'
              }
          }
      }
  ]
  ```
  
- 其他资源的处理 *如视频，音频等*

  ```js
  rules:[ 
      {
          test: /\.(ttf|mp3|mp4|avi)$/,
          type: 'asset/resource',
          generator: {
              filename: 'media/[hash][ext][query]'
      }
  ]
  ```

##### webpack对js文件的处理

尽管webpack可以对js文件进行处理。 但是我们还可以对js文件中的语法进行一些编译，使得它兼容更多的浏览器。使用一些工具代码进行规范。

###### 使用Eslint确认代码格式

Eslint是可组装的javascript和jsx检查工具。使用Eslint，关键是编写Eslint配置文件。该配置文件有多种写法：

`.eslintrc`      `.eslintrc.json`      `.eslintrc.js` 或者 直接在package.json的selintConfig中编写配置，区别在于配置的格式不一样。

以 `eslintrc.js`的配置为例

```js
module.exports = {
    env:{
        node: true,  //启用node中的全局变量
        browser: true, //启用浏览器中的全局变量
    },
    "extends": "eslint:recommended",
    parserOptions: {
        ecmaVersion: 6,   //编译时使用es6的语法
        sourceType: 'module', //es  module
    },
    rules: {
        //必须使用分号
        semi: 'error',
    }
}
```

**rules部分以键值对的形式定义** [官方的规则文档](https://eslint.bootcss.com/docs/rules/)

- `"off"`  或  `0`         -关闭规则
- `"warn"`  或  `1`       -使用警告级别的错误，不会导致程序退出
- `"error"`  或  `2`     -使用错误级别的错误， 会导致程序退出

可以使用 extends属性 配置继承社区中已有的rules规则

**eslint使用步骤**

1. 安装eslint和eslint-webpack-plugin

   ```shell
   npm install eslint -D
   npm install eslint-webpack-plugin -D
   ```

2. 在`webpack.config.js`中添加该插件

   ```js
   const ESLintPulgin  = require('eslint-webpack-plugin')
   module.exports = {
       //插件
       plugins: [
           new ESLintPulgin({
               context: path.resolve(__dirname, 'src')
           })
       ],
   }
   ```

###### 使用Babel做代码兼容性处理

[babel官网](https://www.babeljs.cn/docs/)

主要用于将es6语法转换为向后兼容的javascript代码，以便可以在旧版浏览器中运行。babel的配置文件也有多种写法： `babel.config.js`  `babel.config.json`  `.babelrc`  `.babelrc.js`  `.babelrc.json`  或者直接在package.json文件的babel属性中填写， 下面以`babel.config.js` 为例：

```js
const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
      corejs: "3.6.4",
    },
  ],
];

module.exports = { presets };
```

1. 下载依赖包

   ```shell
   npm i babel-loader @babel/core @babel/preset-env -D
   ```

2. 在webpack.config.js文件中引入rules

   ```js
   module.exports = {
       //加载器
       module:{
           rules:[ 
               {
                   test: /\.js$/,
                   exclude: /node_modules/,
                   use: ['babel-loader'],
               }
           ]
       },
   }
   ```

3. 在`.babelrc.js`中填写预设

   ```js
   module.exports = {
       presets: ["@babel/preset-env"],
   }
   ```

##### 使用插件处理打包html文件

[插件文档地址](https://www.webpackjs.com/plugins/html-webpack-plugin/)

使用该插件将需要的html文件页打包到 dist文件中去。

```js
const path = require('path')
const ESLintPulgin  = require('eslint-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //插件
    plugins: [

        new HtmlWebpackPlugin({
            //指定需要保留的 html 文件
            template: path.resolve(__dirname, "index.html")
        })
    ],
}
```

