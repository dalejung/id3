var moment = require('moment');
var to_offset = require('./dateoffset.js').to_offset;

OFFSET_STEPS = {}
OFFSET_STEPS['D'] = 86400000;

function offset_range(start, end, freq) {
  range = d3.range(start, end, OFFSET_STEPS[freq]);
  return range
}

function anchored_range(start, end, freq) {
  var offset = to_offset(freq);
  new_start = offset.rollforward(start);
  new_end = offset.rollback(end);
  dates = [];
  current = new_start;
  while(!current.isAfter(new_end)) {
    dates.push(+current);
    current = offset.add(current);
  }
  return new DatetimeIndex(dates);
}

function date_range(start, end, freq) {
  if (freq in OFFSET_STEPS) {
    return offset_range(start, end, freq);
  }
  return anchored_range(start, end, freq);
}

function DatetimeIndex(values, tz) {
  var test = moment(values[0]);
  if (!test.isValid()) {
    console.log(test);
    values = this.convert_ns(values);
  }
  this.values = values;
  this.tz = tz;
}

DatetimeIndex.prototype.convert_ns = function(values) {
  i = values.length;
  while(i--) {
    values[i] = values[i] / 1000000;
  }
  return values;
}

DatetimeIndex.prototype.get = function(i) {
  // assume utc for now
  i = i < 0 ? this.values.length + i : i; 
  return moment.utc(this.values[i]);
}

DatetimeIndex.prototype.__repr__ = function() {
  str = "DatetimeIndex\n";
  str += '['+this.get(0).format()+', ..., '+this.get(-1).format()+']\n';
  str += 'Length: '+this.values.length;
  return str;
}

DatetimeIndex.prototype.take = function(idx) {
  var values = Array(idx.length);
  var i = idx.length;
  while(i--) {
    values[i] = this.values[idx[i]];
  }
  return new DatetimeIndex(values);
}

module.exports.date_range = date_range;
module.exports.DatetimeIndex = function(vals, tz) { 
  if (vals instanceof DatetimeIndex) {
    return vals;
  } 
  return new DatetimeIndex(vals, tz) 
};
