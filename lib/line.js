var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');

var id3_id = 0;

Line.prototype = Object.create(Layer.prototype);
function Line() {
  this.id = id3_id++, 
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
  this._width = 0; 
  this._height = 0;
  this._data = null; 

  Layer.call(this);

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
    this._data = data;
    this.x.domain([0, data.length-1]);
    this.y.domain(d3.extent(data));
    return this;
  }

  this.size = function() {
    return this.data().length;
  }

  this.__call__ = function(selection) {
    selection.selectAll('path.this'+this.id).data([0]).enter().append('svg:path').attr('class', 'this'+this.id);
    var path = selection.selectAll('.this'+this.id).style('stroke','blue').style('fill', 'none');
    path.attr('d', this.path_gen());
  }
}

module.exports = callable(Line)
