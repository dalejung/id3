var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');
var true_index = require('./util').true_index;

var id3_id = 0;

Line.prototype = Object.create(Layer.prototype);
function Line() {
  this.id = id3_id++;
  this._id3_type = 'line';
  this._color = null;
  this._stroke_width = null;

  Layer.call(this);

  this.color('blue');

  this.__call__ = function(selection) {
    selection.selectAll('path.line'+this.id).data([0]).enter().append('svg:path').attr('class', 'line-plot line'+this.id);
    var path = selection.selectAll('.line'+this.id)
      .style('stroke', this.color())
      .style('stroke-width', this.stroke_width())
      .style('fill', 'none');
    path.attr('d', this.path_gen());
  }

  this.path_gen = function() {
    var data = this.data();
    var x = this.x;
    var y = this.y;
    var domain = x.domain();
    var length = domain[1] - domain[0];

    var valid = true_index(data, {'length':length,'start':domain[0],'end':domain[1]});
    if (!valid.length) {
      return 'M0,0';
    }

    var line = d3.svg.line()
      .x(x)
      .y(function(d) { return y(data[d]) || null});

    return line(valid);
  }

  this.update = function() {
    var domain = this.x.domain();
    // Reset the internal y-domain
    this.y.domain(d3.extent(this.data().slice(domain[0], domain[1])));
    return this;
  }

  function data_range() {
    return range;
  }

  this.data = function(data) {
    if (!arguments.length) return this._data;

    // handle pd.Series
    if (data._pandas_type == 'series') {
      data = data.data;
    }
    this._data = data;
    this.x.domain([0, data.length-1]);
    this.y.domain(d3.extent(data));
    return this;
  }

  this.data_length = function() {
    return this.data().length;
  }
}

Line.prototype.color = function(color) {
  if (!arguments.length) return this._color;
  this._color = color;
  return this;
}

Line.prototype.stroke_width = function(stroke_width) {
  if (!arguments.length) return this._stroke_width;
  this._stroke_width = stroke_width;
  return this;
}

Line.prototype.legend_icon = function() {
  var path = this.createElement('path');
  var sym = d3.svg.line();
  sym.y(1);
  sym.x(function(d) { return d });
  path.attr('d', sym(d3.range(-7, 7)));
  path.style('stroke', this.color());
  path.style('stroke-width', this.stroke_width());
  return path;
}

module.exports = callable(Line)
