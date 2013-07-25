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
  this._padding = {};
  this._margin = {};
  this.index = null;
  this.layers = {};
  this.selection = null;
  this.canvas = null;

  // default margin
  this.margin(0);
  this.padding(0);

  var self = this;
  this.x.on('change.figure', function(domain) {
    self.xchange(domain);
  }); 

  this.__call__ = function(selection) {
    var margin = this.margin();
    var width = this.width();
    var height = this.height();
    selection.attr('width', width+margin.left);
    selection.attr('height', height+margin.top);
    var canvas = selection.selectAll('g.canvas').data([1]);

    canvas.enter().append('svg:g')
      .attr('class', 'canvas');
    canvas
      .attr("transform", "translate("+margin.left+", "+margin.top+")");

    this.selection = selection;
    this.canvas = canvas;
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

    // resize svg and canvas if needed
    this(this.selection);

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

  this.layer = function(layer, id, redraw) {
    if (layer.size() != this.index().length) {
      throw new Error('Layer data length mismatch fig.length:' + this.index().length
          + id +'.size():' + layer.size());
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

    // redraw figure? this can be expensive if adding many layers
    redraw = 'undefined' == typeof(redraw) ? true  : redraw;
    if (redraw) {
      this.redraw(); 
    }
  }
}


Figure.prototype.width = function(width) {
  if (!arguments.length) return this._width;
  this._width = width;
  this.x.range([0, width]);
  return this;
}

Figure.prototype.height = function(height) {
  if (!arguments.length) return this._height;
  this._height = height;
  this.y.range([height, 0]);
  return this;
}

Figure.prototype.padding = function(padding) {
  if (!arguments.length) return this._padding;
  this._padding = padding;
  return this;
}

Figure.prototype.margin = function(margin) {
  if (!arguments.length) return this._margin;
  if (typeof(margin) == 'number') {
    margin = {'top': margin, 'left': margin, 'right': margin, 'bottom': margin};
  }
  this._margin = _.extend(this._margin, margin);
  return this;
}

module.exports = callable(Figure);
// monkey patches
require('./axes.js');
require('./brush.js');
