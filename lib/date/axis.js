var d3 = require('d3');
var callable = require('../callable.js');

function DTAxis() {
  this.axis = d3.svg.axis();

  this.__call__ = function(selection) {
    return this.axis(selection);
  }
}

DTAxis.prototype.scale = function() {
  this.axis.scale.apply(this.axis, arguments);
  return this;
}

DTAxis.prototype.orient = function() {
  this.axis.orient.apply(this.axis, arguments);
  return this;
}
DTAxis.prototype.tickFormat = function() {
  this.axis.tickFormat.apply(this.axis, arguments);
  return this;
}
DTAxis.prototype.tickSize = function() {
  this.axis.tickSize.apply(this.axis, arguments);
  return this;
}

module.exports = callable(DTAxis)
