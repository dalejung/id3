var d3 = require('d3');
var callable = require('./callable.js');

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    

function Candlestick() {
  this._data = null; 
  this.open = null; 
  this.high = null; 
  this.low = null; 
  this.close = null; 
  this.index = null;
  this._width = 1000; 
  this._height = 800;
  this.x = d3.scale.linear();
  this.y = d3.scale.linear();

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
    var bar_width = 0.5 * (width)/length;
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
      .attr("y1", function(d) { return y(high[d]);})
      .attr("y2", function(d) { return y(low[d]); })
      .attr("stroke", 'black')
      .attr("stroke-width", max(bar_width / 14, 1))

    candles.select('rect')
      .attr("x", 0)
            .attr("y", function(d) {return y(max(open[d], close[d]));})		  
      .attr("height", function(d) { return y(min(open[d], close[d]))-y(max(open[d], close[d]));})
      .attr("width", bar_width)
            .attr("fill",function(d) { return open[d] > close[d] ? "red" : "green" ;});
  }

  this.xview = function(domain) {
    if (!arguments.length) return this.x.domain();
    this.x.domain(domain);
    return this;
  }

  this.yview = function(domain) {
    if (!arguments.length) return this.y.domain();
    this.y.domain(domain);
    return this;
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

  this.height = function(height) {
    if (!arguments.length) return this._height;
    this._height = height;
    y.range([height, 0]);
    return this;
  }

  this.width = function(width) {
    if (!arguments.length) return this._width;
    this._width = width;
    x.range([0, width]);
    return this;
  }

  this.size = function() {
    return this.index.length;
  }
}

module.exports = callable(Candlestick);
