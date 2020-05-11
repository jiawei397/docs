# 虚拟沙箱

产品中有这样的需求，有一段页面上手写的`js`脚本，在服务器（用的`nodejs`）运行。怎么才能防止安全问题？

我们知道，这种脚本必然是某个函数或函数中的部分内容，要运行它的话，只能是利用`eval`执行，或者它的变种：

``` js
eval = function (data) {
    var Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + data)();
};
```

它本身是不安全的，避免不了恶意代码的注入，所以平时我们工作中都避免使用`eval`。

比如：

``` js
var result = eval(`(
  function doSomething(name) {
    global.x = 10;
    name += '-abc';
    age = 12;
    return name;
  }
)`);
console.log(result); //是函数doSomething [Function: doSomething]
console.log(result('aa')); // aa-abc
console.log(global.x); //10
```

## 解决思路

### 严格模式

曾想过使用`js`的严格模式（即在代码首行或函数内添加一句：`"use strict";`），但它只能保障上例中不会产生新的全局变量`age`（这时会报错），阻止不了我们对`x`赋值或其它操作。

::: tip 在严格模式下
在eval()语句内部声明的变量和函数不会在包含范围中创建

任意由eval()创建的变量或函数仍待在eval()里

然而，你可以通过从eval()中返回一个值的方式实现值的传递
``` js
var result = eval("var x = 10, y = 20; x + y");
console.log(result);  //严格模式与非严格模式下都能正常工作（得到30）
```
:::

### AST（抽象语法树）

想到可以用AST来排除掉恶意代码，再重新组合。

``` js
let esprima = require('esprima');
let escodegen = require('escodegen');

const AST = esprima.parse(`
    global.x = 10;
    name += '-abc';
    age = 12;
`);
// console.log(AST);
// console.log(AST.body[0].expression.left.object.name);

AST.body.splice(0, 1); //将第一条（global.x）删除

let originReback = escodegen.generate(AST);
console.log(originReback); //结果只有后2行
```

像`babel`、`webpack`、`uglify`这些有名的工具，其实都是用到AST。

感觉这是个不错的思路，不过需要枚举各种恶意代码。造这个轮子有点儿麻烦。

### 虚拟沙箱vm

如果代码只是运行在沙箱里，不对外界产生影响，那也能满足我们的需求。这时找到`vm`库。`nodejs`新版本已经包含它了。

以下是个简单例子：
``` js
const vm = require('vm');
const context = {
  animal: 'cat',
  count: 2
};

const obj = {};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context); // Prints: { animal: 'cat', count: 12, name: 'kitty' }
```
我们可以看到，沙箱可以设置一个上下文环境，运行的`js`代码，只会作用于这个上下文的对象。
里面想加`global`，会报错。
``` js
ReferenceError: global is not defined
```

## 最终选择——vm2

我曾以为`vm`就已经可以解决我的问题，但没想到它是有安全隐患的。比如这样：

``` js
vm.runInNewContext('this.constructor.constructor("return process")().exit()');
console.log('Never gets executed.');
```

会调用`process.exit()`，程序就关闭了，后面的代码永远不会运行。

按上面的写法，是这样：
``` js
const context = {
  'abc': 'name'
};
vm.createContext(context);
const script = new vm.Script('this.constructor.constructor("return process")().exit()');
script.runInContext(context);
console.log('Never gets executed.');
```

所以，选择[`vm2`](https://github.com/patriksimek/vm2)这个库。`vm2`就是专门为了解决`vm`的安全问题而诞生的。用法与之类似：
``` js
const {VM, VMScript} = require('vm2');
const vm2 = new VM();
const script = new VMScript("Math.random()");
console.log(vm2.run(script));
vm2.run(`process.exit()`); // TypeError: process.exit is not a function
```
会抛出异常。

### 特性：
- 运行不受信任的`JS`脚本
- 沙箱的终端输出信息完全可控
- 沙箱内可以受限地加载`modules`
- 可以安全地向沙箱间传递`callback`
- 死循环攻击免疫 `while (true) {}`

### 原理
1. vm2基于vm，使用官方的vm库构建沙箱环境。
2. 使用`JavaScript`的`Proxy`技术来防止沙箱脚本逃逸。
