var http = require('http');
var d3 = require('d3');
var fs = require('dfs');
var _ = require('underscore');
var id3 = require('id3');
var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var Marker = id3.Marker;

// data
var df = require('./data.js');

var high = Line().data(df.high);
var markers = Marker().data({'x': df.gap_up, 'y': df.open});
var candle = Candlestick().data(df);

var WIDTH = 800;
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
focus.layer(high, 'focus');
var brush = focus.brush();

fig = Figure();
fig
  .width(WIDTH)
  .height(HEIGHT)
  .index(df.index);
fig(svg);

fig.x.attach(brush);

fig.layer(high, 'line');
fig.layer(markers, 'marker');
fig.layer(candle, 'candle');

// default to only first 100
//fig.xchange([0, 100]);

fig.default_layout();

//module.exports = null;
