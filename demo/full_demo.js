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
// self brushing
var fbrush = fig.brush();
fbrush.on('brushend.clear', function() {
  var domain = fbrush.extent();
  domain = _.map(domain, Math.round); // brush should always round domain?
  if (domain[1] - domain[0] < 10) {
    // don't allow brushing less than 10
    fbrush.clear();
    fbrush(fbrush.g);
    return;
  }
  brush.extent(domain);
  brush(brush.g)
  // this should have to be called here
  // this is another issue with not abstracting shared axis
  fig.x.change(domain);
  fig2.x.change(domain);
  // when self brushing, remove selection after we show it
  fbrush.clear();
  fbrush(fbrush.g);
});

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
/*
var vert = fig.canvas.append('svg:line')
  .attr('class', 'value')
  .attr('y1', 0)
  .attr('y2', fig.height())

*/
var format = d3.time.format("%Y-%m-%d");
svg.on("mousemove.vert", function() { 
  var x = d3.mouse(this)[0];
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
  //vert.attr('x1', x-40);
  //vert.attr('x2', x-40);
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

