var d3 = require('d3');
var fs = require('fs');
var _ = require('underscore');
var id3 = require('id3');
var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var View = require('id3/lib/view.js');

// data
var content = fs.readFileSync('./df.json');
var df = JSON.parse(content);

_.each(df, function(arr, key) {
  if (!_.isArray(arr)) {
    return;
  }
  df[key] = _.last(arr, 1500);
});


var df2 = [];
var i = -1;
while (++i < df.high.length) {
  df2.push(df.high[i]+1);
}

var line = Line().data(df2);
var line2 = Line().data(df.high);
var candle = Candlestick().data(df);

var WIDTH = 800;
var HEIGHT = 400;

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

view = View();
view.layer(line);
fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

// default to only first 100
fig.xchange([0, 100]);

fig.default_layout();

fig2 = Figure();
fig2
  .margin({'left':40})
  .width(400)
  .height(300)
  .index(df.index);
fig2(svg2);

view = View();
view.layer(line);
fig2.x.attach(brush);
fig2.grid();
fig2.axes();
fig2.layer(view, 'line');

fig3 = Figure();
fig3
  .margin({'left':40})
  .width(3000)
  .height(100)
  .index(df.index);
fig3(svg3);

view = View();
view.layer(line);
fig3.x.attach(brush);
fig3.grid();
fig3.axes();
fig3.layer(view, 'line');

module.exports = null;
