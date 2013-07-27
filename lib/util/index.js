var munging = require('./munging.js')

module.exports = munging

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = {};
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
module.exports.clone = clone;
