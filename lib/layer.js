var d3 = require('d3');

function Layer() {
  this._data = null; 
  this._width = 1000; 
  this._height = 800;
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
}

Layer.prototype.xview = function(domain) {
  if (!arguments.length) return this.x.domain();
  this.x.domain(domain);
  return this;
}

Layer.prototype.yview = function(domain) {
  if (!arguments.length) return this.y.domain();
  this.y.domain(domain);
  return this;
}

Layer.prototype.height = function(height) {
  if (!arguments.length) return this._height;
  this._height = height;
  this.y.range([height, 0]);
  return this;
}

Layer.prototype.width = function(width) {
  if (!arguments.length) return this._width;
  this._width = width;
  this.x.range([0, width]);
  return this;
}

module.exports = Layer;
