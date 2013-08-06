var Figure = require('./figure.js');
var Line = require('./line.js');
var Candlestick = require('./candlestick.js');
var Marker = require('./marker.js');
var Layer = require('./layer.js');
var Legend = require('./legend.js');
var lab = require('./lab.js');

module.exports = {
  Layer: function() { return new Layer() }, 
  Figure: Figure, 
  Line: Line, 
  Marker: Marker, 
  Legend: Legend, 
  Candlestick: Candlestick, 
  lab: lab
}
