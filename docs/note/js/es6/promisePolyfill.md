# 实现一个完全符合规范的Promise

从网上看了太多名为《手把手教你写个`Promise`》的教程，内容大同小异。
几乎都有一个缺点，没有把微任务加上，都是用`setTimeout`处理的异步，虽然[`Promise A+`规范](https://github.com/promises-aplus/promises-spec)并没有要求这个，但像浏览器、`nodejs`都把`Promise`当作微任务中的一种，所以我们需要模拟下。

怎么模拟微任务呢？

浏览器中有个`MutationObserver`，`nodejs`中可以使用`process.nextTick`，这俩都没有的时候，再回退到`setTimeout`。这才是正确的实现姿势。

先占个坑，这是代码实现：

<<< @/docs/.vuepress/public/js/promise.js