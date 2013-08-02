var d3 = require('d3');
var _ = require('underscore');

function Layer() {
  this._data = null; 
  this._width = 1000; 
  this._height = 800;
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
  this._geoms = [];

  this.__call__ = function(selection) {
    _.each(this.geom(), function(layer) {
      layer.x.domain(this.x.domain());
      layer.height(this.height());
      layer.width(this.width());
      layer.update()
      layer(selection);
    }, this);
  }
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

Layer.prototype.data = function(data) {
  if (!arguments.length) return this._data;
  this._data = data;
  //this.x.domain([0, data.length-1]);
  //this.y.domain(d3.extent(data));
  return this;
}

Layer.prototype.data_length = function() {
  var data = this.data();
  if (data instanceof Array) {
    return this.data().length;
  }
  for(var key in data) {
    var series = data[key];
    if (Array.isArray(series)) {
      return series.length;
    }
  }
}

Layer.prototype.update = function() {
  var domain = this.x.domain();
  var data = this.data();
  // Reset the internal y-domain
  if (data instanceof Array) {
    this.y.domain(d3.extent(data.slice(domain[0], domain[1])));
  }
  if ('y' in data) {
    this.y.domain(d3.extent(data.y.slice(domain[0], domain[1])));
  }
  return this;
}

Layer.prototype.geom = function(layer) {
  if (!arguments.length) return this._geoms;
  if(layer.data()) {
    throw new Error("Cannot composite a layer that has already bound data");
  }
  layer.data(this.data());
  layer.x = this.x.copy();
  layer.y = this.y.copy();
  this._geoms.push(layer);
  return this;
}

module.exports = Layer;

var View = require('./view.js');
Layer.prototype.view = function() {
  return new View().layer(this);
}
