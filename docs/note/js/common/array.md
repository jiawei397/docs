# 数组常用技巧

## 伪数组转换为真数组
数组的`slice`方法可以将`类似数组的对象`（比如`document.getElementsByName('li')`）变成真正的数组。
一般是需要使用数组的方法时做下转换。
``` js
var arr = Array.prototype.slice.call(arrayLike);
var arr = [].slice.call( arrayLike);
```
也可以使用`es6`的`Array.from`。
``` js
var arr = Array.from(arrayLike);
```

所以，`Array.from`其实可以这样简单实现：
``` js
Array.from = function(arr){
  return Array.prototype.slice.call(arr);
}
```
但事实上没有这么简单，比如`Set`类型的数据就无法这样转换。它需要更复杂的处理。


## 获取数组最后的元素
大多数人的做法：
``` js
var arr = [123, 456, 789];
var len = arr.length;
var end = arr[len-1]
console.log('end:', end)  // 'end:' 789
```

优化方法：
``` js
var array = [1, 2, 3, 4, 5, 6];
console.log( array.slice(-1) ); // [6]
console.log( array.slice(-1)[0] ); // 6
console.log( array.slice(-2) ); // [5,6]
console.log( array.slice(-3) ); // [4,5,6]
```

可以封装一个函数：
``` js
Array.prototype.last = function(){
  return this.slice(-1)[0];
};
```
当数组数量越大，性能差异越大。以下是一个测试方法
``` js
let arr1 = Array.from(new Array(100000000), (x, index)=>{
  return Math.random();
});

//耗时7.923ms
console.time('a');
console.log(arr1[arr1.length-1]);
console.timeEnd('a');

//耗时0.075ms
console.time('b');
console.log(arr1.slice(-1)[0]);
console.timeEnd('b');
```

## 截断数组
比如，当数组中有 `10` 个元素，而你只想获取其中前 `5` 个的话，你可以截断数组，通过设置 `array.length = 5` 使其更小。

``` js
var array = [1, 2, 3, 4, 5, 6];
console.log( array.length ); // 6
array.length = 3;
console.log( array.length ); // 3
console.log( array ); // [1,2,3]
```

## 合并数组
一般合并两个数组的话，通常会使用 `Array.concat()`。

``` js
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
console.log(array1.concat(array2)); // [1,2,3,4,5,6];
```
然而，这个函数并不适用于合并大的数组，因为它需要创建一个新的数组，而这会消耗很多内存。

这时，你可以使用 `Array.prototype.push.apply( arr1, arr2 )` 来代替创建新的数组，它可以把第二个数组合并到第一个中，从而较少内存消耗：
``` js
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
Array.prototype.push.apply(array1, array2);
console.log(array1);  // [1,2,3,4,5,6];
```
对于`es6`，可以使用扩展符：
``` js
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
array1.push(...array2);
console.log(array1);  // [1,2,3,4,5,6];
```

## 数组的随机排序

方法一：
``` js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function randSort1(arr){
    for(var i = 0,len = arr.length;i < len; i++ ){
        var rand = parseInt(Math.random()*len);
        var temp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
console.log(randSort1(arr));
```

方法二：
``` js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function randSort2(arr){
    var mixedArray = [];
    while(arr.length > 0){
        var randomIndex = parseInt(Math.random()*arr.length);
        mixedArray.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
    }
    return mixedArray;
}
console.log(randSort2(arr));
```

方法三：
``` js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.sort(function () {
  return Math.random() - 0.5;
});
console.log(arr);
```

## 数组扁平化

完成一个`flatten`的函数，实现`拍平`一个`多维数组`为`一维`。示例如下：

``` js
var testArr1 = [[0, 1], [2, 3], [4, 5]];
var testArr2 = [0, [1, [2, [3, [4, [5]]]]]];
flatten(testArr1) // [0, 1, 2, 3, 4, 5]
flatten(testArr2) // [0, 1, 2, 3, 4, 5]
```
### 解法1
先来一个最简单的解法：
``` js
flatten = (arr) => arr.toString().split(',').map((val) => parseInt(val));
```
它是利用数组`toString`的特殊性，很巧妙地处理。

### 解法2
再来一种：
``` js
flatten2 = function (arr) {
  return arr.reduce(function (pre, val) {
    if (!Array.isArray(val)) {
      pre.push(val);
    } else {
      pre.push(...flatten2(val));
    }
    return pre;
  }, []);
};
```
也能简写为：
``` js
flatten2 = (arr) => arr.reduce((pre, val) => pre.concat(Array.isArray(val) ? flatten2(val) : val), []);
```

### 解法3

现在`es6`已有内置的`flat`方法：
``` js
var testArr1 = [[0, 1], [2, 3], [4, 5]];
testArr1.flat() // [0, 1, 2, 3, 4, 5]

var testArr2 = [0, [1, [2, [3, [4, [5]]]]]];
testArr2.flat() // [0, 1, [2, [3, [4, [5]]]]]
```
我们看到，`testArr2`只解放了一层。为什么呢？

原来这个函数有个默认参数`depth`，我们可以称之为深度，默认是`1`，当不传递参数时，只处理一层。
要想全部铺展的话，需要传递参数`Infinity`，如`testArr1.flat(Infinity)`。

