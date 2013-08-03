var d3 = require('d3');
var _ = require('underscore');
var svg = require('./svg.js');

function Layer() {
  this._data = null; 
  this._width = 1000; 
  this._height = 800;
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
  this._geoms = [];

  this.__call__ = function(selection) {
    _.each(this.geom(), function(layer) {
      layer(selection);
    }, this);
  }
}

Layer.prototype.xview = function(domain) {
  if (!arguments.length) return this.x.domain();
  this.x.domain(domain);

  // set xview on all geoms
  _.each(this.geom(), function(geom) {
    geom.xview(domain);
  });
  return this;
}

Layer.prototype.yview = function(domain) {
  if (!arguments.length) return this.y.domain();
  this.y.domain(domain);

  // set yview on all geoms
  _.each(this.geom(), function(geom) {
    geom.yview(domain);
  });
  return this;
}

Layer.prototype.height = function(height) {
  if (!arguments.length) return this._height;
  this._height = height;
  this.y.range([height, 0]);

  // set height on all geoms
  _.each(this.geom(), function(geom) {
    geom.height(height);
  });
  return this;
}

Layer.prototype.width = function(width) {
  if (!arguments.length) return this._width;
  this._width = width;
  this.x.range([0, width]);

  // set width on all geoms
  _.each(this.geom(), function(geom) {
    geom.width(width);
  });
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
  if (!this.geom()) {
    return this;
  }

  // call update on all geoms
  _.each(this.geom(), function(geom) {
    geom.update(domain);
  });
  // taken form figure.js. grab consolidated yview
  y_domains = _.invoke(this.geom(), 'yview');
  //merged y-domains
  y_min = d3.min(y_domains, function(d) { return d[0] });
  y_max = d3.max(y_domains, function(d) { return d[1] });
  this.yview([y_min, y_max]);
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

// shortcut for creating svg elements
Layer.prototype.createElement = svg.createElement;

module.exports = Layer;

var View = require('./view.js');
Layer.prototype.view = function() {
  return new View().layer(this);
}
