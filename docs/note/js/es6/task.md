# 一道任务队列的面试题

有这样一道面试题，要求设计`LazyMan`类，实现以下功能：
``` js
LazyMan('Tony');// Hi I am Tony
LazyMan('Tony').sleep(10).eat('lunch');// Hi I am Tony// 等待了 10 秒...// I am eating lunch
LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');// Hi I am Tony// I am eating lunch// 等待了 10 秒...// I am eating diner
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');// Hi I am Tony// 等待了 5 秒...// I am eating lunch// I am eating dinner//等待了 10 秒...// I am eating junk food
```

思路：

1. 链式调用，必须每个方法都返回`this`对象。
2. 第4条其实是信息量最全的，它的打印信息告诉我们，`eat`这个方法不能是同步的，必须是异步队列，不然没法解释先等待5秒，再打印他们的消息。
3. 可以考虑加个任务队列，把`eat`、`sleep`和`sleepFirst`都加入其中，在合适时机，按队列顺序执行即可。而这个时机，可以在构造函数中加到宏任务里。

以下是我的实现：
``` js
class LazyManCls {
    constructor(name) {
        console.log(`Hi I am ${name}!`);
        this.tasks = [];
        this.start();
    }

    /**
     * 启动任务，需要加延时
     */
    start() {
        setTimeout(this.runTask.bind(this));
    }

    async runTask() {
        for (let func of this.tasks) {
            await func();
        }
        // 以下是不使用async/await的方法
        // var p = this.tasks.shift();
        // if (!p) {
        //     return;
        // }
        // Promise.resolve(p()).then(() => {
        //     this.runTask();
        // });
    }

    sleepAction(time) {
        return new Promise((resolve) => {
            setTimeout(function () {
                console.log(`等待了${time}秒...`);
                resolve();
            }, time * 1000);
        });
    }

    sleep(time) {
        this.tasks.push(() => {
            return this.sleepAction(time);
        });
        return this;
    }

    sleepFirst(time) {
        this.tasks.unshift(() => {
            return this.sleepAction(time);
        });
        return this;
    }

    eatAction(food) {
        console.log(`I am eating ${food}.`);
    }

    eat(food) {
        this.tasks.push(() => {
            return this.eatAction(food);
        });
        return this;
    }
}

function LazyMan(name) {
    return new LazyManCls(name);
}
```

这道题目，如果不使用`Promise`的话，就需要在每个方法（`eat`/`sleep`/`sleepFirst`）的最后，添加`next`函数，进行下一步任务，其实就是代码中的`runTask`。

改动部分如下：

``` js
class LazyManCls {
    ...

    runTask() {
        var p = this.tasks.shift();
        if (!p) {
            return;
        }
        p();
    }

    sleepAction(time) {
        setTimeout(() =>{
            console.log(`等待了${time}秒...`);
            this.runTask();
        }, time * 1000);
    }

    eatAction(food) {
        console.log(`I am eating ${food}.`);
        this.runTask();
    }
}
```