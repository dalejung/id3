var d3 = require('d3');
var moment = require('moment');
var to_offset = require('./dateoffset.js').to_offset;
var date_range = require('./dateindex.js').date_range;

function time_bins(index, freq) {
  /*
   * 
   */
  var offset = to_offset(freq);
  var start = moment.utc(index[0]);
  var end = moment.utc(index[index.length-1]);
  var edge_start = offset.rollback(start);
  var edge_end = offset.rollforward(end);
  var binner = date_range(edge_start, edge_end, freq);
  var binvals = binner.values;

  var bins = [];
  var bin_index = 0;
  var current_edge = binvals[bin_index];
  for (var i=0; i < index.length; i++) {
    if (index[i] >= current_edge) {
      bins.push(i);
      bin_index++;
      current_edge = binvals[bin_index];
    }
  }
  return bins;
}

module.exports.time_bins = time_bins;
