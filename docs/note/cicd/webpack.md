# webpack配置 TODO

## loader

[`loader`](https://www.webpackjs.com/api/loaders/)是`webpack`的核心概念之一，它的基本工作流是将一个文件以字符串的形式读入，对其进行语法分析及转换（或者直接在`loader`中引入现成的编译工具，例如`sass-loader`中就引入了`node-sass`将`SCSS`代码转换为`CSS`代码，再交由`css-loader`处理），然后交由下一环节进行处理。

所有载入的模块最终都会经过`moduleFactory`处理，转成`js`可以识别和运行的代码，从而完成模块的集成。

也就是说，其实`webpack`只能处理`js`，但有了`loader`，它可以预处理文件，就可以打包除`js`外的所有静态资源了。

在写法上，它使用`nodejs`开发，只是一个导出为函数的`js`模块，`loader runner`会调用这个函数，然后把上一个`loader`产生的结果或者资源文件(`resource file`)传入进去。函数的`this`上下文将由`webpack`填充，并且`loader runner`具有一些有用方法，可以使`loader`改变为异步调用方式，或者获取`query`参数。

平时我们使用`loader`是这样的：
``` js
use: [
  'a-loader',
  'b-loader',
  'c-loader'
]
```

它的执行顺序其实是这样的：
```
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```
如果某一个`loader`的`pitch`函数返回了某个结果，则会跳过下面的`loader`。

例如，假设`b-loader`的`pitch`这样返回了：

``` js
module.exports = function(content) {
  return someSyncOperation(content);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  if (someCondition()) {
    return "module.exports = require(" + JSON.stringify("-!" + remainingRequest) + ");";
  }
};
```
上面的步骤将被缩短为：
```
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

像`cache-loader`就是这个原理，会把编译结果进行缓存。

> 对于不考虑`pitch`的`loader`而言，可以简单理解为是从后往前执行的。

::: tip 单一职责
`loader`支持链式调用，所以开发上需要严格遵循`单一职责`原则，即每个`loader`只负责自己需要负责的事情：

将输入信息进行处理，并输出为下一个`loader`可识别的格式。
:::

## plugin

`plugin`也就是插件，插件的能力与`loader`解析转换文件不一样，它可以各种方式自定义`webpack`的构建过程。
其实就是不同的生命周期提供了大批量的钩子函数，可以有同步、异步不同的处理，方便我们在构建过程中进行额外操作。

目前`webpack`已经提供了丰富的[插件](https://www.webpackjs.com/plugins/)，已经可以满足大部分需求。

像最常用的是`html-webpack-plugin`，如果要用页面访问服务的话，几乎都会使用到它，它会从入口文件开始，把所有引用到的`js`与`css`都注入到模板页面上。

其它处理`js`压缩、`css`压缩、代码分割、`dll`预编译、`md5-hash`、资源复制、清除等，应有尽有。如果满足不了你的需求，就自己实现一个。

在插件开发中，常用的有2个对象：`Compiler`和`Compilation`，名字有些像，有什么区别呢？

`Compiler`对象包含了`webpack`环境所有的配置信息，包含`options`、`loaders`、`plugins`，在`webpack`启动时候被实例化，是全局唯一的。我们可以把它理解为`webpack`的实列。开发时，我们可以从中拿到所有和`webpack`主环境相关的内容。

`Compilation`对象包含了当前的模块资源、编译生成资源、文件的变化等。当`webpack`在开发模式下运行时，每当检测到一个文件发生改变的时候，那么一次新的`Compilation`将会被创建，从而生成一组新的编译资源。最显著的特征是涉及变化的文件会触发对应的`loader`运行。

二者的区别是：`Compiler`代表了是整个`webpack`从启动到关闭的生命周期； `Compilation`只代表了一次新的编译。

以下常见的事件钩子：

| 钩子        | 作用           | 参数  | 类型 |
| ------------- |:-------------:|:-----:|:-----:|
|after-plugins | 设置完一组初始化插件之后 | compiler | sync |
|after-resolvers | 设置完 resolvers 之后 | compiler | sync |
|run | 在读取记录之前 | compiler | async|
|compile | 在创建新 compilation之前 | compilationParams | sync |
|compilation | compilation 创建完成 | compilation | sync |
|emit | 在生成资源并输出到目录之前 | compilation | async |
|after-emit | 在生成资源并输出到目录之后 | compilation | async |
|done | 完成编译 | stats | sync |


## 热更新 TODO

热更新是`webpack`的一项非常有效的能力，大大提高了我们的开发效率。
从名字上看也能理解，修改代码后，不需要刷新浏览器，就可以直接在页面上看到更改后的内容。


- [玩转 webpack，使你的打包速度提升 90%](https://blog.csdn.net/lunahaijiao/article/details/104509446/?utm_medium=distribute.pc_relevant.none-task-blog-title-6&spm=1001.2101.3001.4242)