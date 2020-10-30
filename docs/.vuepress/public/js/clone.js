function isSet(obj) {
  return Object.prototype.toString.call(obj) === '[object Set]';
}

function clone(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (isSet(obj)) {
    var newSet = new Set();
    for (var prop of obj) {
      newSet.add(clone(prop));
    }
    return newSet;
  } else if (obj instanceof Array) {
    if (!Array.isArray(obj)) {
      obj = Array.from(obj);
    }
    return obj.map((item) => {
      return clone(item);
    });
  } else if(obj instanceof Date){
    return new Date(obj);
  } else {
    var newObj = {};
    for (var key in obj) {
      newObj[key] = clone(obj[key]);
    }
    return newObj;
  }
}