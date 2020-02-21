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
