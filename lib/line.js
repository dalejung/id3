var d3 = require('d3');

var id3_id = 0;

function Line() {
  var id = id3_id++, 
      data = line.data =null, 
      x = line.x = d3.scale.linear(),
      y = line.y = d3.scale.linear(),
      line_ = line._line = d3.svg.line().x(x).y(function(d) { return y(data[d])}),
      width = 0, 
      height = 0;

  line.update = function() {
    var domain = x.domain();
    // Reset the internal y-domain
    line.y.domain(d3.extent(data.slice(domain[0], domain[1])));
    return line;
  }

  function data_range() {
    var domain = x.domain();
    range = d3.range(domain[0], domain[1]);
    return range;
  }

  line.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    x.range([0, width]);
    return line;
  }

  line.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    y.range([height, 0]);
    return line;
  }

  line.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    line.x.domain([0, data.length-1]);
    line.y.domain(d3.extent(data));
    return line;
  }

  line.size = function() {
    return data.length;
  }

  function line(selection) {
    selection.selectAll('path.line'+id).data([0]).enter().append('svg:path').attr('class', 'line'+id);
    var path = selection.selectAll('.line'+id).style('stroke','blue').style('fill', 'none');
    path.attr('d', line_(data_range()));
  }

  line.xview = function(domain) {
    if (!arguments.length) return x.domain();
    x.domain(domain);
    return line;
  }

  line.yview = function(domain) {
    if (!arguments.length) return y.domain();
    y.domain(domain);
    return line;
  }

  return line;
}

module.exports = Line
