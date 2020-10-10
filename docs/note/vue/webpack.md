# 记一次webpack使用loader与plugin

## 背景
遇到这样一个页面需求：主工程`A`中用`iframe`引入工程`B`，但`B`又需要使用`A`中注册的插件，都是用的`vue`。
`B`中代码大概如下：

``` js
let c = decodeURIComponent(location.search.split('=')[1]);
if(window.top.allInnerComponent){
    let components = Object.keys(window.top.allInnerComponent);
    components.forEach(componentName=>{
        Vue.component(componentName, window.top.allInnerComponent[componentName]);
    })
}
if(option){
    option.el = '#app';
    vm=new Vue(option)
}
```
其中，`allInnerComponent`是`A`的全局变量，生成过程如下：
``` js
const requireComponent = require.context(
    './panel',    // 其组件目录的相对路径
    true,    // 是否查询其子目录 
    /Inner-[\w-]+\.vue$/,    // 匹配基础组件文件名的正则表达式
);
window.allInnerComponent = {};
requireComponent.keys().forEach((fileName) => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName);
    // 全局注册组件
    window.allInnerComponent[fileName] = componentConfig.default || componentConfig;
    Vue.component(fileName, componentConfig.default || componentConfig);
});
```
这个方案的合理性姑且不论，它遇到一个显著的问题，`A`组件中的`css`样式，并没有包含在`allInnerComponent`之中。为什么呢？

仔细看`vue`的打包后代码，可以看出，`vue`是将组件的`template`代码以字符串的形式，写入到`js`里的，而组件的`css`部分，并不是与组件代码放一起，而是单独提取出来，最终与其它组件的`css`一起，要么生成单独的`css`文件，要么以`css in js`的形式，再用`js`显示到页面（调用的是`vue-style-loader`）。

也就是说，`vue`的`css`部分与`template`和`script`是解耦的，唯一关联是如果使用`scope`标签，则会记录一个`hash`值，对应的`DOM`中会加入`data-[hash]`的属性，`css`也会相应添加，这样保障了样式的隔离。

如果能找到组件中`css`所存储的地方，那么问题就解决了。遗憾的是，我没看出来。只能选择一个笨办法，这时就用到了`webpack`的`plugin`和`loader`。

将`vue`解析后的`css`数据用`loader`拦截，用`Object`存储起来，再写个`plugin`，将得到的`css`对象赋给`window`全局变量，整个以字符串的形势，插入到`html`里。

## loader

存储代码`css-parse`
``` js
let map = {}

module.exports = {
    store(filename, css) {
        map[filename] = css;
    },
    getSource() {
        return map;
    },
    clear(){
        map = {};
    }
}
```

loader代码：
``` js
const cssParse = require('./css-parse');

module.exports = function (source) {
  const path = this.resource; //生成css文件的源路径拼接的字符串
  const reg = /src\\components\\panel\\(.*).vue\?vue&type=style/;
  const arr = path.match(reg);
  if (arr && source) {
    const fileName = arr[1];
    cssParse.store(fileName, source.replace(/[\r\n]/g, ''));
  }
  return source;
};
```

## 插件
``` js
const cssParse = require('./css-parse');
class VueCssPlugin {
    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            // console.log('The compiler is starting a new compilation...');
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data, cb) => {
                    const html = data.html;
                    const index = html.lastIndexOf(`</html>`);
                    let str = html.substr(0, index);
                    str += `<script>
                    window.allInnerComponentCss = ${JSON.stringify(cssParse.getSource())}
                    </script>`
                    str += `</html>`
                    data.html = str
                    // cb(null, data)
                }
            )
        })

    }
}
// 导出插件 
module.exports = VueCssPlugin;
```
有个插曲，我用`webpack`测试时，用的`html-webpack-plugin`的版本是`4.5`，而`vue-cli`项目中集成的是`3.2`，API不一样，报错，在github上找到对应版本，看了说明文档才搞定。

