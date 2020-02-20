# gulp小结

[[toc]]

## gulp是什么？
一个自动化构建工具，基于`nodejs`的自动任务运行器。

## 为什么要使用它？
易于使用，易于学习。它能自动化地完成`javascript/coffee/sass/less/html/image/css` 等文件的的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了`Unix`操作系统的管道（`pipe`）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。

## 和grunt、webpack的区别
`gulp`和`grunt`非常类似，但相比于`grunt`的频繁`IO`操作，`gulp`的流操作，能更快地更便捷地完成构建工作。前两者定位是工具，`webpack`则是种模块化解决方案。

说到 `browserify` / `webpack` ，那还要说到 `seajs` / `requirejs` 。这四个都是`JS模块化`的方案。其中`seajs` / `require` 是一种类型，`browserify` / `webpack` 是另一种类型。

`seajs` / `require` : 是一种在线"编译" 模块的方案，相当于在页面上加载一个 `CMD/AMD` 解释器。这样浏览器就认识了 `define`、`exports`、`module` 这些东西。也就实现了模块化。

`browserify` / `webpack` : 是一个预编译模块的方案，相比于上面 ，这个方案更加智能。

`gulp`也能调用`webpack`。

## 为什么要用4.0？

- 组合任务。

  比如以前的`gulp`对多个异步任务很难控制，必须借助于第三方模块，如`run-sequence`、`event-stream`等，效果也并不理想。

  现在`gulp`带来了两个新的`api`：`gulp.series`【顺序】和`gulp.parallel`【并行】，这两个革命性的`api`将帮助开发者解决恼人的任务流程控制问题。

``` js
//clear任务执行完后，才会执行copy
gulp.task("build",
  gulp.series("clear","copy")
 );

//inject:home和inject:list这2个任务同时执行
 gulp.task("inject-all",
  gulp.parallel("inject:home",
    "inject:list"
  )
 );
```
小技巧：一个任务中需要立即执行一下任务，以前版本有`gulp run XX`，新的没有，但可以这样：

``` js
gulp.parallel('XX')();
gulp.series('XX')();
```
- 支持异步任务

  有3种方式确认`gulp`能够识别任务何时完成。后2者重要是`return`

