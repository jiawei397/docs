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
这下逻辑就很清晰了，调用`nextTick`时会处理把`callback`推送到`callbacks`这个数组里，也就是给维护了一个函数队列。这个队列什么时候执行呢？

如果当前处于可执行状态（`!pending`），则执行`timerFunc`，后者通过`Promise.resolve`的`.then`把`flushCallbacks`推到了微任务队列中，延时执行。

这个函数是要更新`DOM`后调用，为什么要推到微任务里呢？

我们知道
- 微任务有：Promise、MutationObserver，以及nodejs中的process.nextTick
- 宏任务有：setTimeout, setInterval, setImmediate, I/O, ajax，eventListener，UI rendering

每次事件循环（`Event Loop`）都有微任务和宏任务这两个队列，先执行微任务队列中的函数，再执行宏任务中的函数，然后开启下一次的事件循环。在执行`微任务`的过程中后加入下次队列的微任务，也会在下一次事件循环之前被执行。可见，前者是VIP，后者是普通用户。

在事件循环的最后，会有一个`UI rendering`，也就是更新`DOM`。我们要做的是当前事件循环处理完成后，再执行`callback`就可以完成需求，代码中`Promise.resolve`再`.then`的作用就是把回调函数放到了下次事件循环的微任务中，当当前事件最后更新完`DOM`后，就会最快时间调用`callback`，访问到更新后的`DOM`。

从上面的分析可知，只要是微任务就可以，所以`vue`源码中在没有`Promise`的情况下，依次判断`MutationObserver`、`setImmediate`，这俩都满足不了，就只能使用宏任务`setTimeout`了。显然，宏任务要慢一些。

::: tip 上面代码setTimeout的作用
上面有句代码：`if (isIOS) setTimeout(noop);`

官方解释的意思是在`ios`环境下，可能会有种`bug`，虽然推到微任务队列中，但代码并不执行，需要用`setTimeout`强制刷新下。
:::

## 总结

综上所述，`vue`的`nextTick`方法的实现原理：

1. `vue`用异步队列的方式来控制`DOM`更新和`nextTick`回调先后执行
2. `microtask`（微任务）因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕
3. 因为浏览器和移动端兼容问题，`vue`不得不做了`microtask`向`macrotask`（宏任务）的兼容(降级)方案

