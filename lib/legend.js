var d3 = require('d3');
var _ = require('underscore');
var svg = require('./svg.js');

var callable = require('./callable.js');

function Legend() {
  this.selection = null;
  this.layers = [];
  this.__call__ = function(selection) {
    this.selection = selection;
    _.each(this.layers, function(layer) {
        var geom = layer.geom()[0];
        var type = geom._id3_type;
        var icon = geom.legend_icon(geom);
        if (!icon) {
            return;
        }
        var g = selection.append('svg:g');
        g.node().appendChild(icon.node());
        g.append('text')
            .text(layer.layer_name)
            .attr('dx', 8)
            .attr('dy', '.32em')
    });
    // reposition correctly
    var ypos = 5;
    selection.selectAll('g').attr('transform', function(d, i) {
        xpos = 5;
        ypos += 20; 
        return 'translate(' + xpos + ',' + ypos + ')';
    });
    selection.attr('height', ypos+20);
  }
} 

Legend.prototype.layer = function(layer) {
  if (!Array.isArray(layer)) {
    layer = [layer];
  }
  var self = this;
  _.each(layer, function(layer) {
    self.layers.push(layer);
  });
}

module.exports = callable(Legend);
