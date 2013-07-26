var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');
var true_index = require('./util').true_index;
var where = require('./util').where;

var id3_id = 0;

Marker.prototype = Object.create(Layer.prototype);
function Marker() {
  this.id = id3_id++, 
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();
  this._width = 0; 
  this._height = 0;
  this._data = null; 

  Layer.call(this);

  this.__call__ = function(selection) {
    var self = this;
    var domain = this.x.domain();
    var xslice = this.data().x.slice(domain[0], domain[1]);
    var xdata = this.data().x;
    var ydata = this.data().y;

    valid = true_index(xdata, {'length':xslice.length,'start':domain[0],'end':domain[1]})

    var markers = selection.selectAll("circle.dot")
      .data(valid)

    markers.enter().append("circle")
      .attr("class", "dot")

    markers.exit().remove()

    markers.attr("r", 4)
      .attr("cx", function(d, i) { return self.x(d); })
      .attr("cy", function(d, i) { return self.y(ydata[d]); })
  }

  this.update = function() {
    var domain = this.x.domain();
    // Reset the internal y-domain
    var yvals = this.data().y.slice(domain[0], domain[1]);
    this.y.domain(d3.extent(yvals));
    return this;
  }

  this.data = function(data) {
    if (!arguments.length) return this._data;
    data.y = where(data.y, data.x) // nulls the false values
    this._data = data;

    this.x.domain([0, this.data().x.length-1]);
    this.y.domain(d3.extent(this.data().y));
    return this;
  }

  this.size = function() {
    return this.data().x.length;
  }
}

module.exports = callable(Marker)
