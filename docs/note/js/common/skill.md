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
