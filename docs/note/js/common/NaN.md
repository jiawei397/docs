---
sidebar: false
---
# isNaN与Number.isNaN的区别

很长一段时间，我都不知道`NaN`是`not a number`的意思，惭愧。

`NaN`是个特殊的存在，`x === x`这个真理被它颠覆了。也可以理解，不是数字嘛，不是数字的东西太多了。

我们经常有这样的需求，想把一个字符串转成数字，但又担心转换失败，于是代码会这么写：
``` js
function isNumber(str) {
  return !isNaN(Number(str))
}
```

最近才发现，这么写并不是最优的。直接用`!isNaN(str)`就可以了。为什么呢？

原来，`isNaN`函数会首先尝试将这个参数转换为数值，然后才会对转换后的结果是否是`NaN`进行判断。

那为什么又出现了`Number.isNaN`呢？

我们先看下面的例子：

```
isNaN(NaN);       // true
isNaN(undefined); // true
isNaN({});        // true

isNaN(true);      // false
isNaN(null);      // false
isNaN(37);        // false

// strings
isNaN("37");      // false: 可以被转换成数值37
isNaN("37.37");   // false: 可以被转换成数值37.37
isNaN("37,5");    // true
isNaN('123ABC');  // true:  parseInt("123ABC")的结果是 123, 但是Number("123ABC")结果是 NaN
isNaN("");        // false: 空字符串被转换成0
isNaN(" ");       // false: 包含空格的字符串被转换成0

// dates
isNaN(new Date());                // false
isNaN(new Date().toString());     // true

isNaN("blabla")   // true: "blabla"不能转换成数值
                  // 转换成数值失败， 返回NaN
```
`isNaN`会先进行数值转换，它导致我们前面说的`not a number`这个语义化不对了，空字符串、日期怎么也是`false`？它们不是数字难道是错的？

所以，`Number.isNaN`就来了，它不会进行类型转换，意思是我只判断是不是`NaN`，类型不是数字的直接给`false`——对不起，你不在我的判定范围。

最明显的区别是：

```
isNaN('abc'); // true
Number.isNaN('abc'); // false

isNaN(undefined); // true
Number.isNaN(undefined); // false

isNaN({});        // true
Number.isNaN({});        // false
```
