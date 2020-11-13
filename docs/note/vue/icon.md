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
我们项目是使用`vue-cli`创建的，因为内置了`webpack`，封装了相当多的功能，所以只能通过它暴露的接口修改`webpack`配置。

``` js
chainWebpack: (config) => {
    config.module.rule('js')
      .use(kissFontPlugin.jsLoader).loader(kissFontPlugin.jsLoader).options({ isAutoJnjectComponent: true }).end();
   
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

        config.module.rule('vue')
          .use(kissFontPlugin.fontLoader).loader(kissFontPlugin.fontLoader).end();
  },
```