# 图标生成字体文件

## 背景

公司内部使用字体图标，是在阿里的[字体图标矢量库](https://www.iconfont.cn/)中找好图标，添加到组里，再下载下来，把文件提交到我们的`gitlab`仓库维护起来。

这样当然不方便。

先在`npm`上搜索了下，没找到类似的方案，但把`svg`图标生成字体与`css`的库有，也有把图标放在本地某个文件夹就不用再管的`loader`，后者是[`webfonts-loader`](https://www.npmjs.com/package/webfonts-loader)。

于是我们讨论了一个方案：

1. 搭建一台服务器，所有的`svg`图标都放上面

2. 解析`DOM`中用到的图标名称

3. 请求服务器资源，下载到本地某个目录

4. 按照`webfonts-loader`的文档，配置这个目录，之后应该开发与打包都OK

整体思路很简单，实现起来却有些波折。

## 技术验证

首先进行技术验证。


### 新建webpack工程
我用`webpack4`创建了一个新的工程，里面添加了`vue-loader`，在其中一个`vue`文件里这样使用图标（因为我们主要技术栈是`vue`，先不考虑其它的）：

```
<my-font name="go"></my-font>
<my-font name="search"></my-font>
```

### 自定义loader，解析DOM，下载图标
自定义一个`loader`，放在`vue-loader`的后面，也就是先它执行，对应的`webpack`的配置如下：

```javascript
rules: [
    {
        test: /\.vue$/,
        use: ['vue-loader', myfontLoader]
    },
}
```
我的`loader`作用就是用来解析`vue`的`DOM`元素，用正则表达式匹配出`my-font`的`name`，再从服务器下载对应的图标到本地目录。

### 使用webfonts-loader

1. 配置文件
`webfonts-loader`的配置文件`myfont.font.js`是这样的：
``` js
module.exports = {
  'files': [
    './myfont/*.svg'
  ],
  'fontName': 'myfonticons',
  'classPrefix': 'myfonticon-',
  'baseSelector': '.myfonticon',
  'types': ['eot', 'woff', 'woff2', 'ttf', 'svg'],
  'fileName': 'app.[fontname].[hash].[ext]'
};
```

其实就是下载到`myfont`文件夹。

2. `webpack`配置

    `webfonts-loader`除了上述配置文件，还需要有额外的`webpack`配置：
``` js
{
  test: /\.font\.js/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: false
      }
    },
    'webfonts-loader'
  ]
}
```

3. 引入文件
还需要在入口文件中引入一个`js`：

```javascript
require('./myfont.font');
```

它的原理是，引用了这个文件后，就可以使用`webfonts-loader`得到配置文件，生成`css`提供给下一个`loader`——`css-loader`，再使用`MiniCssExtractPlugin.loader`生成单独的`css`文件。因为它监听配置的`files`文件夹，所以当文件夹内文件变更后，会触发`webpack`重新编译，编译后会进行热更新。

### 测试
经过测试，开发与打包都没有问题。

## 迁移到vue

### 配置
我们项目是使用`vue-cli`创建的，因为内置了`webpack`，封装了相当多的功能，所以只能通过它暴露的接口修改`webpack`配置。

``` js
chainWebpack: (config) => {
      config.module
        .rule('kissfont')
        .test(/kiss\.font\.js/)
        // .use(MiniCssExtractPlugin.loader)
        // .loader(MiniCssExtractPlugin.loader)
        // .end()
        .use('css-loader')
        .loader('css-loader')
        .end()
        .use('webfonts-loader')
        .loader('webfonts-loader')
        .end();

      config.module.rule('vue').use(myfontLoader).loader(myfontLoader).end();
  },
```

### 缺点
问题来了，如果使用`MiniCssExtractPlugin.loader`会报错。

注释掉后，倒是不报了，但还有另一个问题，首次是因为临时文件夹下面并没有图标，会报错。我的解决方案是每次先加个默认图标。

### 折腾

如果我能在图标下载完成后，再生成`css`与字体文件，是不是更好点？我们知道，`webpack`的插件提供了大量的钩子函数，在`loader`中下载完图标，完全可以在插件中干这件事情。

于是开始折腾。

1. 在`webfonts-loader`代码中，找到用来生成`css`和字体文件的库——`@vusion/webfonts-generator`。

2. 使用`html-webpack-plugin`的钩子函数`html-webpack-plugin-before-html-processing`，在它期间生成`css`与字体

3. 把生成的`css`注入到页面的`css`标签

这时，又出现一个问题：无法`热更新`。主要是开发环境下会有这种需求。

我进行了下列尝试：

1. 把`css`改为用`js`动态插入到页面，仍使用`html-webpack-plugin`来注入代码。失败。

2. 开发环境下，`webpack`把生成的代码是放内存里了，我找到生成`css`的地方，并将它放到对应的内存（`compiler.outputFileSystem`，使用的是`memory-fs`）中。失败。

3. 服务启动时代理我存放`css`的临时目录（`config.devServer.contentBase(utils.getTmpDir())`），这样目录下文件有更新，页面就会刷新。发现确实是进行刷新，而不是热更新。失败。

怎么办呢？

研究热更新的原理，还是我的`css`生成的时机不对，不在编译阶段，就没法热更新。可如果在编译阶段，我又无法知道什么时候所有的图标都下载完成。

陷入僵局。

没办法，只能参考`webfonts-loader`，在入口文件中引入`css`（`import 'xx.css'`），再加个`style-loader`和`css-loader`专门处理这个`css`，这样，当这个`css`有变化时，也能热更新了。

兜兜转转，没想到还是回归了`webfonts-loader`的思路，好尴尬。

## 过程中遇到的问题

### 多进程
`parallel`如果配置为`true`时，会根据`CPU`的核心数量开启多进程，如果本地存储变量做为中转记录的话，会失效，只能存在临时文件，或者`process.env`中，后者有个时机问题，只能在进程开始前存入，否则依然会失效。

### cache-loader缓存
`vue`文件被默认添加了`cache-loader`，它在加载一次后，会导致下次跟它相关的`loader`不会再触发，应该是使用了`pitch`函数的缘故。
    
   为了打包的图标`css`能够纯净，需要每次打包都下载需要的图标，这时就得禁止`cache-loader`。
``` js
const vueRule = config.module.rule('vue');
vueRule.uses.delete('cache-loader');
vueRule.use(fontLoader).loader(fontLoader).options(options).end();
```

### require缓存
在`loader`中，添加对配置文件的监听：
``` js
this.addDependency(dir);
```
但配置文件的读取，是用`require('xx.js')`这样做的，它有个问题，执行过一次后，就加到内存里了，不会再读取这个文件，于是需要在合适的时候清除一遍缓存：
``` js
delete require.cache[require.resolve(dir)];
```

## 总结

通过这个功能，学习了`webpack`的插件和`loader`的使用，对`cache-loader`、`thread-loader`、`html-webpack-plugin`以及热更新都有了些了解。

> 最终的插件和使用可以见[这里](https://www.npmjs.com/package/kiss-font-plugin)
