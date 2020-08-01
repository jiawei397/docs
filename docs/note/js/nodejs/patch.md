# 使用patch-package修改Node.js依赖包内容

最近工作中有遇到需要修改`node_modules`中开源包的情况。
如果改动比较大，`fork`下来修改，再修改名称，重新发布下，这样比较合适。
但如果只是修改一两行代码，而源包也比较大的情况，就有点儿浪费了。

网上查了下，可以使用`patch-package`来管理依赖包，打补丁。

## 安装patch-package

通过npm进行安装
```
npm i patch-package --save-dev
```

或者通过`yarn`进行安装
```
yarn add --dev patch-package
```

## 创建补丁
在修改依赖包内容后，就可以运行`patch-package`创建`patch`文件了。

```
$ npx patch-package package-name   # 使用npm
$ yarn patch-package package-name  # 使用yarn
```

运行后通常会在项目根目录下的`patches`目录中创建一个名为`package-name+version.patch`的文件。将该`patch`文件提交至版本控制中，即可在之后应用该补丁了。

以我修改的`verdaccio`为例，会生成一个`verdaccio+4.4.0.patch`的文件，内容大致如下：
```
diff --git a/node_modules/verdaccio/build/index.js b/node_modules/verdaccio/build/index.js
index 3a79eaa..d00974b 100644
--- a/node_modules/verdaccio/build/index.js
+++ b/node_modules/verdaccio/build/index.js
@@ -5,6 +5,8 @@ Object.defineProperty(exports, "__esModule", {
 });
 exports.default = void 0;
 
+console.log('---------------')
+
 var _bootstrap = require("./lib/bootstrap");
```

##　部署
完成上述操作后，最后还需要修改`package.json`的内容，在`scripts`中加入`"postinstall": "patch-package"`。

```
"scripts": {
  "postinstall": "patch-package"
}
```

后续运行`npm install`或是`yarn install`命令时，便会自动为依赖包打上我们编写的补丁了。
