# 组合API

## 概念

其实就是把任务队列的函数，组合成一个函数调用。

比如有函数A、函数B，B的参数是A的执行结果，平时我们写法是这样的：`B(A())`，是不是不够优雅？你可能并不这么觉得，那么再加上五六个函数呢，得嵌套多少层？

这时组合API的作用就来了，它可以这样封装一个函数：

``` js
var func = compose(D, C, B, A);
// var func = compose(A, B, C, D);
func('abc')
```
参数的顺序是向左向右无所谓，统一就好。

## 实现
实现也很简单，可以使用数组的`reduce`：

``` js
function compose(...fns) {
    return function (...args) {
        return fns.reduce(function (preItem, curFn, index) {
            if (index === 0) {
                return curFn(...preItem);
            }
            return curFn(preItem);
        }, args);
    };
}
```

我这个实现，是从左往右执行的，下面这个是从右往左执行：
``` js
function composeRight(...fns) {
    return function (...args) {
        var len = fns.length;
        return fns.reduceRight(function (preItem, curFn, index) {
            if (index === len - 1) {
                return curFn(...preItem);
            }
            return curFn(preItem);
        }, args);
    };
}
```

测试：

``` js
var toLower = function (str) {
    return str.toLowerCase();
};

var subStr = function (str) {
    return str.substr(5);
};

var addStr = function (str) {
    return 'xxx-' + str;
}

var composedFun = compose(subStr, addStr, toLower);
// var composedFun = composeRight(toLower, addStr, subStr);

var res = composedFun('FIFISISDDJFIFDAfjdjsjjs');
console.log(res);
```