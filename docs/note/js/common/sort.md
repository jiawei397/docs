---
sidebar: false
---
# 排序问题
## 数组排序问题

遇到一个奇葩问题，数组排序在`chrome`浏览器下没有问题，而在`IE`下不生效。查了下资料，原来是写法有误。

原来写法：

``` js
var arr = [300, 20, 10, 1, 2];
arr.sort(function(a, b){
	return a > b;
});
```
期望返回值是`[300, 20, 10, 2, 1]`（chrome下），结果是`[300, 20, 10, 1, 2]`（IE下）

比较函数的返回值应该是数字（正数降序，负数升序，0不动），而我写成了bool，导致排序失败。chrome下可能做过兼容处理。

最蛋疼的是，在我写这篇文章时，新版本chrome恢复了，与IE效果成了一样的，而本地nodejs运行的版本(v10.0.0)仍是旧的。


1. 比较函数如果不传，则默认按照字符编码的顺序升序排列。
2. 如果想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。比较函数应该具有两个参数 a 和 b，其返回值如下：

	- 若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
	- 若 a 等于 b，则返回 0。
	- 若 a 大于 b，则返回一个大于 0 的值。


::: tip 经过测试
比较函数的返回结果如果不是数字（Boolean或者NaN或者String或者Object），都不会排序。
:::

总结下：

- `升序排列`，返回值可以简写为：`a-b`
- `降序排序`，返回值可以简写为：`b-a`


::: tip 按字母大小排序
顺便一提，如果数组中元素都是字符串，按照字母大小写顺序排序，`js`的字符串原生提供了一个方法：`localeCompare`。
用法如下:

``` js 
aa = ['cca', 'A', 'b', 'B'];
aa.sort((a, b)=> a.localeCompare(b)); // ["A", "b", "B", "cca"]
aa.sort((a, b)=> b.localeCompare(a)); // ["cca", "B", "b", "A"]
```
:::



## 两个元素交换位置

看到一道面试题：

编写一个函数，不用临时变量，直接交换 `nums = [a, b]`中 `a` 与 `b` 的值，其中这两个值都是整数。

对于`es6`而言，当然简单，内置了转换的语法，比如：
``` js
[nums[0], nums[1]] = [nums[1], nums[0]]; 
```

题目当然不是想考察这个，那么应该怎么做呢？这其实涉及到**换位运算**。

交换两个整数`a=10100001`，`b=00000110`的值，可通过下列语句实现：
``` js　
a = a^b； 　　//a=10100111
b = b^a； 　　//b=10100001
a = a^b； 　　//a=00000110
```

所谓的 `^` (`异或`)是指对应比特位不同为1，不同为0。也就是说：
1. 只要是相同的数，它的二进制中每个比特位全部相同，异或之后全部变为0,即 `a^a=0`
2. 要是和0异或呢？0的二进制中每个位都为0，所以任何数和0异或，每个比特位都不变，即`a^0=a`

所以，上面的语句是这么运算的：
``` js
a = a ^ b //a=a^b
b = a ^ b;//b=(a^b)^(b)=a^(b^b)=a
a = a ^ b;//a=(a^b)^(a)=b 
```

对于这道题而言，就是这样：
``` js
nums[0] = nums[0] ^ nums[1];
nums[1] = nums[0] ^ nums[1];
nums[0] = nums[0] ^ nums[1];
```
但如果2个值并不是`整数`，这样做就不对了。需要另一种运算：

``` js
a = a + b; //a = a + b
b = a - b;//和减去其中一个数，就是另一个数：(a+b) - b = a
a = a - b; // (a+b) - a = b
```
这样，即使不是整数，也能进行换位，不过对于`js`而言，小数精度会有变化，并不完全准确。

对于这道题而言，就是这样：
``` js
nums[0] = nums[0] + nums[1];
nums[1] = nums[0] - nums[1];
nums[0] = nums[0] - nums[1];
```

更具体的排序可以参考：
- [常用的排序方法](https://www.cnblogs.com/bear-blogs/p/10808399.html)
- [十大排序的算法思路和代码实现](https://mp.weixin.qq.com/s/Rl_fcWzcSQ7NkPnozIrt0A)
- [JavaScript中常见排序算法详解](https://mp.weixin.qq.com/s/ujlpOwzPvc0EcQ24D9KFOw)
