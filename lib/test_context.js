var d3 = require('d3');
var fs = require('fs');

// data
var content = fs.readFileSync('./df.json');
var df = JSON.parse(content);

var Figure = require('./figure.js');
var Line = require('./line.js');
var CandleStick = require('./candlestick.js');

var df2 = [];
var i = 0;
while (i++ < df.high.length) {
  df2.push(df.high[i]+1);
}

var line = Line().data(df2);
var line2 = Line().data(df.high);
var candle = CandleStick();

candle.data(df);

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');
var focus = d3.select('body').append('svg:svg').attr('class', 'focus');

line2.y.range([100, 0]);
line2.x.range([0, 800]);
line2(focus);


fig = Figure();
fig.width(800).height(600).index(df.index);
fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

var datax = d3.scale.linear().domain([0, df.index.length]).range([0, 800]);
var brush = d3.svg.brush()
    .x(datax);
fig.x.attach(brush);

focus.attr("height", 100).attr('width', 800);
var context_div = focus
  .append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", 100 + 7);

fig.xchange([600, 610]);
fig(svg);
fig.redraw();

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    
var y = candle.y
var d = 30;
var height = y(df.high[d]);
var height2 = line.y(df.high[d])

var xAxis = d3.svg.axis()
  .scale(fig.x)

var yAxis = d3.svg.axis().orient('right')
  .scale(fig.y.scale)

svg.append('svg:g').call(yAxis);

module.exports = null;