## vue配置
我写的`loader`，是需要使用到`css-loader`之前的。在webpack中配置大概如下：
```
module.exports = {
  resolveLoader: {
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules', './loader/'], 
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'public/index.html'
    }),
    new MyPlugin() //我的插件
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [ 'vue-loader', ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js)$/,
        use: [
          'js-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'style-loader',
          'css-loader',
          'vue-css-loader' //我的loader，需要放到css-loader之后，其实加载顺序是从后往前的，这里也就是它先执行。如果有less-loader之类，就需要放中间了
        ]
      },
    ]
  }
};
```

对应到`vue-config`中，就是这样了：
``` js
const VueCssPlugin = require('./build/vue-css-plugin');

module.exports = {
    configureWebpack: {
        plugins: [
            new VueCssPlugin(), //我的plugin
        ],
    },
    chainWebpack: (config) => {
        config.resolveLoader.modules.store.add('./build/'); //本地loader目录
        config.module
            .rule('css').oneOf('vue').use('vue-css-loader').loader('vue-css-loader') //我的loader
            .end();
    }
};

```

## loader的顺序问题
上面的配置，只解决了`vue`文件中`css`的配置，而其它`scss`、`less`、`stylus`之类，都没处理。

于是，需要在`chainWebpack`中增加如下内容：
``` js
config.module
            .rule('scss').oneOf('vue').use('vue-css-loader').loader('vue-css-loader') //我的loader
            .end();
```
但这样我们只能得到`scss`的字符串，并不是编译为`css`之后的。

怎么办呢？

使用`vue ui`找开项目，再在`任务`中找到`inspect`，点击`运行`，得到当前工程的`webpack`配置，会发现`scss`部分大概是这样的：
```
/* config.module.rule('scss') */
{
  test: /\.scss$/,
  oneOf: [
    /* config.module.rule('scss').rule('vue-modules') */
    {
      resourceQuery: /module/,
      use: [
       ... //忽略
      ]
    },
    /* config.module.rule('scss').rule('vue') */
    {
      resourceQuery: /\?vue/,
      use: [
        {
          loader: '/test/node_modules/mini-css-extract-plugin/dist/loader.js',
          options: {
            hmr: false,
            publicPath: '../../'
          }
        },
        {
          loader: '/test/node_modules/css-loader/dist/cjs.js',
          options: {
            sourceMap: false,
            importLoaders: 2
          }
        },
        {
          loader: '/test/node_modules/postcss-loader/src/index.js',
          options: {
            sourceMap: false,
            plugins: [
              function () { /* omitted long function */ }
            ]
          }
        },
        {
          loader: '/test/node_modules/sass-loader/dist/cjs.js',
          options: {
            sourceMap: false,
            prependData: '@import "@/assets/css/global_variable.scss";'
          }
        },
        {
          loader: 'vue-css-loader'
        },
      ]
    },
    /* config.module.rule('scss').rule('normal-modules') */
    { 
      test: /\.module\.\w+$/,
      use: [ //忽略
        ...
      ]
    },
    /* config.module.rule('scss').rule('normal') */
    {
      use: [ //忽略
        ...
      ]
    }
  ]
},
```
从上面可以看出，我们的`vue-css-loader`是在最下面，`webpack`的`loader`加载顺序是从后往前，所以顺序需要调整。

怎么调整呢？
从官网上没找到例子，于是找断点，发现可以使用`before`：
``` js
config.module.rule('scss').oneOf('vue')
  .use('vue-css-loader')
  .before('mini-css-extract-plugin')
  .loader('vue-css-loader').end();
```

这个花了较长时间，原因是我是复制页面上的`webpack`配置，再放到`ide`里查看，一直没有清控制台，没有发现其实自己已经调对了。
还是不够细心。

## 总结

这个方案还有个问题， `components`目录下的css的重复加载，浪费。

但总的讲，通过这个功能，学习了`webpack`的插件和`loader`，为下来另一个功能打下了基础。