var d3 = require('d3');

var NS = 'http://www.w3.org/2000/svg';

function createElement(tag) {
  var elem = d3.select(document.createElementNS(NS, tag));
  return elem;
}

module.exports.createElement = createElement;
