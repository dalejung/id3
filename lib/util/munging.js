var d3 = require('d3');

function true_index(arr, config) {
  // Series.ix[start, end].true().index;
  if (!config) { config = {}; } 
  if (!config.length) { config.length = arr.length } 
  config.start = config.start ? config.start : 0;
  config.end = config.end ? config.end : config.length;
  console.log(config);
  var valid = new Array(config.length);
  var j = 0;
  for (var i=config.start; i <= config.end; i++) {
    if (arr[i]) {
      valid[j] = i;
      j++;
    }
  }
  valid = valid.slice(0, j);
  return valid;
}

function where(arr, mask) {
  var data = arr.slice(0);
  for (var i=0; i < data.length; i++) {
    if (!mask[i]) {
      data[i] = null;
    }
  }
  return data;
}

module.exports.true_index = true_index;
module.exports.where = where;

mask = [true, true, false, false, true, false]
series = d3.range(mask.length);

res = true_index(mask, {});
res = true_index(mask, {'start':1});
res = where(series, mask);
