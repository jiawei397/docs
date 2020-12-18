# 实现一个完全符合规范的Promise

从网上看了太多名为《手把手教你写个`Promise`》的教程，内容大同小异。
几乎都有一个缺点，没有把微任务加上，都是用`setTimeout`处理的异步，虽然[`Promise A+`规范](https://github.com/promises-aplus/promises-spec)并没有要求这个，但像浏览器、`nodejs`都把`Promise`当作微任务中的一种，所以我们需要模拟下。

此节暂时按下不表。

我们一点点来。

## 简单实现

先看下`promise`的例子：
``` js
aa = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'ok');
});
aa.then((res) => console.log(res));

bb = new Promise((resolve, reject) => {
    setTimeout(reject, 100, 'error');
});
bb.catch((err) => console.error(err));

Promise.resolve(123).then(function(){
    return Promise.resolve(456);
}).then(function(res){
    console.log(res); //打印456
});
```

一般来说，我们只需要知道以下几点，就差不多了。

1.  `Promise`构造函数的参数是个函数，这个函数又显式地要求有2个参数`resolve`和`reject`方法，分别对应成功或者失败的函数

2. 每个`Promise`实例是可以用`.then`或者`.catch`链式调用，而每次调用，其实都不是它自己了，都会返回一个新的`Promise`实例

3. `.then`方法有2个函数作为参数，分别对应成功处理和失败处理

4. 一个实例有3种状态（进行中（`pending`）、成功（`fulfilled`）、失败（`rejected`）)，成功或失败后就不能再更改状态了

 > 参见以下这种情况，先resolve了，但后面发生异常，依然是成功状态。
  ``` js
  new Promise((resolve, reject) => {
        resolve('111');       
        throw new Error('err');
    })
  }.then(function(){
    console.log('--ok--'); //打印此句
  }).catch(function(){
    console.log('-------err--')
  });
  ```

其细节颇多，要完整符合规范并不容易，我这里也先写个简单的。

在写之前，我们需要思考下难点在哪里。

我们知道，`Promise`的出现，是为了解决前端异步回调的痛点，它的每次`.then`，都是异步的操作。但在`js`里，我们`.then`的时候，其实是执行了一个对象的`then`方法，这是个同步的操作。

也就是说，`then`方法中的代码，肯定不能立即执行，必须得缓存起来，在合适的时机再执行它。

而什么时候执行呢？代码中显式调用`resolve`或`reject`以后，就可以执行了。

一般来说，有2种延时方案：
一种是在`resolve`或者`reject`执行时，进行延时；
一种是在`.then`方法里，执行对应的函数时进行延时。

2种都能实现大致功能，但前者在完全符合规范编写过程中遇坑不少，这里我们选择第二种。

### 步骤一：初始化构造函数
先定义3种状态：

``` js
const PENDING = 'pending'; //进行中
const FULFILLED = 'fulfilled'; //成功
const REJECTED = 'rejected'; //失败
```

再写构造函数，内置3个属性——状态`status`、成功返回值`value`、失败原因`reason`。把`resolve`和`reject`这两个内置函数作为`fn`的参数执行，它俩的责任就是改变当前`promise`的状态值。
``` js
class Promise {
    constructor(fn) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        const resolve = (val) => {
            if (this.status !== PENDING) { // 参见第4条，状态变化后就不能再修改了
                return;
            }
            this.status = FULFILLED;
            this.value = val;
            //todo
        };

        const reject = (err) => {
            if (this.status !== PENDING) { // 参见第4条，状态变化后就不能再修改了。
                return;
            }
            this.status = REJECTED;
            this.reason = err;
            //todo
        };
        try {
            fn(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
}
```
### 步骤二：实现then方法

从第2条和第3条可知，`then`方法需要返回一个新的`Promise`，且要异步处理。怎么异步处理呢？上面提到，需要把`then`的这两个参数缓存起来，于是我们把它们分别存到2个数组中。

为什么用数组，而不是普通变量呢？我开始也困惑了好久，后来想到，有这样一种使用场景：
``` js
a = Promise.resolve(123);
a.then(console.log);
a.then(console.error);
```
上述一个`promise`会在不同的地方`.then`执行，显然，两个回调函数应该一前一后执行，而不是丢失某一个。

所以，我们在构造函数中添加2个数组：
``` js
 constructor(fn) {
    ...
    this.onFulfilledList = [];
    this.onRejectedList = [];
    ...
 }
```
继而在`then`中，在状态为`pending`时，把需要延时处理的函数推送到这俩数组中。

需要注意的是，对于`then`传递的这俩参数，如果在需要的时候它不是函数，则会忽略不计，把当前`promise`的状态传递到下一个。

