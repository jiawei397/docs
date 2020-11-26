---
sidebar: false
---
# 隐式转换

js的`==`，比较两边元素时，其实就是采用的隐式转换。

参考[这篇文章](https://www.haorooms.com/post/js_yinxingleixing)的结论：

- 首先看双等号前后有没有`NaN`，如果存在`NaN`，一律返回`false`

- 再看双等号前后有没有布尔，有布尔就将布尔转换为数字（`false`是`0`，`true`是`1`）

- 接着看双等号前后有没有字符串, 有三种情况：

  1. 对方是对象，对象使用`toString()`或者`valueOf()`进行转换；
  2. 对方是数字，字符串转数字；（前面已经举例）
  3. 对方是字符串，直接比较；
  4. 其他返回`false`

- 如果是数字，对方是对象，对象取`valueOf()`或者`toString()`进行比较, 其他一律返回`false`

- `null`, `undefined`不会进行类型转换, 但它们俩相等

::: tip
一方是数字或字符串，对方是对象，将先调用`valueOf()`，

结果如果是`null`或`undefined`，返回`false`；

如果是基本数据类型（字符串或者数字或`boolean`），直接比较；

其它再调用`toString()`进行比较
:::

出一道题：
``` js
aa = {};
aa.toString = ()=> 1;
aa.valueOf = ()=> 2;

console.log(aa == 1);//false

aa.valueOf = ()=> [];
console.log(aa == 1);//true

aa.valueOf = ()=> undefined;
console.log(aa == 1);//false

aa.valueOf = ()=> false;
console.log(aa == 1);//false
```

也还有道经典的面试题：
``` js
var a = ?;
if (a == 1 && a == 2 && a==3){
    console.log('-------');
}
```
以上空出的代码写什么，才能有字符串打印出来？
其实就是利用前面的转换特性：
``` js
var a = {
    value: 1
};
a.valueOf = function(){
    return this.value++;
};
```
这里使用`toString`也是一样的。