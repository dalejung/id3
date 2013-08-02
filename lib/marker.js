var d3 = require('d3');
var _ = require('underscore');

var callable = require('./callable.js');
var Layer = require('./layer.js');
var true_index = require('./util').true_index;
var where = require('./util').where;

var id3_id = 0;

Marker.prototype = Object.create(Layer.prototype);
function Marker() {
  this.id = id3_id++;
  this.svg_type = null;
  this._id3_type = 'marker';
  this.class_name = 'marker';
  this._size = null;
  this._color = null;
  this.path_gen = d3.svg.symbol();

  this.color('blue');
  this.type('circle');
  this.size(20);

  Layer.call(this);

  var pow = d3.scale.pow().exponent(2);

  this.__call__ = function(selection) {
    var self = this;
    var domain = this.x.domain();
    var xslice = this.data().x.slice(domain[0], domain[1]);
    var xdata = this.data().x;
    var ydata = this.data().y;

    // grab only the values that are true
    valid = true_index(xdata, {'length':xslice.length,'start':domain[0],'end':domain[1]});

    // scale size
    var length = xslice.length;
    var point = this.width() / length;
    var divisor = 100;
    var marker_width = point * this.size() / divisor;
    marker_width += Math.log(length / (1+point)) - 1;
    var size = Math.pow(marker_width, 2);
    this.path_gen.size(size);

    var g = selection.selectAll('g.markers-'+this.id).data([1]);

    g.enter()
      .append('svg:g')
      .attr("class", "marker-plot markers-"+this.id);

    var markers = g.selectAll('path')
      .data(valid);

    markers.enter().append("path");
    markers.exit().remove();

    markers.attr("fill", this.color());
    markers.attr("stroke", 'black');

    markers
      .attr("transform", 
          function(d) { return "translate("+ self.x(d) + "," + self.y(ydata[d]) + ")";})
      .attr("d", this.path_gen);
  }

  this.update = function() {
    var domain = this.x.domain();
    // Reset the internal y-domain
    var yvals = this.data().y.slice(domain[0], domain[1]);
    this.y.domain(d3.extent(yvals));
    return this;
  }
}

Marker.prototype.data = function(data) {
  if (!arguments.length) return this._data;

  if (data instanceof Array) {
    // Series passed in with each non-null value 
    // resulting in a marker.
    y = data;
    data = {};
    data.y = y;
    data.x = where(d3.range(0, y.length), data.y);
  } 
  else if (data._pandas_type == 'series') {
    y = data.data;
    data = {};
    data.y = y;
    data.x = where(d3.range(0, y.length), data.y);
  }
  else {
    data.y = where(data.y, data.x) // nulls the false values
  }
  this._data = data;

  this.x.domain([0, this.data().x.length-1]);
  this.y.domain(d3.extent(this.data().y));
  return this;
}

Marker.prototype.data_length = function() {
  return this.data().x.length;
}

Marker.prototype.type = function(type) {
  if (!arguments.length) return this.svg_type;
  this.svg_type = type;
  this.path_gen.type(type);
  return this;
}

Marker.prototype.size = function(size) {
  if (!arguments.length) return this._size;
  this._size = size;
  this.path_gen.size(size);
  return this;
}

Marker.prototype.color = function(color) {
  if (!arguments.length) return this._color;
  this._color = color;
  return this;
}

function elem() {
  // older rect/circle svg shape stuff
  var markers = g.selectAll(this.svg_type+"."+this.class_name)
    .data(valid)

  markers.enter().append(this.svg_type)
    .attr("class", this.class_name)

  markers.exit().remove()

  markers.attr("fill", this.color())

  xmap = function(d, i) { return self.x(d) }
  ymap = function(d, i) { return self.y(ydata[d]) }
  if (this.svg_type == 'circle') {
    circle.call(this, markers, xmap, ymap);
  }
  if (this.svg_type == 'rect') {
    rect.call(this, markers, xmap, ymap);
  }
}

function circle(markers, xmap, ymap) {
  markers.attr("r", this.size())
    .attr("cx", xmap)
    .attr("cy", ymap)
}

function rect(markers, xmap, ymap) {
  var xshift = this.size() / 2;
  var yshift = this.size() / 2;
  markers.attr("width", this.size())
    .attr("height", this.size())
    .attr("x", function(d) { return xmap(d) - xshift})
    .attr("y", function(d) { return ymap(d) - yshift})
}

module.exports = callable(Marker)
