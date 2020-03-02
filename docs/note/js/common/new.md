---
sidebar: false
---
# new操作符做了什么？

1. 创建一个空对象，并且 `this` 变量引用该对象，同时还继承了该函数的原型。
2. 属性和方法被加入到 `this` 引用的对象中。新创建的对象由 `this` 所引用，并且隐式地返回 `this` 。

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
function newClass(Klass, ...args) {
  const obj = {};
  obj.__proto__ = Klass.prototype;
  Klass.apply(obj, args);
  return obj;
}

const a = newClass(Foo, 'abc', 18);
console.log(a);
a.sayName();
```
