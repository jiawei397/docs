# 继承的实现

本文参考[30 分钟学会 JS 继承](https://zhuanlan.zhihu.com/p/25578222)较多，勿怪。

## 常用继承

### 复制继承

就是将被继承的类的`prototype`复制。

``` js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}
function Child(name) {
    this.name = name;
}

Object.assign(Child.prototype, Parent.prototype);

var child = new Child('son');
child.sayName();    // child name: son

console.log(child instanceof Parent); //false
```

::: tip 缺点
1. 效率低
2. `instanceof`无效
3. 父亲构造函数没有执行，所以只是继承了方法，而没有继承属性
:::

### 原型继承

``` js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}
function Child(name) {
    this.name = name;
}

Child.prototype = new Parent('father');
Child.prototype.constructor = Child;

Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}

var child = new Child('son');
child.sayName();    // child name: son

console.log(child instanceof Parent); //true
```

::: tip 缺点
1. 子类无法给父类传递参数，在面向对象的继承中，我们总希望通过 `child = new Child('son', 'father')` 让子类去调用父类的构造器来完成继承。而不是通过像这样` new Parent('father')` 去调用父类。
2. `Child.prototype.sayName` 必须写在 `Child.prototype = new Parent('father')` 之后，不然会被覆盖掉。
:::

### 构造继承

主要是利用`call`和`apply`，在子类的环境里，运行一遍父类的属性与方法。

``` js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}
Parent.prototype.doSomthing = function() {
    console.log('parent do something!');
}
function Child(name, parentName) {
    Parent.call(this, parentName);
    this.name = name;
}

Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}

var child = new Child('son');
console.log(child instanceof Parent);//false

child.sayName();      // child name: son
child.doSomthing();   // TypeError: child.doSomthing is not a function
```
相当于 `Parent` 这个函数在 `Child` 函数中执行了一遍，并且将所有与 `this` 绑定的变量都切换到了 `Child` 上，这样就克服了前一种方式带来的问题。
::: tip 缺点
1. 没有原型，每次创建一个 `Child` 实例对象时候都需要执行一遍 `Parent` 函数，无法复用一些公用函数。

   也就是说，只复用了父类属性，而没有复用方法。

2. `instanceof`无效
:::

### 组合继承

``` js
function Parent(name) {
    this.name = name;
}

Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}
Parent.prototype.doSomething = function() {
    console.log('parent do something!');
}
function Child(name, parentName) {
    Parent.call(this, parentName); //第2次调用
    this.name = name;
}

Child.prototype = new Parent(); //第1次调用
Child.prototype.constructor = Child;
Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}

var child = new Child('son');
child.sayName();       // child name: son
child.doSomething();   // parent do something!
console.log(child instanceof Parent);//true
```
组合式继承是比较常用的一种继承方法，其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。

这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。

::: tip 缺点
使用过程中会被调用两次：一次是创建子类型的时候，另一次是在子类型构造函数的内部。
:::

### 寄生组合继承

``` js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}

function Child(name, parentName) {
    Parent.call(this, parentName);
    this.name = name;
}

function create(proto) {
    function F(){}
    F.prototype = proto;
    return new F();
}

Child.prototype = create(Parent.prototype);
Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.sayName();    // parent name: father


var child = new Child('son', 'father');
child.sayName();     // child name: son
console.log(child instanceof Parent);//true
```
这就是所谓的寄生组合式继承方式，跟组合式继承的区别在于，他不需要在一次实例中调用两次父类的构造函数，假如说父类的构造器代码很多，还需要调用两次的话对系统肯定会有影响，寄生组合式继承的思想在于：用一个 F 空的构造函数去取代执行了 Parent 这个构造函数。

在上面的代码中，我们手动创建了一个 `create` 函数，但是其实是存在于 `Object` 对象中，不需要我们手动去创建，所以上面的代码可以改为：
``` js
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}

function Child(name, parentName) {
    Parent.call(this, parentName);
    this.name = name;
}

function inheritPrototype(Parent, Child) {
    Child.prototype = Object.create(Parent.prototype);   //修改
    Child.prototype.constructor = Child;
}

inheritPrototype(Parent, Child);

Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}

var parent = new Parent('father');
parent.sayName();      // parent name: father

var child = new Child('son', 'father');
child.sayName();       // child name: son
console.log(child instanceof Parent);//true
```

### es6继承

`es6`本身有`class`，可以当作`prototype`的语法糖。

``` js
class Parent {
    constructor(name) {
	    this.name = name;
    }
    doSomething() {
	    console.log('parent do something!');
    }
    sayName() {
	    console.log('parent name:', this.name);
    }
}

class Child extends Parent {
    constructor(name, parentName) {
      super(parentName);
      this.name = name;
    }
    sayName() {
 	    console.log('child name:', this.name);
    }
}

const child = new Child('son', 'father');
child.sayName();            // child name: son
child.doSomething();        // parent do something!

const parent = new Parent('father');
parent.sayName();           // parent name: father
console.log(child instanceof Parent);//true
```

## 多重继承

### es5的多重继承
我们常用的多重继承，一般是继承一个父类，也就是说继承它的属性和方法，再继承其它父类的方法。
实现方法也很简单，在前面继承的基础上，再复制下其它父类的`prototype`。

<<< @/docs/.vuepress/public/js/extend.js

### es6的多重继承

`ES6`中，`class`原生是不支持多重继承的，根据阮一峰[ECMAScript 6 入门教程](http://es6.ruanyifeng.com/#docs/class-extends#Mixin-%E6%A8%A1%E5%BC%8F%E7%9A%84%E5%AE%9E%E7%8E%B0)中的方法，通过以下方式即可实现`class`继承多个类：
``` js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```

::: warning 缺点
1. 构造函数没有传递参数，所以仅适用于不需要有参数的类
2. 无法使用`instanceof`
:::

所以像es5一样，仅执行第一个父类的构造函数比较合理。修改为以下内容：

<<< @/docs/.vuepress/public/js/es6Extend.js

::: tip
如果也需要执行其它父类的构造函数，则需要检查程序设计上是否合理了
:::
