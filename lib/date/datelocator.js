var d3 = require('d3');
var moment = require('moment');
var to_offset = require('./dateoffset.js').to_offset;
var date_range = require('./dateindex.js').date_range;

function time_bins(index, freq, config) {
  /*
   * 
   */
  if (!config) { config = {} }
  var start = 'undefined' === typeof(config.start) ? 0 : config.start;
  var end = 'undefined' === typeof(config.end) ? -1 : config.end;

  var offset = to_offset(freq);
  var start_date = index.get(start);
  var end_date = index.get(end);
  var edge_start = offset.rollback(start_date);
  var edge_end = offset.rollforward(end_date);

  var binner = date_range(edge_start, edge_end, freq);
  var binvals = binner.values;
  var ivals = index.values;

  var bins = [];
  var bin_index = 0;
  var current_edge = binvals[bin_index];
  for (var i=start; i <= end; i++) {
    if (ivals[i] >= current_edge) {
      bins.push(i);
      bin_index++;
      current_edge = binvals[bin_index];
    }
  }
  return bins;
}

function auto_bins(index, bins, config) {
  return time_bins(index, 'AS', config); 
}

module.exports.time_bins = time_bins;
module.exports.auto_bins = auto_bins;
