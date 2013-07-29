var d3 = require('d3');
var figure = require('./figure.js')

function fig_brush(fig, height) {
  var length = fig.index().length;
  var brush = d3.svg.brush()
      .x(fig.x.scale);

  // attach brush to dom
  var gbrush = fig.canvas
    .append("g")
        .attr("class", "x brush");

  gbrush
      .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", fig.height() + 7);

  brush.g = gbrush;
  return brush;
}

figure.prototype.brush = function() {
  return fig_brush(this);
}

module.exports = fig_brush;