下面是我的一个简单实现。
``` js
Array.prototype.flat = function (depth = 1) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && depth > 0) {
            arr.push(...this[i].flat(depth-1));
        } else {
            arr.push(this[i]);
        }
    }
    return arr;
};
```

## includes与indexOf的区别

数组有2个判断是否包含某个元素的方法，`includes`与`indexOf`，后者很早就有了，前者是`es6`才加的。

很多人以为2个的区别只是前者返回`bool`，后者返回索引数字，其实不止如此，关键一点在于对`NaN`的判断。

`indexOf`是不会判断`NaN`的。比如：
``` js
var arr = [1, 2, 3, NaN];
console.log(arr.includes(NaN)); // true
console.log(arr.indexOf(NaN)); // -1
```

所以，我们要实现`includes`的时候，需要这样：
``` js
Array.prototype.includes = function (item) {
    for (var i = 0; i < this.length; i++) {
        // if (this[i] === item || (this[i] !== this[i] && item !== item)) {
        if (this[i] === item || (isNaN(this[i]) && isNaN(item))) {
            return true;
        }
    }
    return false;
};
```
其中，我注释掉的那行，就是`isNaN`的一个实现，它是`js`中唯一一个不等于自身的。

## 数组循环方法的实现

数组的多数方法都能用原生的`for`循环实现，而数组的循环遍历的方法，几乎都一样，都有2个参数，第一个是`callback`函数，第二个是改变前面`callback`作用域的。
通过对这些函数的实现，可以更好地理解和记忆怎么使用。

### forEach
以最简单的`forEach`为例，可以这么实现：
``` js
Array.prototype.forEach = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        callback.call(scope, this[i], i, this);
    }
}
```

### map
`map`与`forEach`的区别只是有返回值罢了：
``` js
Array.prototype.map = function (callback, scope) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        arr.push(callback.call(scope, this[i], i, this));
    }
    return arr;
};
```

### some
`some`是满足条件时，就返回`true`，没有一个满足时返回`false`
``` js
Array.prototype.some = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        if(callback.call(scope, this[i], i, this)){
          return true;
        }
    }
    return false;
};
```

### every
`every`与`some`刚好相反，有一个不满足条件时，就返回`false`，全部满足才返回`true`
``` js
Array.prototype.every = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        if(!callback.call(scope, this[i], i, this)){
          return false;
        }
    }
    return true;
};
```

### find
`find`是找到符合条件的元素：
``` js
Array.prototype.find = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        if(callback.call(scope, this[i], i, this)){
          return this[i];
        }
    }
};
```

### findIndex
`findIndex`是找到符合条件的元素的索引：
``` js
Array.prototype.findIndex = function (callback, scope) {
    for (var i = 0; i < this.length; i++) {
        if(callback.call(scope, this[i], i, this)){
          return i;
        }
    }
    return -1;
};
```

### reduce的用法
数组的`reduce`方法比较特殊，它的参数不像其它循环遍历的方法，有点另类。
用法是这样的：
``` js
var arr = [1, 2, 3, 4];
var callbackfn = function (pre, cur, index, arr) {
    console.log(pre, cur, index);
    return pre + cur;
};
var res = arr.reduce(callbackfn);
console.log(res); // 10

var res2 = arr.reduce(callbackfn, 5);
console.log(res2); // 15
```
它的回调函数里，第1个参数是上一次`callback`的执行结果。
第一次时，如果没有传递第2个参数，这时它使用数组的第一个元素，也将从第二元素开始遍历。
它会将最后一个执行结果返回。

常用使用场景是做累加。

还有这样一种情况，先过滤一次条件，再用`map`返回一个新的数组。
``` js
var res3 = arr.filter(item => item > 2).map(i => i * 2);
console.log(res3);
```
这样有个弊端，会进行2次循环。最优是使用原生`for`进行处理，当然也可以使用`reduce`。

``` js
var res4 = arr.reduce(function (pre, cur) {
     if (cur > 2) {
         pre.push(cur * 2);
     }
    return pre;
}, []);
console.log(res4);
```

我们可以这样实现：
``` js
Array.prototype.reduce = function (callbackfn, preItem) {
    var i = 0;
    if (preItem === undefined) { //如果没有预传值，则代表默认为第一个元素，从第2个元素开始遍历
        preItem = this[0];
        i++;
    }
    for (var len = this.length; i < len; i++) {
        preItem = callbackfn(preItem, this[i], i, this);
    }
    return preItem;
};
```

### join
`join`是合并数组为字符串。
``` js
Array.prototype.join = function (sep = ',') {
    var str = '';
    for (var i = 0; i < this.length; i++) {
        str += this[i] + (i === this.length - 1 ? '' : sep);
    }
    return str;
};
```

## 多层for循环时怎么跳出外围循环

作为面试题问面试者，居然鲜有人能回答。可能现在这种使用场景渐少的缘故。

在一个函数里，`return`关键字自然可以跳出循环，但要继续下面的逻辑的话，就只有使用`break`。

对于多层循环嵌套，只需要在需要中断的循环外面加个标签（随便一个字符串都行），就可以继续用`break`关键字来中断循环。

``` js
a: for(var i = 0; i < 10; i++){
  for(var j = 10; j < 100; j++){
    if(j == 10){
      break a;
    }
  }
}

```
