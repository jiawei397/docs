<!-- https://www.zhihu.com/question/302412059?sort=created -->
# 网络相关笔记
## 避免浏览器自动播放文件
有时对于图片、视频，浏览器会视能力，自动为用户显示或播放。这主要是由于Web服务器在返回文件本身数据的同时，返回了一些特殊的MIME类型，
比如：`image/jpeg`（JPEG图像）,`application/pdf`（PDF文档）,`video/mpeg`（MPEG动画）。
这些`MIMIE`类型实际上是告诉浏览器，文件数据到底是什么，这样浏览器就能更好的为用户展示数据。
现在像图片、`pdf`、甚至是视频基本都是可以直接在浏览器中展示和播放的。
但是有时，我们需要浏览器为用户下载文件而不是直接播放，
而`Nginx`在默认配置下，会根据文件的后缀来匹配相应的`MIME`类型，并写入`Response header`，导致浏览器播放文件而不是下载，
这时需要通过配置让`Nginx`返回的`MIME`类型为下面这个类型：

`application/octet-stream`

这个类型会让浏览器认为响应是普通的文件流，并提示用户下载文件。可以通过在`Nginx`的配置文件中做如下配置达到这样的目的：

```
location /download/ {
    types        { }
    default_type application/octet-stream;
}
```
这样当`Url`路径中包含`/download/`时，`MIME`类型会被重置为`application/octet-stream`。
另外，`nginx`自带的`MIME`类型映射表保存在`conf/mime.types`中。

在`express`中返回头设置这个格式，就可以文件下载：

``` js
app.use('/test', function (req, res, next) {
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': "attachment; filename=test.txt"
  });
  res.send('Hello test!');
});
```
其中，`Content-Disposition`可以设置文件名称。

当然，也可以这样写：
``` js
app.use('/test', function (req, res, next) {
  res.type('application/octet-stream');
  res.attachment('abc.txt');
  res.send('Hello test!');
});
```

## http协议不同版本

### http1.1
`HTTP/1.1` 为网络效率做了大量的优化，最核心的有如下三种方式：
- 增加了持久连接；
- 浏览器为每个域名最多同时维护 6 个 `TCP` 持久连接；
- 使用 `CDN` 的实现域名分片机制。

引入了 `CDN`，并同时为每个域名维护 **6** 个连接，这样就大大减轻了整个资源的下载时间。

这里我们可以简单计算下：如果使用单个 `TCP` 的持久连接，下载 100 个资源所花费的时间为 `100 * n * RTT`；若通过上面的技术，就可以把整个时间缩短为 `100 * n * RTT/(6 * CDN 个数)`。从这个计算结果来看，我们的页面加载速度变快了不少。

**影响 HTTP/1.1 效率**的三个主要因素：
1. TCP 的慢启动
2. 多条 TCP 连接竞争带宽
3. 队头阻塞

### http2.0
`HTTP/2` 采用**多路复用**机制来解决以上`1.1`的问题。

多路复用是通过在协议栈中添加**二进制分帧层**来实现的。有了二进制分帧层还能够实现*请求的优先级*、*服务器推送*、*头部压缩*等特性，从而大大提升了文件传输效率。

它可以通过一个 TCP 连接来发送多个 URL 请求，能充分利用带宽。在 HTTP/1.1 时代，为了提升并行下载效率，浏览器为每个域名维护了 6 个 TCP 连接；而采用 HTTP/2 之后，浏览器只需要为每个域名维护 1 个 TCP 持久连接，同时还解决了 HTTP/1.1 **队头阻塞**的问题。

一个域名只使用一个 TCP 长连接和消除队头阻塞问题

**缺陷**：
- 队头阻塞。虽然解决了应用层面的阻塞，但tcp本身的丢包阻塞没有办法防止。有测试数据表明，当系统达到了 2% 的丢包率时，HTTP/1.1 的传输效率反而比 HTTP/2 表现得更好。
- TCP 建立连接的延时。网络延迟又称为 `RTT`（`Round Trip Time`）。我们把从浏览器发送一个数据包到服务器，再从服务器返回数据包到浏览器的整个往返时间称为 `RTT`。`RTT`是反映网络性能的一个重要指标。在传输数据之前，我们需要花掉 3～4 个 `RTT`。
- TCP 协议僵化。第一个是中间设备的僵化。另一个是操作系统。

### http3.0
`HTTP/3` 基于**UDP**实现了类似于` TCP `的**多路数据流**、**传输可靠性**等功能，我们把这套功能称为**QUIC协议**。

- 实现了类似 `TCP` 的流量控制、传输可靠性的功能
- 集成了 `TLS` 加密功能。减少了握手花费的RTT个数。
- 实现了 `HTTP/2` 中的多路复用功能。
- 实现了快速握手功能

**问题**：
- 服务器和浏览器支持情况。
- 系统内核对`UDP`优化不足。
- 中间设备僵化，这些设备对 `UDP` 的优化程度远远低于`TCP`，据统计使用`QUIC`协议时，大约有 *3%～7%* 的丢包率。