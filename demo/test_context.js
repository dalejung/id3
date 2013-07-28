var http = require('http');
var d3 = require('d3');
var fs = require('dfs');
var _ = require('underscore');
var id3 = require('id3');
var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var Marker = id3.Marker;
var Layer = id3.Layer;

// data
var df = require('./data.js');


var df2 = [];
var i = -1;
while (++i < df.high.length) {
  df2.push(df.high[i]+1);
}

var line = Line().data(df2);
var line2 = Line().data(df.high);
var candle = Candlestick().data(df);

var WIDTH = 1200;
var HEIGHT = 400;

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');
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

var markers = Layer().data({'x': df.gap_up, 'y': df.open})
  .geom(Marker()
    .color('blue')
    .type('circle')
    .size(13))
  .geom(Marker()
    .color('yellow')
    .type('circle')
    .size(8));
fig.layer(markers, 'gapup');

module.exports = null;
