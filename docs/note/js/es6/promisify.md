---
sidebar: false
---
# promisify的实现

## 题目

`nodejs`的异步`api`，都是以下这种规范，最后一个参数是回调函数，回调函数的第1个参数是错误信息，第2个才是返回值
``` js
var fs=require('fs');

fs.readFile('readtxt/demo.txt','utf-8',function(err,data){
    if(err){
        console.error(err);
    }
    else{
        console.log(data);
    }
});
```

请看以下代码，实现`promisify`这个函数，其参数是个`function`，结果也是个`function`，执行后可以得到一个`Promise`。

``` js
var func = promisify(fs.readFile);
func('readtxt/demo.txt','utf-8').then(function(data){
    console.log(data);
}).catch(function(err){

});
```

## 实现

其实现在`nodejs`官方已经有`api`，即`util.promisify`。

``` js
function promisify (original) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      args.push(function (err, ...values) {
        if (err) {
          reject(err);
          return;
        }
        resolve(...values);
      });
      original.apply(this, args);
    });
  };
}
```

es5写法：

``` js
function promisify (original) {
  return function () {
    var args = [].slice.call(arguments);
    return new Promise(function (resolve, reject) {
      args.push(function (err) {
        if (err) {
          reject(err);
          return;
        }
        var arr = [].slice.call(arguments);
        arr.shift();
        resolve.apply(null, arr);
      });
      original.apply(this, args);
    });
  };
}
```
