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

## fetch的参数

`fetch`使用方法：
``` js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```
几个重要参数：
### mode
`mode`属性指定请求的模式。可能的取值如下：
- cors：默认值，允许跨域请求。
- same-origin：只允许同源请求。
- no-cors：请求方法只限于 `GET`、`POST` 和 `HEAD`，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求。

### credentials
`credentials`属性指定是否发送`Cookie`。可能的取值如下：

- same-origin：默认值，同源请求时发送 Cookie，跨域请求时不发送。
- include：不管同源请求，还是跨域请求，一律发送 Cookie。
- omit：一律不发送。

跨域请求发送 `Cookie`，需要将`credentials`属性设为`include`。

假设我们不需要`Cookie`传递什么消息，就可以使用`omit`来关闭。

### signal

`signal`属性指定一个 `AbortSignal` 实例，用于取消`fetch()`请求。

`fetch()`请求发送以后，如果中途想要取消，需要使用`AbortController`对象。
``` js
let controller = new AbortController();
let signal = controller.signal;

fetch(url, {
  signal: controller.signal
});

signal.addEventListener('abort', () => console.log('abort!'));

controller.abort(); // 取消
console.log(signal.aborted); // true
```
上面示例中，首先新建 `AbortController` 实例，然后发送`fetch()`请求，配置对象的`signal`属性必须指定接收 `AbortController` 实例发送的信号`controller.signal`。

`controller.abort()`方法用于发出取消信号。这时会触发`abort`事件，这个事件可以监听，也可以通过`controller.signal.aborted`属性判断取消信号是否已经发出。

下面是一个1秒后自动取消请求的例子。

``` js
let controller = new AbortController();
setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/long-operation', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') {
    console.log('Aborted!');
  } else {
    throw err;
  }
}
```
### keepalive

`keepalive`属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据。

一个典型的场景就是，用户离开网页时，脚本向服务器提交一些用户行为的统计信息。这时，如果不用`keepalive`属性，数据可能无法发送，因为浏览器已经把页面卸载了。

``` js
window.onunload = function() {
  fetch('/analytics', {
    method: 'POST',
    body: "statistics",
    keepalive: true
  });
};
```

### redirect

`redirect`属性指定` HTTP `跳转的处理方法。可能的取值如下：

- follow：默认值，fetch()跟随 HTTP 跳转。
- error：如果发生跳转，fetch()就报错。
- manual：fetch()不跟随 HTTP 跳转，但是response.url属性会指向新的 URL，response.redirected属性会变为true，由开发者自己决定后续如何处理跳转。

### integrity

`integrity`属性指定一个哈希值，用于检查` HTTP `回应传回的数据是否等于这个预先设定的哈希值。

比如，下载文件时，检查文件的 `SHA-256` 哈希值是否相符，确保没有被篡改。

``` js
fetch('http://site.com/file', {
  integrity: 'sha256-abcdef'
});
```

### referrer

`referrer`属性用于设定`fetch()`请求的`referer`标头。

这个属性可以为任意字符串，也可以设为空字符串（即不发送`referer`标头）。

``` js
fetch('/page', {
  referrer: ''
});
```

### referrerPolicy

`referrerPolicy`属性用于设定`Referer`标头的规则。可能的取值如下：

- no-referrer-when-downgrade：默认值，总是发送Referer标头，除非从 HTTPS 页面请求 HTTP 资源时不发送。
- no-referrer：不发送Referer标头。
- origin：Referer标头只包含域名，不包含完整的路径。
- origin-when-cross-origin：同源请求Referer标头包含完整的路径，跨域请求只包含域名。
- same-origin：跨域请求不发送Referer，同源请求发送。
- strict-origin：Referer标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送Referer标头。
- strict-origin-when-cross-origin：同源请求时Referer标头包含完整路径，跨域请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头。
- unsafe-url：不管什么情况，总是发送Referer标头。

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



::: tip 本文参考
- 阮一峰[Fetch API 教程](http://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)
:::