%run ./candlestick.html

var Fiber = require('fibers');

var notebook_id = "fcd75448-6968-59ff-b779-c0a1246b8a34";

var ipy = require('ipy_node');

var bridge = new ipy.Bridge("http://idale.local:8888");
var kernel = bridge.start_kernel(notebook_id);
var df = kernel.pull('df.tail(500)');

candlestick.build_chart(df, "#chart");
