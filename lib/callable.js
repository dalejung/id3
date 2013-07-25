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
    // apply init late so it is bound to func and not cls
    cls.apply(func, arguments);
    return func;
  }
  new_cls.prototype = cls.prototype;
  return new_cls
}

module.exports = classcallable
