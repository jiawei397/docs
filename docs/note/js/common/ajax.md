# ajax常见问题
## ajax成功状态

::: tip 根据返回的状态值status判断
200到300或者304
:::

来一段原始的ajax：

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
