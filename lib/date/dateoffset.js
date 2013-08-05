var moment = require('moment');

function wrap(dt) {
  if (!moment.isMoment(dt)) {
    dt = moment(dt);
  }
  return dt
}

function DateOffset(n) {
  n = n ? n : 1;
  this.n = n;
}

DateOffset.prototype.add = function(dt) {
  dt = moment(dt);
  dt.add(this.moment_code, this.n);
  if (this.moment_period) {
    dt.startOf(this.moment_period);
  }
  return dt;
}

DateOffset.prototype.sub = function(dt) {
  var old = moment(dt);
  dt = moment(dt);
  if (this.moment_period) {
    dt.startOf(this.moment_period);
  }
  if (old.isSame(dt)) {
    // means we were already on offset, so just subtract
    dt.subtract(this.moment_code, this.n);
  }
  return dt;
}

DateOffset.prototype.onOffset = function(dt) {
  dt = moment(dt);
  test = moment(dt);
  test = this.add(test);
  test = this.sub(test);
  return dt.isSame(test);
}

DateOffset.prototype.rollback = function(dt) {
  if (!this.onOffset(dt)) {
    dt = this.sub(dt);
  }
  return dt;
}

DateOffset.prototype.rollforward = function(dt) {
  if (!this.onOffset(dt)) {
    dt = this.add(dt);
  }
  return dt;
}

MonthStart.prototype = Object.create(DateOffset.prototype);
function MonthStart() {
  this.moment_period = 'month';
  this.moment_code = 'M';
  DateOffset.apply(this, arguments);

  this.onOffset = function(dt) {
    dt = wrap(dt);
    return dt.date() == 1;
  }
}

Week.prototype = Object.create(DateOffset.prototype);
function Week() {
  // weeks are monday based
  this.moment_period = 'week';
  this.moment_code = 'w';
  DateOffset.apply(this, arguments);

  this.onOffset = function(dt) {
    dt = wrap(dt);
    return dt.day() == 1;
  }
}

YearStart.prototype = Object.create(DateOffset.prototype);
function YearStart() {
  this.moment_period = 'year';
  this.moment_code = 'y';
  DateOffset.apply(this, arguments);

  this.onOffset = function(dt) {
    dt = wrap(dt);
    return dt.dayOfYear() == 1;
  }
}


OFFSET_MAP = {};
OFFSET_MAP['AS'] = YearStart
OFFSET_MAP['A'] = YearStart
OFFSET_MAP['W'] = Week
OFFSET_MAP['MS'] = MonthStart
OFFSET_MAP['M'] = MonthStart

// hate RE
var op_pattern = /([\-]?\d*)+([a-zA-Z]*)+/
function to_offset(freqstr) {
  /*
   * Converts a freq string into the appropiate
   * DateOffset object. 
   *
   * Example:
   * to_offset('3W') -> new Week(3)
   * to_offset('W') -> new Week(1)
   * to_offset('MS') -> new MonthStart(1)
   */
  var bits = freqstr.split(op_pattern);
  if (bits.length == 1) {
    n = 1;
    freq = bits[0];
  } else {
    n = bits[1];
    freq = bits[2];
  }

  offset_cls = OFFSET_MAP[freq];
  return new offset_cls(n);
}

module.exports.to_offset = to_offset;
