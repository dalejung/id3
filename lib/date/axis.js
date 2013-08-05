var d3 = require('d3');
var callable = require('../callable.js');

function DTAxis() {
  this.axis = d3.svg.axis();
  this._index = null;

  this.tickFormat(axis_format.bind(this));
  this.__call__ = function(selection) {
    this.update_ticks();
    return this.axis(selection);
  }
}

format = d3.time.format("%Y-%m-%d");
var now = new Date();
var utc_offset = now.getTimezoneOffset() * 60000;

// this needs to be abstracted to locator/formatter
function axis_format(d, i) {
  var index = this.index();
  if (!index) { return d }
  // date based formatting
  var date = new Date(index[d] / 1000000 + utc_offset);
  return format(date);
}

DTAxis.prototype.update_ticks = function() {
  // Locator logic
}

DTAxis.prototype.index = function(index) {
  if (!arguments.length) { return this._index }
  this._index = index;
  return this;
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
