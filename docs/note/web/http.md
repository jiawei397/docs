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
