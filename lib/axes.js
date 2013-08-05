var d3 = require('d3');
var figure = require('./figure.js')
var DTAxis = require('./date/axis.js');

function default_layout(fig) {
  axes(fig, false);
  grid(fig, false);
  fig.redraw();
}

function axes(fig, redraw) {
  // don't redraw for seprate axes
  axes_x(fig, {'redraw':false});
  axes_y(fig, {'redraw':false});

  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

function axes_x(fig, config) {
  if (!config) { config = {};}

  orient = config.orient ? config.orient : 'top'; 

  if (orient == 'top') {
    fig.margin({'top': 40});
  } else {
    fig.margin({'bottom': 40});
  }

  var xAxis = DTAxis().orient(orient)
    .scale(fig.x.scale)
    .index(fig.index());

  fig.xaxis = xAxis;

  var g = fig.canvas.append('svg:g').attr('class', 'axis x');
  if(orient == 'bottom') {
    g.attr('transform', 'translate(0,'+fig.height()+')');
  }
  g.call(xAxis);

  fig.x.on('change.axis',function() {
    fig.canvas.select('g.axis.x').call(xAxis);
  });

  fig.on('width.xaxis',function() {
    fig.canvas.select('g.axis.x').call(xAxis);
  });

  redraw = config.redraw
  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
}

function axes_y(fig, config) {
  if (!config) { config = {};}
  // make space for axes
  orient = config.orient ? config.orient : 'left'; 

  if (orient == 'left') {
    fig.margin({'left': 40});
  } else {
    fig.margin({'right': 40});
  }

  var yAxis = DTAxis().orient(orient)
    .scale(fig.y.scale)
  fig.canvas.append('svg:g').attr('class', 'axis y').call(yAxis)

  fig.x.on('change.yaxis',function() {
    fig.canvas.select('g.axis.y').call(yAxis);
  });
  fig.on('height.yaxis',function() {
    fig.canvas.select('g.axis.y').call(yAxis);
  });

  redraw = config.redraw
  redraw = 'undefined' == typeof(redraw) ? true  : redraw;
  if (redraw) {
    fig.redraw(); 
  }
  return yAxis;
}

function grid(fig, xaxis) {
  var xGrid = DTAxis().orient('bottom')
    .scale(fig.x.scale).tickSize(fig.height(), 0, 0).tickFormat("");
  var yGrid = DTAxis().orient('right')
    .scale(fig.y.scale).tickSize(fig.width(), 0, 0).tickFormat("");
  fig.canvas.append('svg:g').attr('class', 'grid y').call(yGrid)
  fig.canvas.append('svg:g').attr('class', 'grid x').call(xGrid)

  if (!xaxis) {
    xaxis = fig.xaxis;
  }

  // if width changes, we need to respace xticks
  fig.on('width.grid',function() {
    xGrid.tickSize(fig.height(), 0, 0);
    fig.canvas.select('g.grid.x').call(xGrid)
  })

  // if height changes, we need to respace yticks
  fig.on('height.grid',function() {
    yGrid.tickSize(fig.width(), 0, 0);
    fig.canvas.select('g.grid.y').call(yGrid)
  })

  fig.x.on('change.grid',function() {
    if (xaxis) {
      var ticks = xaxis.tickValues();
      xGrid.tickValues(ticks);
    }
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

figure.prototype.grid = function(context) {
  return grid(this, context);
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
