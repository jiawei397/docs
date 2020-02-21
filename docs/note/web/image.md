---
sidebar: false
---
# 默认图片

经常有这个需求，如果图片加载失败，要有一个默认图片。

``` html
<img src="{{image}}" onerror="showDefaultImage(this)" />
```

``` js
showDefaultImage = function (dom) {
  dom.src = '/1.jpg';
  dom.onerror = null;
};
```

::: tip 如果能提前确认src无效
最好直接将它替换为默认图片，以减少一次网络请求
:::
