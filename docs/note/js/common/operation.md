# js中的位运算

## 运算符
几个主流语言中的这几种位运算大体都是一致的：与（`&`）、或（`|`）、非（`~`）、异或（`^`）、位移（`<<`与`>>`）。

### 与运算符 &

两个操作数中，位都为1，结果才为1，否则结果为0

### 或运算符 |

两个位只要有一个为1，那么结果就是1，否则就为0

### 非运算符 ~

如果位为0，结果是1，如果位为1，结果是0

### 异或运算符 ^

两个操作数的位中，相同则结果为0，不同则结果为1。

**异或**可以进行整数值交换
``` js
a = a ^ b； 　　
b = a ^ b； 　　//其实相当于 a ^ b ^ a = b，得到原来b的值
a = a ^ b； 　　//相当于 a ^ b ^ b = a, 得到原来a的值
```

也可以用在下面这种场景中：

::: tip 汉明距离
两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。

给出两个整数 x 和 y，计算它们之间的汉明距离。

注意： 0 ≤ x, y < 231

示例:

输入: x = 1, y = 4

输出: 2

解释

    1 (0 0 0 1)
    4 (0 1 0 0)
         ↑   ↑
上面的箭头指出了对应二进制位不同的位置。

而另一个例子：010001 与 100000 之间的汉明距离是 3
:::

这是使用异或的最佳场景，因为同位相同为0，不同为1，进行位运算后，正好得到的数的二进制中`1`的数量就是**汉明距离**。

以下是解法：
``` js
function func(x, y) {
    let sum = x ^ y;
    let res = sum.toString(2).match(/1/g);
    return res.length;
};
```

### 位移

向左移动是`<<`，如`1 << 1`，就是说二进制数字从`01`变成`10`，即十进制`2`；再比如`1 << 2`，则是变成二进制`100`，即十进制`4`。

向右位移是`>>`，与之刚好相反。

## 权限校验

下面是个有趣的权限校验的例子（参考自《[了不起的 Vue3-上](https://mp.weixin.qq.com/s/AcEIkXoKSgtJsH_arkMjBQ)》）：

``` js
const permissionFlags = {
    A: 1,
    B: 1 << 1, // 2
    C: 1 << 2 // 4
};

//初始化用户权限
let userPermissionFlag = 0;

userPermissionFlag |= permissionFlags.A;
userPermissionFlag |= permissionFlags.C;

console.log(userPermissionFlag); // 5

// 分别对这3个鉴权，没权限就是0
console.log(userPermissionFlag & permissionFlags.A); // 1
console.log(userPermissionFlag & permissionFlags.B) // 0
console.log(userPermissionFlag & permissionFlags.C) // 4
```

上面代码怎么解释呢？首先权限`permissionFlags`的3个值都是`1`进行位运算得来，有个特点，二进制的位上有且只有一个`1`。

我们上面说了，**或运算符**是这样的：
> 两个位只要有一个为1，那么结果就是1，否则就为0

所以，`userPermissionFlag`进行**或运算**，得到的结果的二进制可以理解为有权限的位数都被设置为`1`了。如添加了`A`后，个位数变成`1`，添加了`C`后，百位数变成`1`。

鉴权就是对**或运算**取反，用**与运算**：
> 两个操作数中，位都为1，结果才为1，否则结果为0

用授权后的`userPermissionFlag`与权限`permissionFlags`相**与**，如果每个位数都为`0`，代表它一个权限都没有，结果也就是`0`。

这样，就达到了鉴权的目的。是不是显得很高大上？
