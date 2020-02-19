---
sidebar: false
---
# umd模板

以名称为`AI`为例：
```
(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    exports['AI'] = factory()
  } else {
    root['AI'] = factory()
  }
})(this, function () {

})
```
