function isFunction(obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number';
}
function clone(obj, isDeep, endFun) {
  if (!obj || typeof obj !== 'object' || (isFunction(endFun) && endFun(obj))) {
    return obj;
  }
  var c = obj instanceof Array ? [] : {};
  for (var i in obj) {
    var prop = obj[i];
    if (isDeep && typeof prop === 'object') {
      if (prop instanceof Array) {
        c[i] = [];
        for (var j = 0; j < prop.length; j++) {
          if (typeof prop[j] !== 'object') {
            c[i].push(prop[j]);
          } else {
            c[i].push(clone(prop[j], isDeep, endFun));
          }
        }
      } else {
        c[i] = clone(prop, isDeep, endFun);
      }
    } else {
      c[i] = prop;
    }
  }
  return c;
}
