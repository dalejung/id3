var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');

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

    // df.ix[domain[0], domain[1]].true().index;
    var valid = new Array(xslice.length);
    var j = 0;
    for (var i=domain[0]; i < domain[1]; i++) {
      if (xdata[i]) {
        valid[j] = i;
        j++;
      }
    }
    valid = valid.slice(0, j);

    var markers = selection.selectAll("circle.dot")
      .data(valid)

    markers.enter().append("circle")
      .attr("class", "dot")

    markers.exit().remove()

    markers.attr("r", 3.5)
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
    // data.y.where(data.x)
    var ywhere = data.y.slice(0);
    for (var i=0; i < data.x.length; i++) {
      if (!data.x[i]) {
        ywhere[i] = null;
      }
    }
    data.y = ywhere;
    this._data = data;

    this.x.domain([0, this.data().x.length-1]);
    this.y.domain(d3.extent(this.data().y));
    return this;
  }

  this.size = function() {
    return this.data().x.length;
  }
}

function bool_to_pairs(x, y) {
  var length = x.length;
  var xdata = new Array(length);
  var ydata = new Array(length);
  var j=0;
  for (var i=0; i < length; i++) {
    if(x[i]) {
      xdata[j] = i;
      ydata[j] = y[i];
      j++;
    }
  }

  ydata = ydata.slice(0, j);
  xdata = xdata.slice(0, j);
  return {'x': xdata, 'y': ydata}
}

module.exports = callable(Marker)
