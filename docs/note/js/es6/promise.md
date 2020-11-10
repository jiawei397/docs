# Promise相关
## promisify的实现

### 题目

`nodejs`的异步`api`，都是以下这种规范，最后一个参数是回调函数，回调函数的第1个参数是错误信息，第2个才是返回值
``` js
var fs = require('fs');
fs.readFile('readtxt/demo.txt','utf-8',function(err,data){
    if (err){
        console.error(err);
    } else{
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
    console.error(err);
});
```

### 实现

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

## Promise.race的实现

`race`指的是，有一个`Promise`成功或失败，就会返回它。有个特点，如果传递的参数是空数组的话，返回的`Promise`的状态永远是`pending`。

``` js
Promise.race = function (arr) {
  const Constructor = this; // this 是调用 race 的 Promise 构造器函数。
  if(!Array.isArray(arr)){
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  }
  return new Constructor((resolve, reject) => {
    arr.forEach((promise) => {
      Constructor.resolve(promise) //这是为了防止参数并非Promise处理的
        .then(resolve, reject);
    });
  });
};
```
以下是用例：
``` js
a = function () {
  return new Promise((resolve => {
    setTimeout(function () {
      resolve(20);
    }, 0);
  }));
};

b = function () {
  return new Promise((resolve => {
    setTimeout(function () {
      resolve(200);
    }, 1000);
  }));
};

Promise.race([a(), b()]).then(function (data) {
  console.log(data);
});
```

## Promise.all的实现

`Promise.all`要求所有的`Promise`都成功，有一个失败则返回错误信息。

``` js
Promise.all = function (arr) {
  const Constructor = this;
  if (!Array.isArray(arr)) {
    return Constructor.reject(new TypeError('You must pass an array to all.'));
  }
  let counter = arr.length;
  if (counter === 0) {
    return Constructor.resolve(arr);
  }
  return new Constructor((resolve, reject) => {
    const result = [];
    arr.forEach((promise, i) => {
      Constructor.resolve(promise) //这是为了防止参数并非Promise处理的
        .then((val) => {
          result[i] = val;
          counter--;
          if (counter === 0) {
            resolve(result);
          }
        }, reject);
    });
  });
};
```

以下是用例：
``` js
a = function () {
  return new Promise((resolve => {
    setTimeout(function () {
      resolve(20);
    }, 0);
  }));
};

b = function () {
  return new Promise((resolve => {
    setTimeout(function () {
      resolve(200);
    }, 1000);
  }));
};

c = function () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject('error');
    }, 1000);
  });
};

Promise.all([a(), b(), c()]).then(function (data) {
  console.log(data);
}).catch(console.error);

```
## Promise.any的实现

假设我们需要所有的`Promise`之中，有一个成功的，我就继续后面的处理逻辑。之前的`race`无法满足需求，就轮到`Promise.any`出场了。它是后来加的`API`，兼容性有时候需要考虑。

也就是说，有一个`Promise`成功，就把它返回。
如果没有成功的，则会返回一个[`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)的错误。

大体实现如下：

``` js
Promise.any = function (arr) {
  const Constructor = this;
  if (!Array.isArray(arr)) {
    return Constructor.reject(new TypeError('You must pass an array to any.'));
  }
  return new Constructor((resolve, reject) => {
    const errors = [];
    let counter = arr.length;
    if (counter === 0) { //如果一个都没有，则返回失败
      return reject(errors);
    }
    arr.forEach((promise, i) => {
      Promise.resolve(promise).then(resolve, (err) => {
        counter--;
        errors[i] = err;
        if (counter === 0) {
          // rejects(new AggregateError(errors));
          reject(errors);
        }
      });
    });
  });
};
```

## done的实现
`Promise` 对象的回调链，不管以`then`方法或`catch`方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 `Promise` 内部的错误不会冒泡到全局）。因此，我们可以提供一个`done`方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

用法大概是这样：
``` js
asyncFunc()
  .then(f1)
  .catch(r1)
  .then(f2)
  .done();
```

它的实现也很简单:
``` js
Promise.prototype.done = function(onFullfilled, onRejected){
  this.then(onFullfilled, onRejected).catch((err) => {
    setTimeout(()=> throw err);
  });
};
```
其实，即使没有这个方法，现在浏览器、`nodejs`也会把错误信息显示在控制台的。

## finally的实现
`finally`与`done`类似，区别在于它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。
而且`done`没有返回值，`finally`仍会返回`Promise`实例。

用法大概是这样：
``` js
asyncFunc()
  .then(f1)
  .finally(f2);
```

它的实现也相对简单：
``` js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    (data) => P.resolve(callback()).then(()=> data),
    (err) => P.resolve(callback()).catch(() => { throw err }));
};
```
它与`.then(onFinally, onFinally)`也很像，但为了有返回值，比如`Promise.resolve(2).finally(() => {}) `返回`resolve`的结果`2`，或者`Promise.reject(3).finally(() => {}) `返回`reject`的结果`3`，只能这样处理。

相较于上面的`done`，`finally`方法已经添加到`Promise`的规范里，不少浏览器都支持了，详情可以参考[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)