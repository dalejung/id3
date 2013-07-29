var d3 = require('d3');
var _ = require('underscore');

var id3_id = 0;

function AxisContext() {
  var scale = axis.scale = d3.scale.linear(), 
      id = id3_id++,
      dispatch = d3.dispatch('change');

  function axis(i) { return scale.call(scale, i)}

  axis.attach = function(brush, type) {
    var self = this;
    if (!type) {
      type = 'brush';
    }
    brush.on(type+'.axis'+id, function() {
      var domain = brush.empty() ? self.scale.domain() : brush.extent();
      // brush won't give us integers
      domain = _.map(domain, Math.round);
      self.change(domain);
    });
  }

  axis.change = function(domain) {
    scale.domain(domain);
    dispatch.change(domain);
  }

  axis.on = function(type, listener) {
    return dispatch.on(type, listener);
  }
  axis.domain = scale.domain;
  axis.range = scale.range;

  return axis;
}

module.exports = AxisContext;
