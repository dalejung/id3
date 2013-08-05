/*
 * Start of something that will take a .js, take all the top level 
 * requires and export them via --require. That way the main file
 * can be run without modifiction. Just require the common.js
 */
var browserify = require('browserify');
var b = browserify();
var fs = require('fs');
var Q = require('q');
var _ = require('underscore');
b.add('./full_demo.js');

var deps = b.deps({});

var concat = require('concat-stream');

var json;
var deferred = Q.defer();
var cs = concat(function (body) {
  global.json = body; 
  var entry = _.where(body, {'entry':true})[0];
  deferred.resolve(entry);
});

var promise = deferred.promise;
promise.then(function(entry) {
  var b = browserify();
  _.each(entry.deps, function(e, i) {
    console.log(i);
    b.require(i);
  });
  return b;
}).then(function(b) {
  var f = fs.createWriteStream('./common.js');
  b.bundle().pipe(f); 
});

deps.pipe(cs);

module.exports = json
