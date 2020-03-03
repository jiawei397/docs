---
sidebar: false
---
# module.exports和exports的区别
`module.exports`和`exports`属于`commonjs`语法的一部分。使用它们可以导出模块内容，在另一个文件里使用`require`引用。

很简单一个例子：

`a.js`文件：

``` js
var sayHello = function(){
  return 'hello';
};
exports.sayHello = sayHello;
exports.name = 'abc';

console.log(module.exports); //{ sayHello: [Function: sayHello], name: 'abc' }
console.log(exports);
console.log(exports === module.exports);//true
```

从这里看出，`module.exports`和`exports`是相等的。其实，`exports`就是`module.exports`的一个引用。这俩是等价的：
``` js
exports.name = 'abc';
module.exports.name = 'abc';
```

`b.js`文件：

``` js
const test = require('./a');
console.log(test);

console.log(test.name); //abc
console.log(test.sayHello()); //hello
```

::: warning
`require`引入的对象，本质上是`module.exports`，而非`exports`。
:::

比如，在`a.js`中添加一句：
``` js {6}
var sayHello = function(){
  return 'hello';
};
exports.sayHello = sayHello;
exports.name = 'abc';
module.exports = sayHello;

console.log(module.exports);  //[Function: sayHello]
console.log(exports); // { sayHello: [Function: sayHello], name: 'abc' }
console.log(exports === module.exports);//false
```

所以，这俩同时存在时，`exports`就会失效，`b.js`文件就会报错。

::: tip
根据经验，代码风格统一使用`module.exports`就好。实在不行，一个文件内只使用一个，不要混用。
:::
