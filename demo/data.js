var fs = require('dfs');
var _ = require('underscore');

// data
var content = fs.readFileSync('df.json');
var df = JSON.parse(content);

var length = df.index.length;
var overnight = new Array(length); 
var open = df.open;
var close = df.close;
var high = df.high;
for (var i=0; i < length; i++) {
  overnight[i] = open[i] / close[i-1] - 1;
}
df.overnight = overnight;

var gap_up = new Array(length);
for (var i=0; i < length; i++) {
  gap_up[i] = open[i] > high[i-1];
}
df.gap_up = gap_up;

_.each(df, function(arr, key) {
  if (!_.isArray(arr)) {
    return;
  }
  df[key] = _.last(arr, 1500);
});


yvalues = open;

var xdata = new Array(length);
var ydata = new Array(length);
var j=0;
for (var i=0; i < length; i++) {
  if(gap_up[i]) {
    xdata[j] = i;
    ydata[j] = yvalues[i];
    j++;
  }
}

ydata = ydata.slice(0, j);
xdata = xdata.slice(0, j);

df.gaps = {'x':xdata, 'y':ydata}

module.exports = df;
