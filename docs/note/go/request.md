# 记一次并发请求报错

背景是要做一个类似爬虫的功能，从第3方网站下载资源。首先有个函数判断是否url地址有效，所以需要请求一遍。
本地测试没有问题，但上线后，概率性地出现一个错误：
```
write: connection reset by peer
```

上网一查，这错还是比较常见的，加上关键字`go`搜索下，也有不少。

## close大法

首先看的是这篇[Go 解决"Connection reset by peer"或"EOF"问题](https://studygolang.com/articles/9190)

上面说：

::: tip go 
在解决问题之前需要了解关于go是如何实现connection的一些背景小知识：

有两个协程，一个用于读，一个用于写（就是`readLoop`和`writeLoop`）。在大多数情况下，`readLoop`会检测`socket`是否关闭，并适时关闭`connection`。如果一个新请求在`readLoop`检测到关闭之前就到来了，那么就会产生`EOF`错误并中断执行，而不是去关闭前一个请求。

这里也是如此，我执行时建立一个新的连接，这段程序执行完成后退出，再次打开执行时服务器并不知道我已经关闭了连接，所以提示连接被重置；如果我不退出程序而使用for循环多次发送时，旧连接未关闭，新连接却到来，会报`EOF`。
:::

提出的解决方案是对 req 增加属性设置：
```
req.Close = true
```
它会阻止连接被重用，可以有效的防止这个问题，也就是Http的短连接

该博主问题与我的类似，于是我写了个小例子来测试，代码如下：

<<< @/docs/.vuepress/public/go/conn.go

其中，`IsUrlOk`与`IsUrlOk2`的区别是前者是我旧的请求代码，后者是加了`Close`后的代码。

并发量设置为`100`，但依然会偶现上面的错误，尤其是在运行结束后，立即再次运行。

将并发量设置为`500`后，复现的概率就大大增加了。

## TCP握手

在头疼之际，找到了另一篇文章[记一次压测问题定位：connection reset by peer，TCP三次握手后服务端发送RST](http://www.coder55.com/article/6791)

为了方便，我把文章主要内容扒来：

### 问题定位以及原因

`connection reset by peer`的含义是往对端写数据的时候，对端提示已经关闭了连接。一般往一个已经被关闭的`socket`写会提示这个错误。但是通过log分析，服务端没有应用层面的`close`，客户端也没有应用层面的`write`。抓包发现客户端建立`TCP`完成3次握手后，服务端立刻就回了`RST`，关闭了连接。`RST`的情况见的多，这种情况着实没有遇到过。最后N次`baidu google`，终于找到答案。

### TCP三次握手后服务端直接RST的真相

内核中处理`TCP`连接时维护着两个队列:`SYN`队列和`ACCEPT`队列，如上图所示，服务端在建立连接过程中内核的处理过程如下：

1. 客户端使用connect调用向服务端发起TCP连接，内核将此连接信息放入SYN队列，返回SYN-ACK
2. 服务端内核收到客户端的ACK后，将此连接从SYN队列中取出，放入ACCEPT队列
3. 服务端使用accept调用将连接从ACCEPT队列中取出

上述抓包说明，3次握手已经完成。但是应用层accept并没有返回，说明问题出在`ACCEPT`队列中。

那么什么情况下，内核准确的说应该是TCP协议栈会在三次握手完成后发RST呢？
原因就是ACCEPT队列满了，上述（2）中，服务端内核收到客户端的ACK后将连接放入ACCEPT队列失败，就有可能回RST拒绝连接。

进一步来看Linux协议栈的一些逻辑：

::: tip Linux协议栈的一些逻辑
SYN队列和ACCEPT队列的长度是有限制的，SYN队列长度由内核参数`tcp_max_syn_backlog`决定，ACCEPT队列长度可以在调用`listen(backlog)`通过backlog，但总最大值受到内核参数`somaxconn(/proc/sys/net/core/somaxconn)`限制。

若SYN队列满了，新的SYN包会被直接丢弃。
若ACCEPT队列满了，建立成功的连接不会从SYN队列中移除，同时也不会拒绝新的连接，这会加剧SYN队列的增长，最终会导致SYN队列的溢出。

当ACCEPT队列溢出之后，只要打开`tcp_abort_on_flow`内核参数(默认为0，关闭)，建立连接后直接回RST，拒绝连接(可以通过`/proc/net/netstat`中`ListenOverflows`和`ListenDrops`查看拒绝的数目)。
:::

所以真相找到了：就是ACCEPT队列溢出了导致TCP三次握手后服务端发送RST。

我压测的时候起`500`个`goruntine`，同时跟服务端建立`HTTP`连接，可能导致了服务端的`ACCEPT`队列溢出。这里之所以用可能，是因为并没有找到证据，只是理论上分析。但是验证这个问题简单：修改一下内核参数`somaxconn`。

果然，用以下方法修改后，500个也不会再报错了。

```
echo 10000 >/proc/sys/net/core/somaxconn
```

## 永久修改somaxconn

修改`/proc/sys/net/core/somaxconn`后，重启后保存不了

在`/etc/sysctl.conf`中添加如下
```
net.core.somaxconn = 2048
```
然后在终端中执行
```
sysctl -p
```