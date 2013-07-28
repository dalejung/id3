var Figure = require('./figure.js');
var Line = require('./line.js');
var Candlestick = require('./candlestick.js');
var Marker = require('./marker.js');
var Layer = require('./layer.js');

module.exports = {
  Layer: function() { return new Layer() }, 
  Figure: Figure, 
  Line: Line, 
  Marker: Marker, 
  Candlestick: Candlestick
}
