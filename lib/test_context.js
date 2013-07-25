var d3 = require('d3');
var fs = require('fs');
var _ = require('underscore');
var default_layout = require('./axes.js').default_layout;
require('./brush');

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

var line = Line().data(df2);
var line2 = Line().data(df.high);
var candle = CandleStick().data(df);

var WIDTH = 1400;
var HEIGHT = 800;

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');
var svg2 = d3.select('body').append('svg:svg');
var focus_svg = d3.select('body').append('svg:svg').attr('class', 'focus');

focus = Figure();
focus.width(WIDTH)
  .margin({'left':40})
  .height(100)
  .index(df.index);

focus(focus_svg);
focus.layer(line2, 'focus');
var brush = focus.brush();

fig = Figure();
fig
  .width(WIDTH)
  .height(HEIGHT)
  .index(df.index);
fig(svg);

fig.x.attach(brush);

fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

// default to only first 100
fig.xchange([0, 100]);

fig.default_layout();

fig2 = Figure();
fig2
  .margin({'left':40})
  .width(WIDTH)
  .height(300)
  .index(df.index);
fig2(svg2);

fig2.x.attach(brush);
fig2.layer(line, 'line');
fig2.layer(line, 'line');
fig2.grid();

module.exports = null;
