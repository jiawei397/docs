# web components

组件化是web发展的方向，前端三架马车（react、vue、angular）无一不是组件框架。

`chrome`因为自家浏览器的缘故，一直在推动浏览器的原生组件，即 [Web Components API](https://developer.mozilla.org/en-US/docs/Web/Web_Components)。
相比第三方框架，原生组件简单直接，符合直觉，不用加载任何外部模块，代码量小。
目前，它还在不断发展，但已经可用于生产环境，几乎现代浏览器都支持了，区别只是支持度的问题。像`IE`之类的古董就不用考虑了。

这里简单记录下怎么使用。

## 自定义元素

假设我们要自定义的组件名称为`user-card`，根据规范，自定义元素的名称必须包含连词线，用与区别原生的 `HTML` 元素。在DOM中这样使用：
``` html
<user-card></user-card>
```

怎么定义呢？

``` js
class UserCard extends HTMLElement {
  constructor() {
    super();
  }
}

window.customElements.define('user-card', UserCard);
```

## 自定义元素的内容

``` js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var image = document.createElement('img');
    image.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png';
    image.classList.add('image');

    var container = document.createElement('div');
    container.classList.add('container');

    var name = document.createElement('p');
    name.classList.add('name');
    name.innerText = 'User Name';

    container.append(name);
    this.append(image, container);
  }
}
```
上面代码最后一行，`this.append()`的`this`表示自定义元素实例。

完成这一步以后，自定义元素内部的 `DOM` 结构就已经生成了。

## `<template>`标签
使用 `JavaScript` 写上一节的 `DOM` 结构很麻烦，`Web Components API` 提供了`<template>`标签，可以在它里面使用 `HTML` 定义 `DOM`。

``` html
<template id="userCardTemplate">
  <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
  <div class="container">
    <p class="name">User Name</p>
  </div>
</template>
```

然后，改写自定义元素的类：
``` js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    this.appendChild(content);
  }
}  
```

上面代码中，获取`<template>`节点以后，克隆了它的所有子元素，这是因为可能有多个自定义元素的实例，这个模板还要留给其他实例使用，所以不能直接移动它的子元素。

## 添加样式

自定义元素还没有样式，可以给它指定全局样式，比如下面这样。

``` css
user-card {
}
```
但是，组件的样式应该与代码封装在一起，只对自定义元素生效，不影响外部的全局样式。所以，可以把样式写在`<template>`里面。

``` html
<template id="userCardTemplate">
  <style>
    :host {
     display: flex;
     ...
   }
   ...
  </style>

  <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
  <div class="container">
    <p class="name">User Name</p>
  </div>
</template>
```

上面代码中，`<template>`样式里面的`:host`伪类，指代自定义元素本身。

## 自定义参数

`<user-card>`内容现在是在`<template>`里面设定的，为了方便使用，把它改成参数。

``` html
<user-card
  image="https://semantic-ui.com/images/avatar2/large/kristy.png"
  name="User Name"
  email="yourmail@some-email.com"
></user-card>
```
`<template>`代码也相应改造。

``` html
<template id="userCardTemplate">
  <style>...</style>

  <img class="image">
  <div class="container">
    <p class="name"></p>
  </div>
</template>
```
最后，改一下类的代码，把参数加到自定义元素里面。
 
``` js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    content.querySelector('img').setAttribute('src', this.getAttribute('image'));
    content.querySelector('.container>.name').innerText = this.getAttribute('name');
    this.appendChild(content);
  }
}
window.customElements.define('user-card', UserCard);  
```

## Shadow DOM
我们不希望用户能够看到`<user-card>`的内部代码，`Web Component` 允许内部代码隐藏起来，这叫做 `Shadow DOM`，即这部分 `DOM` 默认与外部 `DOM` 隔离，内部任何代码都无法影响外部。

自定义元素的`this.attachShadow()`方法开启 `Shadow DOM`，详见下面的代码。
``` js
class UserCard extends HTMLElement {
  constructor() {
    super();
    var shadow = this.attachShadow( { mode: 'closed' } ); //添加这一句

    //下面几句没有变化
    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    content.querySelector('img').setAttribute('src', this.getAttribute('image'));
    content.querySelector('.container>.name').innerText = this.getAttribute('name');

    shadow.appendChild(content); //原来是this添加孩子，现在使用shadow
  }
}
window.customElements.define('user-card', UserCard);
```
上面代码中，`this.attachShadow()`方法的参数`{ mode: 'closed' }`，表示 `Shadow DOM` 是封闭的，不允许外部访问。


::: details 完整代码
<<< @/docs/.vuepress/public/html/webComponent.html
:::

## 组件封装

假设我们的组件代码放在外部文件`modules/userCard.js`：
``` js
const template = document.createElement('template');
template.innerHTML = `
  <style>
      ...
  </style>

  <img class="image">
  <div class="container">
      <p class="name"></p>
  </div>
`;

export default class UserCard extends HTMLElement {
    constructor () {
        super();
        ...
    }
}
```
再在主页面这样引用：
``` js
 <script type="module">
    import UserCard from './modules/userCard.js';
    window.customElements.define('user-card', UserCard);
</script>
```

> 参考阮一峰大神[Web Components 入门实例教程](http://www.ruanyifeng.com/blog/2019/08/web_components.html)
  
> 可以使用这个[组件库](https://xy-ui.codelabo.cn/docs/)


