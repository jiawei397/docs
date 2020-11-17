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

## call实现

如果能使用`bind`的话，`call`很简单：
``` js
Function.prototype.call = function(scope, ...args){
    var fn = this;
    return fn.bind(scope)(...args);
};
```
现实当然不能如此简单，那样这3个函数就陷入死循环了。总有一个要特殊处理一下。

`call`的能力就是改变函数的作用域，我们可以把它加到`scope`这个对象上，这样用它来执行就可以了。

如果用`ES6`，可以这样：
``` js
Function.prototype.call = function(scope, ...args){
    scope.fn = this;
    var res = scope.fn(...args);
    return res;
};
```
在`ES5`里，如果不能用`apply`，则要麻烦多了：

``` js
Function.prototype.call2 = function (scope) {
    scope = scope || window;
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];
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
这里只能改名为`call2`，不然堆栈会溢出，可见底层好些方法都调用了`call`。

测试：
``` js
var res = Foo.call({ name: 'def' }, 45, 'man', { email: 'ss' });
console.log(res);
```