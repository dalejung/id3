function classcallable(cls) {
  /*
   * Replicate the __call__ magic method of python and let class instances
   * be callable.
   */
  var new_cls = function() {
    var obj = Object.create(cls.prototype);
    // apply init
    cls.apply(obj, arguments);
    // create callable
    var func = function() { return obj.__call__.apply(func, arguments); };
    func.__proto__ = obj;
    return func;
  }
  new_cls.prototype = cls.prototype;
  return new_cls
}

module.exports = classcallable
