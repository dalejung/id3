var d3 = require('d3');
var fs = require('fs');
var _ = require('underscore');
var default_layout = require('./axes.js').default_layout;

// data
var content = fs.readFileSync('./df.json');
var df = JSON.parse(content);

_.each(df, function(arr, key) {
  if (!_.isArray(arr)) {
    return;
  }
  df[key] = _.last(arr, 1500);
});

var Figure = require('./figure.js');
var Line = require('./line.js');
var CandleStick = require('./candlestick.js');

var df2 = [];
var i = -1;
while (++i < df.high.length) {
  df2.push(df.high[i]+1);
}

var b = Line()
var line = Line().data(df2);
var line2 = Line().data(df.high);
console.log(line.size.toString());
var candle = CandleStick();

var WIDTH = 1400;
var HEIGHT = 800;
var padding = 50;

candle.data(df);

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');
var focus_svg = d3.select('body').append('svg:svg').attr('class', 'focus');

line2.y.range([100, 0]);
line2.x.range([0, WIDTH]);

focus = Figure();
focus.margin(40).width(WIDTH).height(100).index(df.index);
focus(focus_svg);
focus.layer(line2, 'focus');
focus.redraw();

fig = Figure();
fig.margin(40).width(WIDTH).height(HEIGHT).index(df.index);
fig(svg);

var datax = d3.scale.linear().domain([0, df.index.length]).range([0, WIDTH]);
var brush = d3.svg.brush()
    .x(datax);
fig.x.attach(brush);

fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

fig.redraw();
fig.xchange([300, 400]);

default_layout(fig);

var context_div = focus_svg
  .append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", 100 + 7);


module.exports = null;
