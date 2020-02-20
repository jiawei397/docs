# express代理服务
nodejs和nginx都可以反向代理，解决跨域问题。

## 本地服务

```
const express = require('express')
const app = express()

//如果它在最前面，后面的/开头的都会被拦截
app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'));//静态资源
app.use('/dist', express.static(path.join(__dirname, 'public')));//静态资源

//404
app.use('/test', function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

app.use(function (req, res, next) {
    //TODO 中间件，每个请求都会经过
    next();
});

app.use(function (err, req, res, next) {
    //TODO 失败中间件，请求错误后都会经过
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

app.listen(4000, () => console.log('Example app listening on port 4000!'))
```

## 与request配合使用
这样就将其它服务器的请求代理过来了
```
const request = require('request');
app.use('/base/', function (req, res) {
    let url = 'http://localhost:3000/base' + req.url;
    req.pipe(request(url)).pipe(res);
});
```

## 使用http-proxy-middleware
```
const http_proxy = require('http-proxy-middleware');
const proxy = {
  '/tarsier-dcv/': {
    target: 'http://192.168.1.190:1661'
  },
  '/base/': {
    target: 'http://localhost:8088',
    pathRewrite: {'^/base': '/debug/base'}
  }
};

for (let key in proxy) {
  app.use(key, http_proxy(proxy[key]));
}
```

## 监听本地文件变化
使用nodemon插件。
`--watch test`指监听根目录下test文件夹的所有文件，有变化就会重启服务。
```
"scripts": {
  "server": "nodemon --watch build --watch test src/server.js"
}
```

