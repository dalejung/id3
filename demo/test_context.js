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
var HEIGHT = 800;

var svg = d3.select('#main');
var svg2 = d3.select('#second');
var focus_svg = d3.select('#focus');
focus = Figure();
focus.width(800)
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
  .width(400)
  .height(200)
  .index(df.index);
fig2(svg2);

fig2.x.attach(brush);

fig2.layer(line, 'line');

var markers = Layer().data({'x': df.gap_up, 'y': df.open})
  .geom(Marker()
    .color('blue')
    .type('circle')
    .size(50))
  .geom(Marker()
    .color('yellow')
    .type('circle')
    .size(30));
fig.layer(markers, 'gapup');

var circle = svg.append('svg:circle')
  .attr('class', 'value')
  .attr('cy', 100)
  .attr('r', 5);

var format = d3.time.format("%Y-%m-%d");
svg.on("mousemove", function() { 
  var x = d3.mouse(this)[0];
  circle.attr('cx', x);
  var d = Math.round(fig.x.scale.invert(x-40));
  var startx = fig.x.domain()[0];
  var el = fig.selection.selectAll('.candlestick')[0][d - startx];
  d3.selectAll('.candlestick rect').attr('class', '');
  d3.select(el).select('rect').attr('class', 'blue');
  var text = '';
  for (var key in df) {
    if (!(df[key] instanceof Array)) {
      continue;
    }
    var bit = df[key][d];
    if (key == 'index') {
      bit = format(new Date(bit /1000000));
    }
    text += key + ': '+bit + '<br />';
  }
  d3.select('#data-panel').html(text);
});

