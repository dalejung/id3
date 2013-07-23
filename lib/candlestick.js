var d3 = require('d3');

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    

function Candlestick() {
  var data = null, 
      open = null, 
      high = null, 
      low = null, 
      close = null, 
      width = 1000, 
      height = 800,
      start, end,
      x = d3.scale.linear(),
      y = d3.scale.linear();

  function chart(selection) {
    chart.data(selection.data()[0]);
    chart.x = x;
    chart.y = y;

    chart.build.call(this, selection);
  }

  chart.build = function(selection) {

    chart.selection = selection;

    var plot = selection.selectAll('g.candlestick-chart').data([1]).enter()
      .append('svg:g')
      .attr("class", "candlestick-chart")
      .attr("width", width)
      .attr("height", height);

    var plot = selection.selectAll('g.candlestick-chart');

    var domain = x.domain();
    var length = domain[1] - domain[0];
    var index = data.index;
    var bar_width = 0.5 * (width)/length;

    var range = d3.range(domain[0], domain[1]);
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

    candles.select('rect')
      .attr("x", 0)
            .attr("y", function(d) {return y(max(open[d], close[d]));})		  
      .attr("height", function(d) { return y(min(open[d], close[d]))-y(max(open[d], close[d]));})
      .attr("width", bar_width)
            .attr("fill",function(d) { return open[d] > close[d] ? "red" : "green" ;});
  }

  chart.extent = function(_) {
    start = _[0];
    end = _[1];
    return update();
  }

  function update() {
    start = start ? start : 0;
    end = end ? end : data.open.length;
    x.domain([start, end])
      .range([0,width]).nice();

    if (data) {
      y.domain([d3.min(low.slice(start, end)), 
                 d3.max(high.slice(start, end))])
        .range([height, 0]);
    }
    return chart;
  }

  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    open = data.open;
    high = data.high;
    low = data.low;
    close = data.close;
    return update()
  }

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  }
  return chart;
}

module.exports = Candlestick;
