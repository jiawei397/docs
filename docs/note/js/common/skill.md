# js常用技巧

## 伪数组转换为真数组
数组的`slice`方法可以将`类似数组的对象`（比如`document.getElementsByName('li')`）变成真正的数组。
一般是需要使用数组的方法时做下转换。
```
var arr = Array.prototype.slice.call(arrayLike);
var arr = [].slice.call( arrayLike);
```
也可以使用`es6`的`Array.from`。
```
var arr = Array.from(arrayLike);
```

## 获取数组中最后的元素
大多数人的做法：
```
var arr = [123, 456, 789];
var len = arr.length;
var end = arr[len-1]
console.log('end:', end)  // 'end:' 789
```

优化方法：
```
var array = [1, 2, 3, 4, 5, 6];
console.log( array.slice(-1) ); // [6]
console.log( array.slice(-1)[0] ); // 6
console.log( array.slice(-2) ); // [5,6]
console.log( array.slice(-3) ); // [4,5,6]
```

可以封装一个函数：
```
Array.prototype.last = function(){
  return this.slice(-1)[0];
};
```
当数组数量越大，性能差异越大。以下是一个测试方法
```
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

