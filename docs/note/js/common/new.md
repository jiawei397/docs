---
sidebar: false
---
# new操作符做了什么？

1. 创建一个空对象，并且 `this` 变量引用该对象，同时还继承了该函数的原型。
2. 属性和方法被加入到 `this` 引用的对象中。新创建的对象由 `this` 所引用，并且隐式地返回 `this` 。

::: warning 注意返回值特殊情况
如果构造函数执行的结果返回的是一个对象或函数，那么返回这个对象或函数
:::

## 用一个函数实现一下new

写一个`newClass`函数，达到以下`new`的效果：
``` js
function Foo(name, age) {
  this.name = name;
  this.age = age;
}

Foo.prototype.sayName = function () {
  console.log(this.name);
};

const a = new Foo('abc', 18);
console.log(a);
a.sayName();

```

实现：

``` js
function newClass(func, ...args) {
   // 第一步 创建新对象
    let obj= {};
    // 第二步 空对象的_proto_指向了构造函数的prototype成员对象
    obj.__proto__ = func.prototype;//
    // 一二步合并就相当于 let obj=Object.create(func.prototype)

    // 第三步 使用apply调用构造器函数，属性和方法被添加到 this 引用的对象中
    let result = func.apply(obj, args);
    if (result && (typeof result === "object" || typeof result === "function")) {
      // 如果构造函数执行的结果返回的是一个对象，那么返回这个对象
      return result;
    }
    // 如果构造函数返回的不是一个对象，返回创建的新对象
    return obj;
}

const a = newClass(Foo, 'abc', 18);
console.log(a);
a.sayName();
```
