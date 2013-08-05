function classcallable(cls) {
  /*
   * Replicate the __call__ magic method of python and let class instances
   * be callable.
   */
  var new_cls = function() {
    var obj = Object.create(cls.prototype);
    // create callable
    // we use func.__call__ because call might be defined in
    // init which hasn't been called yet.
    var func = function() { return func.__call__.apply(func, arguments); };
    func.__proto__ = obj;

    // reinsert Function to prototype chain
    var protos = [];
    var p = func.__proto__;
    while(p != null) {
      protos.push(p);
      p = p.__proto__;
    }
    // replace last proto with Function.prototype
    // to enable apply, call, etc
    // Note, to support inheritance we check if we already added
    // the Function.prototype
    if (protos[protos.length-2] != Function.prototype) {
      protos[protos.length-2].__proto__ = Function.prototype;
    }

    // apply init late so it is bound to func and not cls
    cls.apply(func, arguments);
    return func;
  }
  new_cls.prototype = cls.prototype;
  return new_cls
}

module.exports = classcallable
