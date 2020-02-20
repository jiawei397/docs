# es6代码不再打包为es5

最近，因为业务需要，终于摆脱了`IE`，彻底投入`chrome`怀抱，不用再考虑各种兼容性问题。

## vue改造 ##
主项目使用的`vue`，痛苦的是代码中的`async/await`被编译后，堆栈复杂难追，太对不起`chrome`对`es6`的支持了。
碎碎念了一段时间，这两天终于有时间看了下。其实挺简单，把`babel`配置的`presets`去掉就好了，之后是`plugins`缺什么补什么。

这是我项目中例子：
```
module.exports = {
    // presets: [
    //     '@vue/app',
    // ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import'
    ],
};
```

另一种方案，修改根目录下的`.browserslistrc`文件：
```
last 2 Chrome versions
```
这种更稳妥一些。

## rollup改造 ##

还有个老项目，直接用`rollup`打包的，也是一样修改（它的`presets`用的是`@babel/preset-env`）。
但有个问题，开发时还好，发布时因为要压缩，我使用的是`rollup-plugin-uglify`。这个插件不支持压缩`es6`。
试了下`webpack`，它可以，我甚至想要用它把`rollup`替换掉了。
看了下`rollup-plugin-uglify`的源码，它底层调用的是`uglify-js`来压缩，修改为`uglify-es`就可以了。
想着发布个插件吧，没想到看到人家说明文档里面这句：
> _Note: uglify-js is able to transpile only es5 syntax. If you want to transpile es6+ syntax use [terser](https://github.com/TrySound/rollup-plugin-terser) instead_

改用`rollup-plugin-terser`就可以了。
大写的尴尬！以后还是要多看README。

## gulp改造 ##
`gulp`也类似，这次学乖了，先看的文档。
我用的是插件是：`gulp-uglify`。原来是这样写的：
```
const uglify = require('gulp-uglify');
...
```
api里有个例子：
```
const uglifyEs  = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyEs, console);
...
```

当然，在`npm`上发现还有个插件叫：`gulp-terser`。
又叫`terser`！
早该想到的！
