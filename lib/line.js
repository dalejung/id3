var d3 = require('d3');
var callable = require('./callable.js');

var id3_id = 0;

function Line() {
  this.id = id3_id++, 
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
  this._width = 0; 
  this._height = 0;
  this._data = null; 

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

  this.width = function(width) {
    if (!arguments.length) return this._width;
    this._width = width;
    this.x.range([0, width]);
    return this;
  }

  this.height = function(height) {
    if (!arguments.length) return this._height;
    this._height = height;
    this.y.range([height, 0]);
    return this;
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

  this.xview = function(domain) {
    if (!arguments.length) return this.x.domain();
    this.x.domain(domain);
    return this;
  }

  this.yview = function(domain) {
    if (!arguments.length) return this.y.domain();
    this.y.domain(domain);
    return this;
  }

  return this;
}

module.exports = callable(Line)
