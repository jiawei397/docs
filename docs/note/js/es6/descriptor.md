# es6装饰器异步使用

## 装饰器简介 ##

个人理解，某些场景需要在不改变原有类和属性的基础上扩展一些功能，所以装饰器就出现了。

装饰器的写法是在类或类属性之前，加个方法名。学过`java`的同学应该比较熟悉这种写法，`Spring`中铺天盖地都是注解。具体细节到处都是，就不赘述了。

不过截止到今天（2019年8月），遗憾的是`nodejs`还未原生支持，仍然需要`babel`编译。

## 使用场景 ##

突然想到用装饰器，当然是有业务需要。写了一个`api`类，所有暴露的函数都需要进行一步初始化操作。但初始化代码又不归我控制，且是异步接口请求，不能立即执行，这就导致每个函数都要调用一遍这个`init`方法。因为加了缓存，每个都要判断有没有缓存，比较恶心。

### 常用例子 ###

一般用这个日志模块来举例，不过它是同步的

``` js
	class Math {
	  @log
	  add(a, b) {
	    return a + b;
	  }
	}

	function log(target, name, descriptor) {
	  var oldValue = descriptor.value;

	  descriptor.value = function() {
	    console.log(`Calling "${name}" with`, arguments);
	    return oldValue.apply(null, arguments);
	  };

	  return descriptor;
	}

	const math = new Math();

	// passed parameters should get logged now
	math.add(2, 4);
```

### 修改为异步 ###

``` js
	let init = 0;
	class Maths {
	  @log
	  add (a, b) {
	    return a + b + init;
	  }
	}

	function log (target, name, descriptor) {
	  let oldValue = descriptor.value;
	  descriptor.value = function (...args) { //有时候，arguments指向不对，可能是babel的锅？
	    console.log(`Calling "${name}" with`, args);
	    return new Promise((resolve) => {
	      setTimeout(function () {
	        // args = [...args, 100];
	        init = 100;
	        resolve(oldValue.apply(target, args)); //this指向
	      }, 100);
	    });
	  };
	  return descriptor;
	}

	const math = new Maths();

	(async () => {
	  let a = await math.add(2, 4);
	  console.log(a);
	})();
```
在具体函数前加了装饰器后，会先执行`log`方法，这样缓存的变量就修改了。虽然结果变成异步的，但也满足我的需要了。
