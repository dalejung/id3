var d3 = require('d3');
var figure = require('./figure.js')

function fig_brush(fig, height) {
  var length = fig.index().length;
  var datax = d3.scale.linear().domain([0, length]).range([0, fig.width()]);
  var brush = d3.svg.brush()
      .x(datax);

  // attach brush to dom
  fig.canvas
    .append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", fig.height() + 7);

  return brush;
}

figure.prototype.brush = function() {
  return fig_brush(this);
}

module.exports = fig_brush;
