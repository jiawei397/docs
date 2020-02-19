# es6函数判断问题

受原来数组判断影响，代码里判断函数原来是这样的：

```
isFunction = (obj)=> {
    return Object.prototype.toString.call(obj) === '[object Function]';
}
```

一直没出过问题。直到这两天琢磨不再编译代码为`es5`，因为业务需求，只需要支持`chrome`就可以，而`chrome`原生`async/await`都支持了，编译后不便于调试。
修改配置也简单，把`babel`中的`presets`去掉就可以了。

但遇到一个问题，追查后再发现是这里判断的锅。
因为这样：
```
aa = async () =>{}
Object.prototype.toString.call(aa) //结果是：[object AsyncFunction]
```

真是没想到。

最终抄`jquery`大法，修改为：
```
isFunction = (obj)=> {
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}
```
