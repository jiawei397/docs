---
sidebar: false
---
# 深度克隆

对象的浅克隆，使用`Object.assign`或扩展符（`...`）就可以实现。

::: tip 什么是浅克隆？
基础类型数据（`bool`、`String`、`Number`、`undefined`、`null`）都可以克隆，而引用类型的数据（`Array`、`Object`、`Function`等）只是引用过来而已
:::

来段代码了解一下：

``` js
const date = new Date();
const arr = [];
const o = {};
const obj = {
  date,
  arr,
  o
};
var newObj = {};
Object.assign(newObj, obj);
//或者换成扩展符，效果是一样的
//var newObj = {...obj};

//我们给arr添加一条数据：
arr.push(123);
o['a'] = 'abc';
date.setDate(13);

console.log(newObj.arr);//会看到它的arr属性的值也变化了
```

深度克隆的需求还是很常见的。因为函数重新赋值后，与它本身就没有关系了，所以我们只需要考虑对象和数组即可。下面是个简单的实现：

<<< @/docs/.vuepress/public/js/clone.js

测试一下：
``` js
const date = new Date();
const arr = [];
const o = {};
const obj = {
  date,
  arr,
  o
};
const newObj = clone(obj, true);
arr.push(1);
o['a'] = 'abc';
date.setDate(13);
console.log(newObj);
```
