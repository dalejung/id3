function callable(obj) {
  // bind the call to func
  var call = obj.__call__; 
  var func = function() { return call.apply(func, arguments); };
  func.__proto__ = obj;
  return func;
}

function classcallable(cls) {
  var new_cls = function() {
    cls.apply(this, arguments);
    return callable(this);
  }
  return new_cls
}

module.exports = classcallable
