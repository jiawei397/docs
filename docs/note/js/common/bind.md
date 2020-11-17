---
sidebar: false
---
# bind、call、apply的实现

这3个方法，其实都在`Function`的原型链上。

## bind实现

很简单，第一个参数是作用域，后面如果还有的话，就是函数前面的参数。其实它应该也算是[柯里化](./curry)的一种应用。

这是`ES5`的写法：
``` js
Function.prototype.bind = function(scope){
    var fn = this;
    var args = [].slice.call(arguments);
    args.shift();
    return function(){
        return fn.apply(scope, args.concat([].slice.call(arguments)));
    };
};
```

这是`ES6`的写法：
``` js
Function.prototype.bind = function(scope, ...args){
    var fn = this;
    return function(...args2){
        return fn.apply(scope, args.concat(args2));
    };
};
```
测试：

``` js
function Foo(age) {
    console.log(this.name);
    console.log(age);
}

var nf = Foo.bind({name: 'abc'});
nf(18);

var nf2 = Foo.bind({name: 'abc'}, 22);
nf2();
```

## apply实现

这是用`ES6`和`call`的实现：
``` js
Function.prototype.apply = function (scope, args) {
    return this.call(scope, ...args);
};
```

如果能使用`bind`的话，也很简单：
``` js
Function.prototype.apply = function(scope, args){
    var fn = this;
    return fn.bind(scope)(...args);
};
```

在`ES5`里，如果不能用`call`，则要麻烦多了。思路是使用`eval`函数，把函数本身赋给`scope`，再执行，最终删除新加的属性。

``` js
Function.prototype.apply = function (scope, arr) {
    scope = scope || window;
    var args = [];
    for (var i = 0; i < arr.length; i++) {
        var arg = arr[i];
        if (typeof arg === 'string') {
            args.push('"' + arg + '"');
        } else if (typeof arg === 'object') {
            scope['arg' + i] = arg;
            args.push('scope["arg' + i + '"]');
        } else {
            args.push(arg);
        }
    }

    scope.fn = this;
    var res = eval('scope.fn(' + args.join(',') + ')');
    delete scope.fn;
    for (var key in scope) {
        if (key.startsWith('arg')) {
            delete scope[key];
        }
    }
    return res;
};
```

测试：

``` js
function Foo(age, sex, options) {
    console.log(this.name);
    console.log(age);
    console.log(sex);
    console.log(options)
    return 'abcdefg'
}
var res = Foo.apply({ name: 'def' }, [45, 'man', { email: 'ss' }]);
console.log(res);
```


## call实现

实现了`apply`，`call`就容易了。

如果能使用`bind`的话，`call`很简单：
``` js
Function.prototype.call = function(scope, ...args){
    var fn = this;
    return fn.bind(scope)(...args);
};
```
使用`apply`的方式：
``` js
Function.prototype.call = function(scope){
    var fn = this;
    var args = [].slice.apply(arguments);
    args.shift();
    return fn.apply(scope, args);
};
```

如果用`ES6`，可以这样：
``` js
Function.prototype.call = function(scope, ...args){
    scope.fn = this;
    var res = scope.fn(...args);
    delete scope.fn;
    return res;
};
```
在`ES5`里，如果不能用`apply`，大致与上面实现差不多，这里就赘述了。

测试：
``` js
var res = Foo.call({ name: 'def' }, 45, 'man', { email: 'ss' });
console.log(res);
```
