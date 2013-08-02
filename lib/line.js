var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');

var id3_id = 0;

Line.prototype = Object.create(Layer.prototype);
function Line() {
  this.id = id3_id++;
  this._color = null;

  Layer.call(this);

  this.color('blue');

  this.__call__ = function(selection) {
    selection.selectAll('path.this'+this.id).data([0]).enter().append('svg:path').attr('class', 'this'+this.id);
    var path = selection.selectAll('.this'+this.id).style('stroke', this.color()).style('fill', 'none');
    path.attr('d', this.path_gen());
  }

  this.path_gen = function() {
    var data = this.data();
    var x = this.x;
    var y = this.y;
    var domain = x.domain();

    var line = d3.svg.line()
      .x(x)
      .y(function(d) { return y(data[d])});

    range = d3.range(domain[0], domain[1]);
    return line(range);
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

module.exports = callable(Line)