- 回调
- 返回一个流
- 返回一个`Promise`

   更多参见这篇文章：[http://codecloud.net/10666.html](http://codecloud.net/10666.html)


## npm包管理
包管理主要在根目录下的	`package.json`文件。
`scripts`中是一些`npm`的任务，`npm run dev` 即可执行。

`dependencies`是项目中必须的包，目前我们没有用到，只有个`vue`。
`devDependencies`是开发所用的包，发布到生产环境不需要的都放在这里，平时安装时需要用`npm install -save-dev XX`，可简写作`npm i -D XX`。

同时安装多个包可以这样：`npm install -save-dev aa bb`。或者将包复制到`package`文件里，直接在根目录命令行里`npm i`或`npm install`。

`包的版本`：如`"vue": "^2.0.1"`

一个完整的版本号组表示为： `[主要版本号，次要版本号，补丁版本号]`
- `~`会匹配最新的子版本（中间那个数字），比如`~1.2.3`会匹配所有的`1.2.x`版本，但不匹配到`1.3.0`及以上
- `^`会匹配最新的主版本（第一个数字），比如`^1.2.3`将会匹配所有的`1.x.x`版本，`2.0.0`就缓缓飘过了。

## 怎么安装
1. 全局：`npm i gulp -g`
2. 工程内部：`npm i -D gulp`
3. 工程根目录下创建`gulpfile.js`，它是配置文件。一个任务类似`gulp.task('a',function(){})`;
4. 在`webstorm`中右键`gulpfile.js` 选择`Show Gulp Tasks`打开`Gulp`窗口，双击任务`a`即可。
或者在命令行中，输入`gulp a`

## 几个API
### gulp.src(globs[, options])

输出符合所提供的匹配模式或者匹配模式的数组的文件。将返回一个流，它可以被 `pipe` 到别的插件中。

``` js
gulp.src('client/templates/*.jade')
   .pipe(jade())
   .pipe(minify())
   .pipe(gulp.dest('build/minified_templates'));
```

::: tip globs
`globs`可以是字符串，也可以是数组，相对路径或绝对路径都可以。举个例子：

```
["src/**/*.html", "!src/*.html", "src/play.html"]
```
  表示目标是`src`下所有的`html`文件，但不包括根目录的`html`文件，却要包含根目录下`play.html`。
:::

::: tip options
通过 `glob-stream` 所传递给 `node-glob`的参数，可传可不传。

- `options.buffer`	类型： `Boolean` 默认值： `true`

如果该项被设置为 `false`，那么将会以 `stream` 方式返回 `file.contents` 而不是文件 `buffer`的形式。这在处理一些大文件的时候将会很有用。

- `options.read`  类型：`Boolean` 默认值： `true`

如果该项被设置为`false`，那么`file.contents`会返回空值（`null`），也就是并不会去读取文件。只获取文件路径，不需要读取内容时有用。

- `options.base`

举个例子感受一下，比如一个路径为` client/js/somedir` 的目录中，有一个文件叫 `somefile.js` ：

``` js
gulp.src('client/js/**/*.js') // 匹配 'client/js/somedir/somefile.js' 并且将 `base` 解析为 `client/js/`
    .pipe(minify())
    .pipe(gulp.dest('build'));  // 写入 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
    .pipe(minify())
    .pipe(gulp.dest('build'));  // 写入 'build/js/somedir/somefile.js'
```
:::



### gulp.dest(path[, options])

能被 `pipe` 进来，并且将会写文件。并且重新输出（`emits`）所有数据，因此你可以将它 `pipe` 到多个文件夹。如果某文件夹不存在，将会自动创建。

::: tip path 类型： `String` or `Function`

文件将被写入的路径（输出目录）。也可以传入一个函数，在函数中返回相应路径
:::

::: tip  options  类型： `Object`

- `options.cwd`    类型： `String` 默认值： `process.cwd()`

输出目录的 `cwd` 参数，只在所给的输出目录是相对路径时候有效。

- `options.mode`  类型： `String` 默认值： `0777`

八进制权限字符，用以定义所有在输出目录中所创建的目录的权限。
:::

### gulp.watch(glob[, opts])

旧版本有个参数回调，比如：

``` js
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```
将变为：
``` js
var watcher = gulp.watch('js/**/*.js' /* 你也可以在这儿传入一些选项与/或一个任务函数 */);
watcher.on('all', function(event, path, stats) {
  console.log('File ' + path + ' was ' + event + ', running tasks...');
});
```
或监听单独的事件类型，基本的3种：`增`、`删`、`改`
``` js
watcher.on('change', function(path, stats) {
  console.log('File ' + path + ' was changed, running tasks...');
});

watcher.on('add', function(path) {
  console.log('File ' + path + ' was added, running tasks...');
});

watcher.on('unlink', function(path) {
  console.log('File ' + path + ' was removed, running tasks...');
});
```
## 基本插件
- 引用文件夹：`require-dir`
- 压缩js：`gulp-uglify`

::: details 有细节可以配置
``` js
uglify({
   compress: {
     drop_console:true, //删除console，默认false
     drop_debugger: false//忽略debugger，默认true
   }
});
```
:::

::: tip es6
如果要压缩`es6`，可以使用`gulp-terser`
:::

- 合并js：gulp-concat
- 压缩图片：gulp-imagemin
- 压缩html：gulp-htmlmin
- 压缩css：gulp-clean-css
- 压缩成zip包：gulp-zip

## 明星插件

- 简化书写gulp插件：`gulp-load-plugins`

``` js
var $ = require('gulp-load-plugins')();
gulp.src('from')
    .pipe($.if(condition,$.uglify())//去除前面的'gulp-'
    .pipe($.cleanCss())//原来名字叫gulp-clean-css，以驼峰形式使用
    .pipe(gulp.dest('dist'));
```


- 重命名：`gulp-rename`

``` js
gulp.src('from').pipe(uglify())
  .pipe(rename('XX'))
  .pipe(gulp.dest('dist'));
```

- 条件：`gulp-if`

返回为`true`,调用后面的方法，其它不用。适用于既不愿意压缩或其它，但又必要将文件复制到指定目录的情况。

``` js
	gulp.src('from')
		.pipe(if(function(file){
			if (file.path.endsWith('.min.js')) {
		      return false;
		    }
		    return true;
		},uglify()))
	.pipe(gulp.dest('dist'));
```


- 缓存：`gulp-cache`

非常有用，会将方法执行的结果缓存起来，当文件改变后，会重新执行方法，其它文件依然直接从缓存中读取结果。整个工程压缩完`js`需要2分钟以上，使用缓存后只需要1秒钟。`js`、`css`、图片这些大件耗时的都要用到。

注意：方法配置修改以后，缓存就没用了，需要手动删除缓存文件夹

``` js
gulp.src('from')
    .pipe($.cache($.uglify(), {
      fileCache: new Cache({
        "cacheDirName": "test",//缓存文件夹名称，默认为gulp-cache
        "tmpDir": "D:\\Documents\\gulp-cache"//指定一个本地的缓存目录，默认为C:\Users\Administrator\AppData\Local\Temp，建议换个目录，因为一般会当作垃圾清除掉
      }),
      name: 'js'//缓存文件夹名称再下一级的子目录，本例类似：D:\\Documents\\gulp-cache\\test\\js
    }))
    .pipe(gulp.dest('dist'));
```


- 系统提醒：`gulp-notify`

``` js
gulp.src('from')
    .pipe($.zip('map.zip'))
    .pipe(gulp.dest('dist'))
    .pipe($.notify({message: 'map压缩完成'}));
```

- 文件注入：`gulp-inject`

``` js
gulp.src('from', {cwd: "./src/entry/"})
    .pipe($.inject(gulp.src(['XX'], {read: false, cwd: 'XXdir'}), {
      relative: true,
      starttag: "<!-- start:pluginsJs -->",
      endtag: "<!-- end:pluginsJs -->",
      transform: function(filePath, index){
    return '<script src="' + filePath.substr(index) + '">' + '<' + '/script>';
    }
    }))
```

- 回调地狱终结者：`q`

    `q`就是一个`Promise`库，提供额外的接口可以封装普通函数为`Promise`。
详见：[http://blog.csdn.net/ii1245712564/article/details/51419533](http://blog.csdn.net/ii1245712564/article/details/51419533 "q.js")

当然，现在完全可以使用`async/await`代替。
