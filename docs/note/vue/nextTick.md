# vue中nextTick的实现原理
`vue`中有一个较为特殊的`API`——`nextTick`。它是干什么的呢？听名字，跟`nodejs`的`process.nextTick`（一个微任务）很像，是不是一回事呢？

根据[官方文档](https://cn.vuejs.org/v2/api/index.html#Vue-nextTick)的解释，在下次`DOM`更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的`DOM`。

用法如下：
``` js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增)
Vue.nextTick()
  .then(function () {
    // DOM 更新了
  })
```

`Vue`在更新`DOM`时是异步执行的。只要侦听到数据变化，`Vue` 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 `watcher` 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和`DOM`操作是非常重要的。然后，在下一个的事件循环`tick`中，`Vue` 刷新队列并执行实际 (已去重的) 工作。

::: tip 画重点
`Vue` 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替。
:::

例如，当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环`tick`中更新。多数情况我们不需要关心这个过程，但是如果你想基于更新后的 `DOM` 状态来做点什么，这就可能会有些棘手。为了在数据变化之后等待 `Vue` 完成更新 `DOM`，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。这样回调函数将在 `DOM` 更新完成后被调用。

也就是说，`Vue.nextTick`就是希望在`DOM`更新后，尽可能早地调用传递的回调函数`callback`。这时，微任务就是一个最佳的选择。

## 源码
在这个普遍需要考察原理的年代，不考究一下就混不下去了。我们来看下源码：

<<< @/docs/.vuepress/public/js/next-tick.js

## 探案
`vue`为什么要这样处理呢？

一步步来，假设我们是有`Promise`也传递了`callback`的情况，代码会是这样的：
``` js
const p = Promise.resolve();
const timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
};
const callbacks = [];
let pending = false;

function flushCallbacks () {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

function nextTick (cb, ctx) {
  callbacks.push(() => {
    try {
        cb.call(ctx);
    } catch (e) {
        handleError(e, ctx, 'nextTick');
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
```
这下逻辑就很清晰了，调用`nextTick`时会处理把`callback`推送到`callbacks`这个数组里，也就是维护了一个函数队列。这个队列什么时候执行呢？

如果当前处于可执行状态（`!pending`），则执行`timerFunc`，后者通过`Promise.resolve`的`.then`把`flushCallbacks`推到了微任务队列中，延时执行。

这个函数是要更新`DOM`后调用，为什么要推到微任务里呢？

我们知道
- 微任务有：`Promise`、`MutationObserver`以及`process.nextTick`(Node 独有)
- 宏任务有：`setTimeout`、`setInterval`、`setImmediate` (Node 独有)、`requestAnimationFrame` (浏览器独有)、`I/O`、`UI rendering` (浏览器独有)、 `ajax`、`eventListener`

每次事件循环（`Event Loop`）都有微任务和宏任务这两个队列。

代码在主线程（`JS引擎线程`）执行，如果遇到宏任务的异步操作，则会将它们的回调函数推到宏任务队列中；如果遇到微任务的异步操作，则将它们的回调函数推到微任务队列中。

事件循环先执行`微任务`，如果执行过程中遇到新的`微任务`，也会将它入栈，在这一周期内执行；再执行`宏任务`，结束后就开启下次的事件循环。

`vue`在数据变化后，维护了一个队列，相当于做了延迟，那么它什么时候进行渲染`DOM`操作的呢？

``` js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```
> 划重点，从上面看出，异步的队列也是使用了`nextTick`函数。

所以，这个函数是微任务还是宏任务，**其实都无所谓，甚至同步异步都无所谓**。只要我们要操作`DOM`的回调函数放在数据变更之后就可以。

::: warning
一定要把`nextTick`调用放在数据变更之后，以下情况是得不到变更后的`DOM`的：
``` js
Vue.nextTick(()=>{
  console.log(document.querySelector('h1').innerText);
});
this.msg = 'hello';
```
:::

而微任务明显要快一些，所以`vue`源码中在没有`Promise`的情况下，依次判断`MutationObserver`、`setImmediate`（它虽然也是宏任务，但要比`setTimeout`快一点，有时候测试并不能每次都保障这一点，可能与`nodejs`版本有关），这俩都满足不了，就只能将就使用`setTimeout`了。

::: tip 上面代码setTimeout的作用
上面有句代码：`if (isIOS) setTimeout(noop);`

官方解释的意思是在`ios`环境下，可能会有种`bug`，虽然推到微任务队列中，但代码并不执行，需要用`setTimeout`强制刷新下。
:::

## 总结

综上所述，`vue`的`nextTick`方法的实现原理：

1. `vue`用异步队列的方式来控制`DOM`更新和`nextTick`回调先后执行
2. `microtask`（微任务）因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕
3. 因为浏览器和移动端兼容问题，`vue`不得不做了`microtask`向`macrotask`（宏任务）的兼容(降级)方案

参考资料：
- [vue中$nextTick的用法](https://www.cnblogs.com/chaoyuehedy/p/8985425.html)
- [异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)
- [Javascript Event Loop (浏览器端及node)](https://juejin.cn/post/6844904118494969864#heading-7)