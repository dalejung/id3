var ipy = require('ipy_node');
var id3 = require('id3');
var d3 = require('d3');
var _ = require('underscore');

var Line = id3.Line;
var Figure = id3.Figure;
var Candlestick = id3.Candlestick;
var Marker = id3.Marker;
var Layer = id3.Layer;
var Legend = id3.Legend;
var lab = id3.lab;

/*
var notebook_id = "cd0c1d23-97bd-5567-9dad-f8518a928f6b";
lab.kernel_execute("http://idale.local:8888", notebook_id, main);
*/

var out = require('./data.js');
// call main function in global scope
// normally this is part of lab.kernel_execute callback handler
setTimeout(function() {eval.call(window, lab.grab_body(main)) }, 0)

function main(out) {
  var json = out.content.data['application/json'];
  var json = JSON.parse(json);

  var stations = json.stations;

  var charts = d3.select('#charts');
  var focus_svg = d3.select('#focus');

  // instantiate the objects
  keys = Object.keys(stations);
  var figs = keys.map(function(key) {
      var fig = lab.station_fig(stations[key], charts);
      return fig;
  });

  // axis and grids
  var fig = figs[0];
  fig.default_layout();
  figs.slice(1, figs.length).forEach(function (f) {
      f.axes_y();
      f.grid(fig.xaxis);
  });

  // focus is still kind of kludgey
  var focus = Figure();
  focus
    .margin({'left':40})
    .height(100)
    .index(stations[keys[0]].index);

  focus(focus_svg);
  focus.layer(Line().data(fig.layers[0].data().close), 'focus');
  focus.axes_x({orient:'bottom'});
  focus.grid();

  var brush = focus.brush();

  // attach brush to each fig
  figs.forEach(function(f) { f.x.attach(brush); });

  // legend
  var legend = d3.select('#legend');
  var l = Legend();
  l.layer(fig.layers);
  l(legend);
  $('#legend').draggable({'cursor':'move'});

  // self brushing
  function selfbrush(f) {
    var fbrush = f.brush();
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
      figs.forEach(function(f) { f.x.change(domain); });
      // when self brushing, remove selection after we show it
      fbrush.clear();
      fbrush(fbrush.g);
    });
  }
  figs.forEach(selfbrush);

  updateWindow();
};

function updateWindow() {
    var width = window.innerWidth - 60;
    var height = window.innerHeight * (.80 / figs.length);
    figs.forEach(function(f) { f.width(width).height(height); })
    focus.width(width);
    // hack to get grids to redraw and use updated tickValues
    focus.x.change(focus.x.domain()); 
}

var doit;
window.onresize = function(){
  clearTimeout(doit);
  doit = setTimeout(updateWindow, 100);
};

