var d3 = require('d3');

function View() {
  var layer = layer, 
      width = null, 
      height = null,
      x = null,
      y = null;

  function view(layer) {
    layer = layer;
    width = layer.width();
    height = layer.height();
    x = layer.x.copy();
    y = layer.y.copy();
  }

  view.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    y.range([height, 0]);
    return view;
  }

  view.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    x.range([0, width]);
    return view;
  }

  view.update = function() {
    return view.layer.update.call(this);
  }

  view.xview = function(domain) {
    if (!arguments.length) return x.domain();
    x.domain(domain);
    return view;
  }

  view.yview = function(domain) {
    if (!arguments.length) return y.domain();
    y.domain(domain);
    return view;
  }
  return view;
}

module.exports = View;
