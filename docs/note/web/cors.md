# 常用跨域解决方案

什么是跨域？

简单来说，就是非同源（同协议、同ip、同端口、同域名）的资源请求，就是跨域。它主要是针对浏览器的，服务器之间不存在跨域问题。

## CORS
`CORS`，全称`Cross-Origin Resource Sharing`，是一种允许当前域（`domain`）的资源（比如`html/js/web service`）被其他域（`domain`）的脚本请求访问的机制。通常由于同域安全策略（`the same-origin security policy`）浏览器会禁止这种跨域请求。
::: tip 优势
只需要后台修改，前端不需要做任何操作
:::

这时需要后台设置请求头。以`nodejs`为例：
```
res.header('Access-Control-Allow-Origin', '*');
```
::: danger
`*`代表所有域都可以访问这个资源，生产环境上，可以设置为具体`ip`地址。
:::

## document.domain

对于已经有成熟产品体系的公司来说，不同的页面可能放在不同的服务器上，这些服务器域名不同，但是拥有相同的上级域名，比如`id.qq.com`、`www.qq.com`、`user.qzone.qq.com`，它们都有公共的上级域名`qq.com`。这些页面之间的跨域访问可以通过`document.domain`来进行。

默认情况下，`document.domain`存放的是载入文档的服务器的主机名，可以手动设置这个属性，不过是有限制的，只能设置成当前域名或者上级的域名，并且必须要包含一个`.`号，也就是说不能直接设置成顶级域名。例如：`id.qq.com`，可以设置成`qq.com`，但是不能设置成`com`。

具有相同`document.domain`的页面，就相当于是处在同域名的服务器上，如果协议和端口号也是一致，那它们之间就可以跨域访问数据。

详情可以参考这篇文章：[通过document.domain实现跨域访问](https://blog.csdn.net/nlznlz/article/details/79506655)

::: warning 缺点
有些浏览器不支持，当然是说IE啦。

只适用于不同子域的框架间的交互。
:::

## 跨文档消息
跨文档消息则是通过向`Window`实例发送消息来完成的。

在使用时，软件开发人员需要通过调用`Window`的`postMessage()`函数来向该`Window`实例发送消息。此时`Window`实例内部的`onmessage`事件将被触发，进而使得该事件的消息处理函数被调用。

但是在接收到消息的时候，消息处理函数首先需要判断消息来源的合法性，以避免恶意用户通过发送消息的方式来非法执行代码。

## JSONP
`JSONP`则是通过在文档中嵌入一个`<script>`标记来从另一个域中返回数据。

::: warning 缺点
只支持`get`请求。
:::

## 代理

利用服务器不会跨域的原理，使用`nginx`、`nodejs`等进行代理，将前后台资源统一在一个域下，就可以实现同源。

`nodejs`可以参考这一篇：[express代理服务](../js/nodejs/express)
