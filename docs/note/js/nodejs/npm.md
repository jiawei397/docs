# npm相关

## package.json中版本号

`package.json`的版本号，`~`与`^`是有区别的。

以`"lodash": "^4.17.20"`为例：
- `~`: 使用`install`安装时，会忽略最后一位`20`，安装`4.17.X`的最新版本
- `^`: 使用`install`安装时，会忽略后面2位，安装`4.X.X`的最新版本

## 线上npm安装优化

我们知道，常用的`package.json`中有3个标签管理版本，分别是：`dependencies`、`devDependencies`、`peerDependencies`。作用也很明显：

- `dependencies`： 代码中需要用到的依赖包
- `devDependencies`： 开发环境下需要用到的依赖包，比如常见的`eslint`、`babel`、`webpack`这种工具类的
- `peerDependencies`： 当作为第3方库使用时，比如`lodash`的库，它如果在这里配置了一个`xx`的包，在安装时并不会下载`xx`，而是安装完成后如果没有找到这个`xx`，会提示你自行安装。

那么对于线上`npm`安装（一般是`CICD`自动化任务构建）时，`devDependencies`肯定是没有必要的，就不必使用`npm install`进行安装，有2种方式：

- `npm ci`，它会根据`package-lock.json`文件，快速安装，应该是会忽略一些`install`时的逻辑，速度会很快。当然，如果没有这个文件，就会报错了。
- `npm i --production`，它会忽略`devDependencies`下的安装包。所以，使用它时，必须确保你代码中的依赖都在`dependencies`中。
