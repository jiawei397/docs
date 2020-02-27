---
sidebar: false
---
# 测试插件mockjs
## `mockjs`是做什么的？
生成随机数据，拦截 `Ajax` 请求

## 优势

- 前后端分离：让前端攻城师独立于后端进行开发。
- 增加单元测试的真实性：通过随机数据，模拟各种场景。
- 开发无侵入：不需要修改既有代码，就可以拦截 `Ajax` 请求，返回模拟的响应数据。
- 用法简单：符合直觉的接口。
- 数据类型丰富：支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。
- 方便扩展：支持支持扩展更多数据类型，支持自定义函数和正则。

## 样例
`id`、名称、数字、`email`、时间、`web`、图片、颜色、地址、文字（段落、中英文），应有尽有。比如：

``` js
var Random = Mock.Random;
Mock.mock({
   "success":Random.boolean(),
   "code":-1,
   // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
   'list|1-10': [{
     // 属性 id 是一个自增数，起始值为 1，每次增 1
     'id|+1': 1,
     'name':'@name',
      'email':'@email'
   }]
});
```

这样，就随机生成：
``` json
{
   "success": false,
   "code": -1,
   "list": [
    {
      "id": 1,
      "name": "Kevin White",
      "email": "g.sgtlww@angmwb.ru"
    },
    {
      "id": 2,
      "name": "Kevin Lopez",
      "email": "h.qhnslgrbx@qgrtp.fm"
    },
    {
      "id": 3,
      "name": "Maria Thompson",
      "email": "s.lqydz@jivwiqbfph.cm"
    },
    {
      "id": 4,
      "name": "Richard Johnson",
      "email": "v.gddptb@urkothxl.mw"
    }
  ]
}
```

还可以拦截`ajax`请求。

``` js
Mock.mock(/\.json/,{
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    "success":Random.boolean(),
    "code":-1,
    'data|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1,
        'name':'@name',
        'email':'@email'
    }]
});
```

这样，所有后缀为`.json`的`ajax`请求，都被拦截，返回数据为模拟数据。

详见[官网](http://mockjs.com)
