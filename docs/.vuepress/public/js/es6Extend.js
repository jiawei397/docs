function mix (...mixins) {
  class Mix {
    // 如果不需要拷贝实例属性下面这段代码可以去掉
    constructor (...args) {
      // for (let mixin of mixins) {
      //     copyProperties(this, new mixin()); // 拷贝实例属性
      // }
      copyProperties(this, new mixins[0](...args));
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties (target, source) {
  for (let key of Reflect.ownKeys(source)) { //返回一个由目标对象自身的属性键组成的数组
    if (typeof source === 'function') { //如果是类，才这样复制
      if (key !== "constructor" && key !== "prototype" && key !== "name") {
        let desc = Object.getOwnPropertyDescriptor(source, key);//返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
        Object.defineProperty(target, key, desc);
      }
    } else {
      target[key] = source[key];
    }
  }
}

/**
 * 增加一条多重继承的关系链
 */
const multiExtend = function (subClass, superClasses) {
  if (!subClass.prototype.__extendList) {
    subClass.prototype.__extendList = [];
  }
  subClass.prototype.__extendList.push(...superClasses);
};

/**
 * 继承判断
 * @param obj 实例对象
 * @param superClass 父类
 * @return {boolean}
 */
const isInstance = (obj, superClass) => {
  if (obj instanceof superClass) {
    return true;
  }
  if (obj && obj.__extendList) {
    if (obj.__extendList.includes(superClass)) {
      return true;
    }
  }
  return false;
};

class Parent {
  constructor (name, sex) {
    console.log('-----------parent-------' + name);
    this.name = name;
    this.sex = sex;
  }

  saySex () {
    console.log('parent sex:' + this.sex);
  }

  sayName () {
    console.log('parent name:', this.name);
  }
}

class Parent2 {
  constructor (age) {
    console.log('-----------parent2'); //这行不会走
    this.age = age;
  }

  sayAge () {
    console.log('parent age:', this.age); //undefined
  }
}

class Child extends mix(Parent, Parent2) {
  constructor (name, sex, interest) {
    super(name, sex);
    this.interest = interest;
  }
}
multiExtend(Child, [Parent, Parent2]); //必须加这句，才能使用isInstance

const child = new Child('son', 'man', 'football');

child.sayName();  // child name: son
child.saySex();   // parent sex : man
child.sayAge(); //parent age: undefined

console.log(child instanceof Parent);//false
console.log(child instanceof Parent2);//false

console.log(isInstance(child, Parent));//true
console.log(isInstance(child, Parent2));//true
