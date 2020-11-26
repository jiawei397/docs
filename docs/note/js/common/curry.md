# 函数柯里化
## 概念
什么是柯里化？

英语`Currying`，音译过来的，好验听。就是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

这解释比较拗口，也比较绕，其实就是个高阶函数。

来个经典例子：

``` js
function add(x, y) {
    return x + y
}

// Currying后
function curryingAdd(x) {
    return function (y) {
        return x + y
    }
}

add(1, 2)           // 3
curryingAdd(1)(2)   // 3
```

## 实现
实现很简单，思路是判断参数的长度，如果参数长度没达到原函数的长度，就返回一个函数；只有长度相等或超过时，才会返回执行结果。

``` js
function curry(fn){
  return function helper(...args) {
    if (args.length >= fn.length) { //fn.length代表原始函数的参数数量
      return fn(...args);
    } else {
      return function (...args2) {
        return helper(...args, ...args2);
      };
    }
  };
}
```

测试：
``` js
const sum = function (a, b, c, d) {
  return a + b + c + d;
};
const sum2 = curry(sum);
const data = sum2(1)(2)(3)(4);
console.log(data);

const data2 = sum2(1)(2)(3, 4);
console.log(data2);

const data3 = sum2(1, 2)(3, 4);
console.log(data3);

const data4 = sum2(1, 2, 3)(4);
console.log(data4);
```

## 使用场景

适合封装一个函数中有多个参数都一样的情况，比如下面这个第1个参数分别固定时，可以为不同的新函数：

``` js
function check(reg, txt) {
  return reg.test(txt)
}

var curryCheck = curry(check);

var hasNumber = curryCheck(/\d+/g);
console.log(hasNumber('test'));
console.log(hasNumber('test1'));

var hasLetter = curryCheck(/[a-z]+/g);
console.log(hasLetter('test'));
console.log(hasLetter('132'));
```