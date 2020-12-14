# 队列限流

应用场景类似于在医院排队，假设只有`2`个窗口，怎么实现这样一个函数？

数组中是一个个的函数，函数的执行结果是个`promise`。

## 实现1

思路是递归，在`promise`的`then`函数中递归，继续执行新的函数。

``` js
const seriesFunc = function (arr, num = 2) {
    let len = arr.length;
    if (len <= num) {
        return Promise.all(arr.map(func => func()));
    }
    return new Promise(function (resolve, reject) {
        let limit = 0; //当前执行的数量，达到限制时就停止循环
        let cur = 0; // 当前执行函数的索引
        let count = len;
        // let curRunArr = new Set();
        let callback = function () {
            while (limit >=0 && limit < num && cur < len) {
                // let jilu = cur;
                // curRunArr.add(jilu);
                arr[cur]().then(function () {
                    // curRunArr.delete(jilu);
                    limit--;
                    count--;
                    callback();
                    if (count === 0) {
                        resolve();
                    }
                }, reject);
                limit++;
                cur++;
                // console.log(curRunArr);
            }
        };

        callback();
    });
};
```

测试：
``` js
const sleep = function (time, res) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('------', res, time);
            resolve(res);
        }, time);
    });
};

const pFunc = function (i) {
    return function () {
        return sleep(1000 * Math.abs(5 - i), 'p' + i);
        // return sleep(1000, 'p' + i);
    };
};

const generateArr = function (sum) {
    return Array.from(new Array(sum)).map((_, i) => {
        return pFunc(i);
    });
};

const arr = generateArr(10);

console.time('app');
seriesFunc(arr, 3).then(() => {
    console.log('end');
    console.timeEnd('app');
});

```

## 实现2

有个库`p-limit`，就是为限制并发而生。其源码较短，大致如下：
``` js
const pTry = (fn, ...arguments_) => new Promise(resolve => {
  resolve(fn(...arguments_));
});

const pLimit = concurrency => {
  if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
    return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));
  }

  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.length > 0) {
      queue.shift()();
    }
  };

  const run = (fn, resolve, ...args) => {
    activeCount++;

    const result = pTry(fn, ...args);

    resolve(result);

    result.then(next, next);
  };

  const enqueue = (fn, resolve, ...args) => {
    if (activeCount < concurrency) {
      run(fn, resolve, ...args);
    } else {
      queue.push(run.bind(null, fn, resolve, ...args));
    }
  };

  const generator = (fn, ...args) => {
    return new Promise(resolve => {
      return enqueue(fn, resolve, ...args);
    });
  };
  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount
    },
    pendingCount: {
      get: () => queue.length
    }
  });

  return generator;
};

```

是这样使用的：

``` js
const limit = pLimit(1);

const sleep = function (time) {
  return new Promise((resolve => {
    setTimeout(resolve, time);
  }));
};

const func1 = async function () {
  console.log('---func1');
  await sleep(1000);
};

const func2 = async function () {
  console.log('---func2');
  await sleep(1000);
};

const func3 = async function () {
  console.log('---func3');
  await sleep(1000);
};

const input = [
  limit(func1),
  limit(func2),
  limit(func3),
];

(async () => {
  const result = await Promise.all(input);
  console.log(result);
})();
```