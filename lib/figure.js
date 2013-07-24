var d3 = require('d3');
var axis = require('./context.js');
var _ = require('underscore');
var callable = require('./callable.js');

var id3_id = 0;

function Figure() {
  this.x = axis();
  this.y = axis();
  this._width = 800;
  this._height = 400; 
  this._padding = 50;
  this.index = null;
  this.layers = {};
  this.canvas = null;

  var self = this;
  this.x.on('change.figure', function(domain) {
    self.xchange(domain);
  }); 

  this.__call__ = function(selection) {
    var padding = this.padding();
    var width = this.width();
    var height = this.height();
    selection.attr('width', width+padding);
    selection.attr('height', height+padding);
    var canvas = selection.append('svg:g')
      .attr("transform", "translate("+padding+", "+padding+")")
      .attr('class', 'canvas');

    self.canvas = canvas;
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

  this.padding = function(padding) {
    if (!arguments.length) return this._padding;
    this._padding = padding;
    return this;
  }

  this.xchange = function(domain) {
    this.x.domain(domain);
    var layers = this.layers;

    for (var id in layers) {
      var layer = layers[id];
      layer.xview(domain);
      layer.update();
    }

    this.merge_y();
    this.redraw();
    return this;
  }

  this.merge_y = function() {
    y_domains = _.invoke(this.layers, 'yview');
    //merged y-domains
    y_min = d3.min(y_domains, function(d) { return d[0] });
    y_max = d3.max(y_domains, function(d) { return d[1] });

    new_y = [y_min, y_max];
    this.y.domain(new_y);

    // update the layers of the merged view
    _.invoke(this.layers, 'yview', new_y);
  }

  this.redraw = function() {
    var canvas = this.canvas;
    if (!canvas) {
      return;
    }
    _.each(this.layers, function(layer) {
      layer(canvas);
    });
  }

  this.index = function(index) {
    if (!arguments.length) return this._index;
    this._index = index;
    // init x-axis
    this.x.domain([0, index.length]);
    return this;
  }

  this.layer = function(layer, id) {
    if (layer.length != this.index.length) {
      throw new Error('Layer data length mismatch');
    }
    if (!id) {
      id = 'layer_'+id3_id++;
    }
    var layers = this.layers;

    layers[id] = layer;
    // sync to plot
    layer.xview(this.x.domain());
    layer.yview(this.y.domain());
    layer.width(this.width());
    layer.height(this.height());

    layer.xview(this.x.domain());
    layer.update();
  }
}

module.exports = callable(Figure)
