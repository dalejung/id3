var d3 = require('d3');
var _ = require('underscore');
var svg = require('./svg.js');

var callable = require('./callable.js');

function Legend() {
  this.selection = null;
  this.layers = [];
  this.__call__ = function(selection) {
    this.selection = selection;
  }
} 

Legend.prototype.layer = function(layer) {
  if (!Array.isArray(layer)) {
    layer = [layer];
  }
  _.each(layers, function(layer) {
    this.layers.push(layer);
  });
}


function legend_icon(geom) {
  if (geom.legend_icon) {
    return geom.legend_icon();
  }
}

/*
var ypos = 5;
legend.selectAll('g').attr('transform', function(d, i) {
    var length = d3.select(this).select('text').node().getComputedTextLength() + 28;
    xpos = 5;
    ypos += 20; 
    return 'translate(' + xpos + ',' + ypos + ')';
});
legend.attr('height', ypos+20);
*/

module.exports = callable(Legend);
module.exports.legend_icon = legend_icon;
