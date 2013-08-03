var d3 = require('d3');
var figure = require('./figure.js')

format = d3.time.format("%Y-%m-%d");
var now = new Date();
var utc_offset = now.getTimezoneOffset() * 60000;

function default_layout(fig) {
  axes(fig, false);
  grid(fig, false);
  fig.redraw();
}

function axes(fig, redraw) {
  // don't redraw for seprate axes
  axes_x(fig, false);
  axes_y(fig, false);

  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

function axes_x(fig, redraw) {
  var index = fig.index();
  function axis_format(d, i) {
    var date = new Date(index[d] / 1000000 + utc_offset);
    return format(date);
  }

  // make space for axes
  fig.margin({'top': 40});

  var xAxis = d3.svg.axis().orient('top')
    .scale(fig.x.scale)
  xAxis.tickFormat(axis_format);

  fig.canvas.append('svg:g').attr('class', 'axis x').call(xAxis)

  fig.x.on('change.axis',function() {
    fig.canvas.select('g.axis.x').call(xAxis);
  });
  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

function axes_y(fig, redraw) {
  // make space for axes
  fig.margin({'left': 40});
  var yAxis = d3.svg.axis().orient('left')
    .scale(fig.y.scale)
  fig.canvas.append('svg:g').attr('class', 'axis y').call(yAxis)
  fig.x.on('change.yaxis',function() {
    fig.canvas.select('g.axis.y').call(yAxis);
  });
  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

function grid(fig) {
  var xGrid = d3.svg.axis().orient('bottom')
    .scale(fig.x.scale).tickSize(fig.height(), 0, 0).tickFormat("");
  var yGrid = d3.svg.axis().orient('right')
    .scale(fig.y.scale).tickSize(fig.width(), 0, 0).tickFormat("");
  fig.canvas.append('svg:g').attr('class', 'grid y').call(yGrid)
  fig.canvas.append('svg:g').attr('class', 'grid x').call(xGrid)

  fig.x.on('change.grid',function() {
    fig.canvas.select('g.grid.x').call(xGrid)
    fig.canvas.select('g.grid.y').call(yGrid)
  });
  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

figure.prototype.default_layout = function() {
  return default_layout(this);
}

figure.prototype.grid = function() {
  return grid(this);
}
figure.prototype.axes = function() {
  return axes(this);
}
figure.prototype.axes_y = function(redraw) {
  return axes_y(this, redraw);
}
figure.prototype.axes_x = function(redraw) {
  return axes_x(this, redraw);
}

module.exports.default_layout = default_layout;
