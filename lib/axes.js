var d3 = require('d3');

format = d3.time.format("%Y-%m-%d");
var now = new Date();
var utc_offset = now.getTimezoneOffset() * 60000;

function default_layout(fig) {
  var index = fig.index();
  function axis_format(d, i) {
    var date = new Date(index[d] / 1000000 + utc_offset);
    return format(date);
  }

  var xAxis = d3.svg.axis().orient('top')
    .scale(fig.x.scale)
  var yAxis = d3.svg.axis().orient('left')
    .scale(fig.y.scale)
  xAxis.tickFormat(axis_format);

  var xGrid = d3.svg.axis().orient('bottom')
    .scale(fig.x.scale).tickSize(fig.height(), 0, 0).tickFormat("");
  var yGrid = d3.svg.axis().orient('right')
    .scale(fig.y.scale).tickSize(fig.width(), 0, 0).tickFormat("");

  fig.canvas.append('svg:g').attr('class', 'axis y').call(yAxis)
  fig.canvas.append('svg:g').attr('class', 'axis x').call(xAxis)

  fig.canvas.append('svg:g').attr('class', 'grid y').call(yGrid)
  fig.canvas.append('svg:g').attr('class', 'grid x').call(xGrid)

  fig.x.on('change.axis',function() {
    fig.canvas.select('g.axis.x').call(xAxis);
    fig.canvas.select('g.axis.y').call(yAxis);
    fig.canvas.select('g.grid.x').call(xGrid)
    fig.canvas.select('g.grid.y').call(yGrid)
  });
}

module.exports.default_layout = default_layout;
