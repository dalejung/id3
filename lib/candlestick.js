var d3 = require('d3');
var callable = require('./callable.js');
var Layer = require('./layer.js');

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    

Candlestick.prototype = Object.create(Layer.prototype);
function Candlestick() {
  this.open = null; 
  this.high = null; 
  this.low = null; 
  this.close = null; 
  this.index = null;
  this._id3_type = 'candlestick';

  Layer.call(this);

  this.__call__ = function(selection) {
    var width = this.width();
    var height = this.height();
    var open = this.open;
    var high = this.high;
    var low = this.low;
    var close = this.close;
    var index = this.index;
    var x = this.x;
    var y = this.y;

    var domain = this.x.domain();
    var length = domain[1] - domain[0];
    var bar_width = 0.4 * (width)/length;
    var range = d3.range(domain[0], domain[1]);

    var plot = selection.selectAll('g.candlestick-chart').data([1]).enter()
      .append('svg:g')
      .attr("class", "candlestick-chart")
      .attr("width", width)
      .attr("height", height);

    var plot = selection.selectAll('g.candlestick-chart');
    candles = plot.selectAll("g.candlestick")
      .data(range).exit().remove()

    new_candles = plot.selectAll("g.candlestick")
      .data(range).enter().append("svg:g")
      .attr("class", "candlestick")

    new_candles.append("svg:line")
      .attr("class", "stem");
    new_candles.append("svg:rect");

    candles = plot.selectAll("g.candlestick").data(range);
    candles.attr("transform", function(d) {return "translate("+(x(d)-bar_width/2)+',0)'})

    candles.select('.stem')
      .attr("x1", bar_width / 2)
      .attr("x2", bar_width / 2)		    
      .attr("y1", function(d) { return y(high[d]) || 0;})
      .attr("y2", function(d) { return y(low[d]) || 0; })
      .attr("stroke", 'black')
      .attr("stroke-width", max(bar_width / 14, 1))

    candles.select('rect')
      .attr("x", 0)
            .attr("y", function(d) {return y(max(open[d], close[d])) || 0;})		  
      .attr("height", function(d) { return y(min(open[d], close[d]))-y(max(open[d], close[d])) || 0;})
      .attr("width", bar_width)
            .attr("fill",function(d) { return open[d] > close[d] ? "red" : "green" ;});
  }

  this.update = function() {
    var domain = this.x.domain();
    var s = domain[0];
    var e = domain[1];
    this.y.domain([d3.min(this.low.slice(s, e)), 
               d3.max(this.high.slice(s, e))])
      .range([this.height(), 0]);
    return this;
  }

  this.data = function(data) {
    if (!arguments.length) return this._data;
    this._data = data;
    this.open = data.open;
    this.high = data.high;
    this.low = data.low;
    this.close = data.close;
    this.index = data.index;

    this.x.domain([0, this.index.length-1])
      .range([0,this.width()]).nice();
    return this.update()
  }

  this.data_length = function() {
    return this.index.length;
  }
}

module.exports = callable(Candlestick);
