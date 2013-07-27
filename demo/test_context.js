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
var svg3 = d3.select('body').append('svg:svg');
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
  .width(800)
  .height(300)
  .index(df.index);
fig2(svg2);

fig2.x.attach(brush);
fig2.grid();
fig2.axes();
fig2.layer(line, 'line');

var markers = Marker().data({'x': df.gap_up, 'y': df.open}).color('green');
fig.layer(markers, 'gapup');

fig3 = Figure();
fig3
  .margin({'left':40})
  .width(1300)
  .height(100)
  .index(df.index);
fig3(svg3);

fig3.x.attach(brush);
fig3.grid();
fig3.axes();
fig3.layer(line, 'line');

