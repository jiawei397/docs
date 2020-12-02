# ajax常见问题
## ajax成功状态

::: tip 根据返回的状态值status判断
`200`到`300`或者`304`，`304`代表资源没有修改，可以使用缓存 
:::

来一段原始的`ajax`：

``` js
var xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) { //readyState == 4说明请求已完成
    var status = xhr.status;
    if ((status >= 200 && status < 300) || status === 304) {
      console.log(xhr.responseText);
    }
  }
};
xhr.send();
```

但在`axios`中，默认情况下，`304`并不代表成功，会走到下面的`error`中：

``` js
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.error('----', error);
});
```

为什么呢？看了下源码，主要是这段：
``` js
var defaults = {
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
```
校验状态码用的`validateStatus`函数，如果非要使用`304`的话，可以修改配置：
``` js
axios.defaults.validateStatus = function validateStatus(status) {
    return (status >= 200 && status < 300) || status === 304;
};
```
不过，需要注意的是，每个状态码有特殊的含义，在返回`304`状态码的时候，从`response`中取得的`data`为`""`。

## ajax缓存问题

只有`get`请求可能会被浏览器缓存使用。如果不使用缓存，有以下方案：

1. 发送请求前加上
``` js
xhr.setRequestHeader("If-Modified-Since","0")
```
2. 发送请求前加上
``` js
 xhr.setRequestHeader("Cache-Control","no-cache")
```
3. 在URL后面加上一个随机数或时间戳：
``` js
url += "fresh=" + Math.random();
url += "time=" + new Date().getTime();
```

4. 如果是使用jQuery，直接这样就可以了
``` js
$.ajaxSetup({cache:false})。
```

## 封装fetch

<<< @/docs/.vuepress/public/js/fetch.js

## jQuery的ajax请求中contentType与dataType区别

最近遇到一个老项目，有同事在用这两个时候有点儿懵逼，我也有点儿混了，捡起来重新看下。

简单说，区别是：

`contentType`: 告诉服务器，我要`发送`什么类型的数据

`dataType`：告诉服务器，我要`接收`什么类型的数据，如果没有指定，那么会自动推断是返回 XML，还是JSON，还是script，还是String。
从`jQuery`的源码来看，最终`dataType`是设置请求头`Accept`。

## axios防御CSRF攻击

什么是`CSRF`攻击，这里就不详解了，请看[这篇](../../web/CSRF)。

`axios`一个优势就是可以防御它，怎么做到的呢？

主要是在`headers`中添加一个与后台约定的字段，而它的值又是从`cookie`中读取的。它有2个配置项：
```
 xsrfCookieName: 'XSRF-TOKEN', // default
 xsrfHeaderName: 'X-XSRF-TOKEN', // default
```

前者是`cookie`中的`token`字段名称，也就是说，如果`cookie`中有这个字段，就会在接口请求的`headers`中添加一个`xsrfHeaderName`对应的字段（默认是`X-XSRF-TOKEN`），这个字段需要与后台约定好，后台拿到以后就可以进行校验了。

假设我们后台校验的字段名称就叫`token`，一般`cookie`中这个字段也叫`token`，那么只需要修改默认的配置，就可以了：

``` js
axios.defaults.xsrfCookieName = 'token';
axios.defaults.xsrfHeaderName = 'token';
```
