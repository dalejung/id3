var http = require('http');
var d3 = require('d3');
var fs = require('dfs');
var _ = require('underscore');
var id3 = require('id3');
require('jquery-browserify');
var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var Marker = id3.Marker;
var Layer = id3.Layer;
var Legend = id3.Legend;

// data
var df = require('./data.js');

var line = Line().data(df.high).color('green');
var vol = Line().data(df.vol).color('blue');
var candle = Candlestick().data(df);

var svg = d3.select('#main');
var svg2 = d3.select('#second');
var focus_svg = d3.select('#focus');
focus = Figure();
focus
  .margin({'left':40})
  .height(100)
  .index(df.index);

focus(focus_svg);
focus.layer(line, 'focus');
focus.axes_x({orient:'bottom'});
var brush = focus.brush();

fig = Figure();
fig
  .index(df.index);
fig(svg);

fig.x.attach(brush);

fig.default_layout();

fig2 = Figure();
fig2
  .index(df.index);
fig2(svg2);

fig2.x.attach(brush);
fig2_y = fig2.axes_y();
fig2_y.axis.tickFormat(function(d) { return d/100000 });
fig2.grid(fig.xaxis);


fig.layer(line, 'high');
fig.layer(candle, 'candle');

fig2.layer(vol, 'Volume');

updateWindow();// set width/height

var markers = Layer().data({'x': df.gap_up, 'y': df.open})
  .geom(Marker()
    .color('yellow')
    .type('circle')
    .size(50))
fig.layer(markers, 'gapup');

// add legend
var legend = d3.select('#legend');
var l = Legend();
l.layer(fig.layers);
l(legend);
$('#legend').draggable({'cursor':'move'});


// playing with mouseover stuff for figure
var vert = svg.append('svg:line')
  .attr('class', 'value')
  .attr('y1', 0)
  .attr('y2', fig.height())

var format = d3.time.format("%Y-%m-%d");
svg.on("mousemove", function() { 
  var x = d3.mouse(this)[0];
  vert.attr('x1', x);
  vert.attr('x2', x);
  var d = Math.round(fig.x.scale.invert(x-40));
  var startx = fig.x.domain()[0];
  var text = '';
  for (var key in df) {
    if (!(df[key] instanceof Array)) {
      continue;
    }
    var bit = df[key][d];
    if (key == 'index') {
      // DatetimeIndex wil turn ns -> ms inplace
      // so the original index array is also changed.
      bit = format(new Date(bit));
    }
    text += key + ': '+bit + '<br />';
  }
  d3.select('#data-panel').html(text);
});
$('#data-panel').draggable({'cursor':'move'});

function updateWindow() {
    var width = window.innerWidth - 60;
    var height = window.innerHeight * .40;
    fig.width(width).height(height);
    fig2.height(height/2).width(width);
    focus.width(width);
}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(updateWindow, 100);
};
