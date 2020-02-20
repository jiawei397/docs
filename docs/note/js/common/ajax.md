---
sidebar: false
---
# ajax成功状态

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
