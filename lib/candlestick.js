var d3 = require('d3')

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }    

var width = 1200;
var height = 800;
var margin = 50;


function build_chart(data, chart_sel) {
  var container = d3.select(chart_sel);

  container.selectAll('svg').remove()

  var chart = container
    .append("svg:svg")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

  var index = data.index;
  var length = index.length;
  var bar_width = 0.5 * (width - 2*margin)/length;

  var x = d3.scale.linear()
    .domain([0, length-1])
    .range([margin,width-margin]);

  var y = d3.scale.linear()
    .domain([d3.min(data.low) * .95, 
             d3.max(data.high) * 1.01])
    .range([height-margin, margin]);

  console.log(y.range());

  var now = new Date();
  var utc_offset = now.getTimezoneOffset() * 60000;
  var date = new Date(index[0] / 1000000 + utc_offset);

  var format = d3.time.format("%Y-%m-%d");

  chart.selectAll("text.xrule")
   .data(x.ticks(10))
   .enter().append("svg:text")
   .attr("class", "xrule")
   .attr("x", x)
   .attr("y", height - margin)
   .attr("dy", 20)
   .attr("text-anchor", "middle")
  .text(function(d){
    var date = new Date(index[d] / 1000000 + utc_offset);
    return format(date);
  });

 chart.selectAll("text.yrule")
  .data(y.ticks(10))
  .enter().append("svg:text")
  .attr("class", "yrule")
  .attr("x", width - margin)
  .attr("y", y)
  .attr("dy", 0)
  .attr("dx", 20)		 
  .attr("text-anchor", "middle")
  .text(String);

  chart.selectAll("line.x")
   .data(x.ticks(10))
   .enter().append("svg:line")
   .attr("class", "x")
   .attr("x1", x)
   .attr("x2", x)
   .attr("y1", margin)
   .attr("y2", height - margin)
   .attr("stroke", "#ccc")
   .attr("width", 1)

  var line_y = chart.selectAll("line.y")
   .data(y.ticks(10))

   line_y.enter().append("svg:line")
   .attr("class", "y")
   .attr("x1", margin)
   .attr("x2", width - margin)
   .attr("y1", y)
   .attr("y2", y)
   .attr("stroke", "#ccc");

  candles = chart.selectAll("g.candlestick");

  var range = d3.range(length);
  candles = chart.selectAll("g.candlestick")
    .data(range).enter().append("svg:g")
    .attr("class", "candlestick")
    .attr("transform", function(d) {return "translate("+(x(d)-bar_width/2)+','+min(data.open[d], data.close[d])+')'})

  candles.append("svg:line")
    .attr("class", "stem")
    .attr("x1", bar_width / 2)
    .attr("x2", bar_width / 2)		    
    .attr("y1", function(d) { return y(data.high[d]);})
    .attr("y2", function(d) { return y(data.low[d]); })
    .attr("stroke", 'black')

  candles.append("svg:rect")
    .attr("x", 0)
          .attr("y", function(d) {return y(max(data.open[d], data.close[d]));})		  
    .attr("height", function(d) { return y(min(data.open[d], data.close[d]))-y(max(data.open[d], data.close[d]));})
    .attr("width", bar_width)
          .attr("fill",function(d) { return data.open[d] > data.close[d] ? "red" : "green" ;});
}

module.exports.build_chart = build_chart;
