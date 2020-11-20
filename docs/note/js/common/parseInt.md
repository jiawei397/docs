# parseInt补遗

``` js
['1','2','3'].map(parseInt)
```

上面代码的运行结果是什么？好些人答不上来，原因在于对`parseInt`的参数掌握不够。

平时我们使用`parseInt`时，基本上是这样：`parseInt('1')`，很少会关注第二个参数。就像我们多数情况下不会使用`forEach`的第二个参数一样。

对于`parseInt(s, radix)`，功能是解析一个字符串并返回指定基数的`十进制整数`，或者`NaN`。我们看下这两个参数：

- s, 十进制表示的字符串
- radix，指定的基数，是2-36之间的整数

比如以下例子都返回15：

``` js
parseInt("0xF", 16);
parseInt("F", 16);
parseInt("17", 8);
parseInt(021, 8);
parseInt("015", 10);   // parseInt(015, 10); 返回 13
parseInt(15.99, 10);
parseInt("15,123", 10);
parseInt("FXX123", 16);
parseInt("1111", 2);
parseInt("15 * 3", 10);
parseInt("15e2", 10);
parseInt("15px", 10);
parseInt("12", 13);
```

以下例子都返回`NaN`：
``` js
parseInt("Hello", 8); // 根本就不是数值
parseInt("546", 2);   // 除了“0、1”外，其它数字都不是有效二进制数字
parseInt("546", 3);   //与上同理，如果是三进制，肯定只能是“0、1、2”这3个数字之一
```

回到题目本身，它其实相当于下面的代码：

``` js
['1','2','3'].map(function(item, index) {
    return parseInt(item, index);
})
```

相应地，也就是下面3步执行：
1. `parseInt(1, 0)` 返回 1
2. `parseInt(2, 1)` 返回 `NaN`
3. `parseInt(3, 2)` 返回 `NaN`

所以，最终结果为：`[1, NaN, NaN]`。
