var d3 = require('d3');
var axis = require('./context.js');
var _ = require('underscore');

function Figure(){
  var x = axis(),
      y = axis(),
      width = 800,
      height = 400, 
      index = null,
      layers = plot.layers = {};

  x.on('change.figure', function(domain) {
    plot.xchange(domain);
  }); 

  function plot(selection) {
    plot.selection = selection;
    selection.attr('width', width);
    selection.attr('height', height);
  }

  plot.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    this.x.range([0, width]);
    return plot;
  }

  plot.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    this.y.range([height, 0]);
    return plot;
  }

  plot.xchange = function(domain) {
    console.log(domain);
    plot.x.domain(domain);

    for (var id in layers) {
      var layer = layers[id];
      layer.xview(domain);
      layer.update();
    }

    plot.merge_y();
    plot.redraw();
    return plot;
  }

  plot.merge_y = function() {
    y_domains = _.invoke(fig.layers, 'yview');
    //merged y-domains
    y_min = d3.min(y_domains, function(d) { return d[0] });
    y_max = d3.max(y_domains, function(d) { return d[1] });

    new_y = [y_min, y_max];
    y.domain(new_y);

    // update the layers of the merged view
    _.invoke(layers, 'yview', new_y);
  }

  plot.redraw = function() {
    if (!plot.selection) {
      return;
    }
    _.each(layers, function(layer) {
      layer(plot.selection);
    });
  }

  plot.index = function(_) {
    if (!arguments.length) return index;
    index = _;
    // init x-axis
    this.x.domain([0, index.length]);
    return plot;
  }

  plot.layer = function(layer, id) {
    if (layer.length != plot.index.length) {
      throw new Error('Layer data length mismatch');
    }
    if (!id) {
      id = 'layer_'+id3_id++;
    }
    layers[id] = layer;
    // sync to plot
    layer.xview(plot.x.domain());
    layer.yview(plot.y.domain());
    layer.width(width);
    layer.height(height);
  }

  plot.x = x;
  plot.y = y;
  return plot;
}

module.exports = Figure
