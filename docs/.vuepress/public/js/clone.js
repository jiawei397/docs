function clone(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  var c = obj instanceof Array ? [] : {};
  for (var i in obj) {
    var prop = obj[i];
    if (typeof prop === 'object') {
      c[i] = clone(prop);
    } else {
      c[i] = prop;
    }
  }
  return c;
}
