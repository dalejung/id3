var d3 = require('d3');
var fs = require('fs');
var _ = require('underscore');

// data
var content = fs.readFileSync('./df.json');
var df = JSON.parse(content);

_.each(df, function(arr, key) {
  if (!_.isArray(arr)) {
    return;
  }
  df[key] = _.last(arr, 500);
});

var Figure = require('./figure.js');
var Line = require('./line.js');
var CandleStick = require('./candlestick.js');

var df2 = [];
var i = -1;
while (++i < df.high.length) {
  df2.push(df.high[i]+1);
}

var line = Line().data(df2);
var line2 = Line().data(df.high);
var candle = CandleStick();

var WIDTH = 1300;
var HEIGHT = 600;

candle.data(df);

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');
var focus = d3.select('body').append('svg:svg').attr('class', 'focus');

line2.y.range([100, 0]);
line2.x.range([0, WIDTH]);
line2(focus);


fig = Figure();
fig.width(WIDTH).height(HEIGHT).index(df.index);
fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

var datax = d3.scale.linear().domain([0, df.index.length]).range([0, WIDTH]);
var brush = d3.svg.brush()
    .x(datax);
fig.x.attach(brush);

focus.attr("height", 100).attr('width', WIDTH);
var context_div = focus
  .append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", 100 + 7);

fig.xchange([300, 400]);
fig(svg);
fig.redraw();

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    
var y = candle.y
var d = 30;
var height = y(df.high[d]);
var height2 = line.y(df.high[d])

var xAxis = d3.svg.axis()
  .scale(fig.x.scale)

var yAxis = d3.svg.axis().orient('right')
  .scale(fig.y.scale)

format = d3.time.format("%Y-%m-%d");
var now = new Date();
var utc_offset = now.getTimezoneOffset() * 60000;
function axis_format(d, i) {
  var date = new Date(df.index[d] / 1000000 + utc_offset);
  return format(date);
}

xAxis.tickFormat(axis_format);

fig.x.on('change.axis',function() {
  svg.selectAll('g.axis').remove();
  svg.append('svg:g').attr('class', 'axis y').call(yAxis);
  svg.append('svg:g').attr('class', 'axis x').call(xAxis);
});

module.exports = null;
