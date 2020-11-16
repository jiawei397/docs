# 防抖与节流

`js`中经常有防抖与节流的需求，这俩到底有什么区别呢？

很简单，防抖就是单位时间（比如100秒）内，某个行为（函数）只执行最后一次。

节流呢，从语义上讲很容易理解，就是水龙头放水嘛，一次放一点，单位时间（比如100秒）内让我再放，我是不放的，等这个单位时间到了，还让我放，我再放一次。也就是说，函数会隔一段时间执行一次。

## 防抖

防抖有什么使用场景？

比如根据用户的输入实时向服务器发`ajax`请求获取数据，用户的输入是很快的，但要输入完成，明显需要最后一次。

实现很简单，加个延时，如果延时方法还没到，又进行了调用，则把原来的延时清除，再进行新一轮的延时。

``` js
const debounce = function (fn, delay) {
    var timeId = null;
    return function (...args) {
        if (timeId) {
            clearTimeout(timeId);
        }
        timeId = setTimeout(() => {
            fn.apply(this, args);
            timeId = null;
        }, delay);
    };
};
```

以下是测试：
``` js
var func = function () {
    console.log('----func------')
}
var func2 = function () {
    console.log('----func2------')
}

let t1 = debounce(func, 100);
let t2 = debounce(func2, 20);
var run = function () {
    Array.from(new Array(10)).forEach((_, i) => {
        setTimeout(t1, i * 10);
        setTimeout(t2, i * 10);
    });
};
run();
```

## 节流

节流有什么使用场景？

一般是鼠标移动、滚轮等事件处理，如果每个回调函数都执行，那明显太浪费了，可以隔段时间执行一遍。

### 实现1
思路是加控制，延时函数没有执行前，就不执行。

``` js
const throttle = function (fn, delay) {
    var canRun = true;
    return function (...args) {
        if (!canRun) {
            return;
        }
        canRun = false;
        setTimeout(() => {
            fn.apply(this, args);
            canRun = true;
        }, delay);
    };
};
```
::: tip 特点
1. 这是尾执行，第一次不会立即执行，是有延时的。
2. 原函数的执行是放到宏任务队列中了，真正的执行时间不确定。
:::

### 实现2

思路是计时，函数第一次会立执行；但间隔时间不到，是不会执行的。
``` js
const throttle = function (fn, delay) {
    var last = null;
    return function (...args) {
        var canRun = false;
        var now = Date.now();
        if (!last || now - last >= delay) {
            last = now;
            canRun = true;
        }
        if (!canRun) {
            return;
        }
        fn.apply(this, args);
    };
};
```
::: tip 特点
这是头执行，第一次会立即执行。
:::

以下是测试：
``` js
var func = function () {
    console.log('----func------')
}
var func2 = function () {
    console.log('----func2------')
}

let t1 = throttle(func, 100);
let t2 = throttle(func2, 50);
var run = function () {
    Array.from(new Array(10)).forEach((_, i) => {
        setTimeout(t1, i * 10);
        setTimeout(t2, i * 10);
    });
};
run();
```
