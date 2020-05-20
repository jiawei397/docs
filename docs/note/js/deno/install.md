# 什么是deno

## 简介
简单说是`Node.js`的替代品，`Node.js`之父`Ryan Dahl` 为挽回`Node.js`的错误而开发的。

`Node.js`存在的问题有：
1. npm包管理（`npm_modules`）复杂
2. 历史原因导致的api维护，比如早期变态的`callback`设置
3. 没有安全措施，用户只要下载了外部模块，就只好听任别人的代码在本地运行，进行各种读写操作。
4. 功能不完善，导致各种工具层出不穷，比如`webpack`、`babel`等

由于上面这些原因，`Ryan Dahl` 决定放弃 `Node.js`，从头写一个替代品，彻底解决这些问题。
`deno` 这个名字就是来自 `Node` 的字母重新组合（`Node = no + de`），表示"拆除 Node.js"（de = destroy, no = Node.js）。

跟 `Node.js`一样，`Deno` 也是一个服务器运行时，但是支持多种语言，可以直接运行 `JavaScript`、`TypeScript` 和 `WebAssembly` 程序。

它内置了 `V8` 引擎，用来解释 `JavaScript`。同时，也内置了 `tsc` 引擎，解释 `TypeScript`。
它使用 `Rust` 语言开发，由于 `Rus`t 原生支持 `WebAssembly`，所以它也能直接运行 `WebAssembly`。
它的异步操作不使用 `libuv` 这个库，而是使用 `Rust` 语言的 `Tokio` 库，来实现事件循环（`event loop`）。

## 安全机制
Deno 具有安全控制，默认情况下脚本不具有读写权限。如果脚本未授权，就读写文件系统或网络，会报错。

必须使用参数，显式打开权限才可以。

```
--allow-read：打开读权限，可以指定可读的目录，比如--allow-read=/temp。
--allow-write：打开写权限。
--allow-net=google.com：允许网络通信，可以指定可请求的域，比如--allow-net=google.com。
--allow-env：允许读取环境变量。
```

## 安装
鉴于国内的网速原因，`@justjavac` 大佬搞了国内的镜像加速：

1. Mac/Linux
```
curl -fsSL https://x.deno.js.cn/install.sh | sh
```

我用linux部署后，报没有`glibc-2.18`这个版本依赖。


按网上教程，又安装了一下：
```
curl -O http://ftp.gnu.org/gnu/glibc/glibc-2.18.tar.gz
tar zxf glibc-2.18.tar.gz
cd glibc-2.18/
mkdir build
cd build/
../configure --prefix=/usr
make -j2
make install
```
后两步比较慢，不要退出。

2. Windows
```
https://github.com/denoland/deno/releases
```
直接在这里下载exe文件吧。



## 设置环境变量
```
echo 'export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
export DENO_DIR=$HOME/.deno
' >> ~/.bash_profile

source ~/.bash_profile
```

## 测试
```
deno --version
```

## 防火墙限制
在linux启动服务后，如果在外部浏览器访问不到，这时很可能是因为端口没有开启。

```
$ 将端口加入到防火墙的public区域
firewall-cmd --zone=public --add-port=27017/tcp --permanent

$ 一定要更新防火墙规则
firewall-cmd --reload

$ 查看是否开启
firewall-cmd --zone=public --list-ports

$ 禁用端口
firewall-cmd --zone=public --remove-port=27017/tcp --permanent  # 删除
```

参考：
[20 分钟入门 deno](https://juejin.im/post/5ebcabb2e51d454da74185a9#heading-2)
