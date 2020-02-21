/**
 * 继承
 * @param {Function} subClass 子构造函数
 * @param {Function} superClass 父构造函数
 */
function extend (subClass, superClass) {
  // const F = function () {
  // };
  // F.prototype = superClass.prototype;
  // subClass.prototype = new F();
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.superclass = superClass.prototype;
  if (superClass.prototype.constructor === Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
  if (!subClass.prototype.__extendList) {
    subClass.prototype.__extendList = [];
  } else {
    subClass.prototype.__extendList = clone(subClass.prototype.__extendList);
  }
  subClass.prototype.__extendList.push(superClass);
}

/*
 * 多重继承
 * 对于子类和父类重复的成员,会取子类的成员
 * 对于父类重复的成员,会取最后一个父类的成员
 * 如果使用 instanceof 会和第一个父类的成员匹配
 * @param {Function} subClass 子构造函数
 * @param {Function} superClass 父构造函数
 * @param {Boolean} replaceExistedMember 是否替换已有的原型函数。如果为是，则将会是superClasses最后一个的原型函数内容
 */
function multiExtend (subClass, superClasses, replaceExistedMember = true) {
  extend(subClass, superClasses[0]);
  for (let i = 1; i < superClasses.length; i++) {
    let curSuperClass = superClasses[i];
    for (let cur in curSuperClass.prototype) {
      if (cur === 'constructor') {
        continue;
      }
      if (replaceExistedMember) {
        subClass.prototype[cur] = curSuperClass.prototype[cur];
      } else {
        if (subClass.prototype[cur] === undefined || subClass.prototype[cur] === null) {
          subClass.prototype[cur] = curSuperClass.prototype[cur];
        }
      }
    }
    subClass.prototype.__extendList.push(curSuperClass);
  }
}

/**
 * 判断继承
 * @param {Object} subObj 子对象实例
 * @param {Function} superClass 父构造函数
 */
function isInstance (subObj, superClass) {
  if (subObj instanceof superClass) {
    return true;
  }
  if (subObj && subObj.__extendList) {
    if (subObj.__extendList.includes(superClass)) {
      return true;
    }
  }
  return false;
}

function Parent(name) {
  this.parentName = name;
}

Parent.prototype.sayName = function() {
  console.log('parent name:', this.parentName);
};

function Parent2(age) {
  this.age = age; //这句不会走
}
Parent2.prototype.sayAge = function() {
  console.log('parent2 age:', this.age); //undefined
};

function Child(name, parentName) {
  Child.superclass.constructor.call(this, parentName);//必须有这一句，才能继承父类的属性
  this.name = name;
}
//extend(Child, Parent);//单重继承
multiExtend(Child, [Parent, Parent2]);//混合继承

let child = new Child('child', '父亲名称');
console.log(child instanceof Parent); //true
console.log(child instanceof Parent2); //false

console.log(isInstance(child, Parent));//true
console.log(isInstance(child, Parent2));//true

child.sayName();
child.sayAge();
