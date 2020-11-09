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