``` js
then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
        const onResolvedFunc = function (val) {
            const cb = function () {
                try {
                    if (typeof onFulfilled !== 'function') { // 如果成功了，它不是个函数，意味着不能处理，则把当前Promise的状态继续向后传递
                        resolve(val);
                        return;
                    }
                    const x = onFulfilled(val);
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            };
            setTimeout(cb, 0);
        };

        const onRejectedFunc = function (err) {
            const cb = function () {
                try {
                    if (typeof onRejected !== 'function') { // 如果失败了，它不是个函数，意味着不能处理，则把当前Promise的状态继续向后传递
                        reject(err);
                        return;
                    }
                    const x = onRejected(err);
                    resolve(x); //处理了失败，则意味着要返回的新的promise状态是成功的
                } catch (e) {
                    reject(e);
                }
            };
            setTimeout(cb, 0);
        };

        if (this.status === PENDING) {
            this.onFulfilledList.push(onResolvedFunc);
            this.onRejectedList.push(onRejectedFunc);
        } else if (this.status === FULFILLED) {
            //todo
        } else {
            //todo
        }
    });
}
```

下来就是在构造函数的`resolve`和`reject`中执行我们缓存的函数。
``` js
constructor(fn) {
    ...
    const resolve = (val) => {
        ...
        this.onFulfilledList.forEach((cb) => cb && cb.call(this, val));
        this.onFulfilledList = [];
    };

    const reject = (err) => {
        ...
        this.onRejectedList.forEach((cb) => cb && cb.call(this, err));
        this.onRejectedList = [];
    };
    ...
}
```

现在，下面的例子应该可以成功了：
``` js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('111');
    }, 0);
}).then(function () {
    console.log('--ok--')
});
```

但去掉延时（`setTimeout`）就会失败。分析下原因就明白了，我们在调用`resolve`时就改变了`status`，走到`then`方法时，状态已经变为成功了。所以我们需要在状态已经变为成功或失败时，直接调用回调函数，而不是依赖`resolve`或`reject`触发：
``` js
then(onFulfilled, onRejected) {
    ...
    if (this.status === PENDING) {
        ...
    } else if (this.status === FULFILLED) { 
        onResolvedFunc(this.value);
    } else { // if(this.status === REJECTED) { //如果这个Promise已经失败，说明已经reject过了，不能再依赖reject来触发，就直接执行失败处理。
        onRejectedFunc(this.reason);
    }
}
```

这样，下面的代码就`ok`了：
``` js
new Promise((resolve, reject) => {
    resolve('111');
}).then(function () {
    console.log('--ok--')
});
```

### 步骤三：实现catch

`catch`的实现很简单，就是个`then`的语法糖：
``` js
catch(onRejected) {
    return this.then(null, onRejected);
}
```

### 步骤四：模拟微任务

按理说`promise`的主要功能已经实现了，但下面的代码就会暴露一个问题：
``` js
setTimeout(function(){
    console.log('---timeout--')
});
new Promise((resolve, reject) => {
    resolve('111');
}).then(function () {
    console.log('--ok--')
});
console.log('--log--');   
```
会先打印`log`，这是正常的，再打印`timeout`，最后打印`ok`。这就违反了微任务优先的原则，毕竟它是`VIP`啊。

怎么做呢？

浏览器中有个`MutationObserver`，`nodejs`中可以使用`process.nextTick`，这俩都没有的时候，再回退到`setTimeout`。这才是正确的实现姿势。

为了图方便，我照抄了`vue`的`nextTick`中的代码，具体可见[这里](../../vue/nextTick)。

``` js
const isInBrowser = typeof window !== 'undefined';
const nextTick = function(nextTickHandler) {
    if (isInBrowser) {
        if (typeof MutationObserver !== 'undefined') { // 首选 MutationObserver 
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler); // 声明 MO 和回调函数
            var textNode = document.createTextNode(counter);
            observer.observe(textNode, { // 监听 textNode 这个文本节点
                characterData: true // 一旦文本改变则触发回调函数 nextTickHandler
            });
            const start = function () {
                counter = (counter + 1) % 2; // 每次执行 timeFunc 都会让文本在 1 和 0 间切换
                textNode.data = counter;
            };
            start();
        } else {
            setTimeout(nextTickHandler, 0);
        }
    } else {
        process.nextTick(nextTickHandler);
    }
};
```

再把`then`方法中`setTimeout`换成`nextTick`就可以了。

## 完整实现

怎么能完全符合规范呢？有个检查工具：`promises-aplus-tests`， 在`npm`中安装一下，再在`script`标签中使用：
```
"test": "promises-aplus-tests src/promise.js --reporter spec"
```
需要你的`promise.js`用`module.exports`导出，再在内部实现一个`deferred`方法：
``` js
static deferred() {
    let result = {};
    result.promise = new Promise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
}
```

接下来就能执行所有的测试用例了。

还有些额外的方法实现，不在这里展现了，可以看[这篇](./promise)。

具体细节就不再补充了。以下是完整代码实现：

<<< @/docs/.vuepress/public/js/promise.js