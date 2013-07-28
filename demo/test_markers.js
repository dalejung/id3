var http = require('http');
var d3 = require('d3');
var fs = require('dfs');
var _ = require('underscore');
var id3 = require('id3');
var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var Marker = id3.Marker;
var Layer = require('../lib/layer.js');

// data
var df = require('./data.js');

var high = Line().data(df.high);
var markers = Marker().data({'x': df.gap_up, 'y': df.open});
var candle = Candlestick().data(df);
var layer = new Layer().data(df.low);

layer.geom(Line());
layer.geom(Marker().type('rect').size(8).color('pink'));

var WIDTH = 800;
var HEIGHT = 400;

d3.selectAll('body svg').remove();
var svg = d3.select('body').append('svg:svg');

fig = Figure();
fig
  .width(WIDTH)
  .height(HEIGHT)
  .index(df.index);
fig(svg);

fig.layer(high, 'line');
fig.layer(layer, 'layer');
fig.layer(markers, 'marker');
fig.layer(candle, 'candle');

// default to only first 100
fig.xchange([0, 100]);

fig.default_layout();

module.exports = null;
