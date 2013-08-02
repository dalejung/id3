var d3 = require('d3');
var callable = require('./callable.js');
var clone = require('./util').clone
var Layer = require('./layer.js');

View.prototype = Object.create(Layer.prototype);

function View() {
  this._layer = null;
  this.x = null;
  this.y = null;
  this._width = 0; 
  this._height = 0;
  this.view_wrapped = false;

  this.__call__ = function(selection) {
    return this.layer().__call__.call(this, selection);
  }
}

View.prototype.layer = function(layer) {
  /*
   * View proto chain starts at View.prototype -> Object
   * We attach attach layer to the chain to default to 
   * those methods. This is because something like update() 
   * might call methods we don't know about in View. 
   *
   * The end chain is: 
   * View -> View.prototype -> Layer -> Layer.protoype -> Object
   * Layer could have a deeper chain. 
   *
   * We copy the View.prototype so we're not mucking the base View.prototype.
   */
  if (!arguments.length) return this._layer;
  if (this.view_wrapped) {
    throw new Error("This view has already wrapped a lyaer");
  }
  this._layer = layer;
  // need to create a new copy of proto
  var middle = clone(View.prototype);
  middle.__proto__ = layer;
  this.__proto__ = middle;
  this.x = layer.x.copy();
  this.y = layer.y.copy();
  this.view_wrapped = true;
  return this;
}

View.prototype.update = function() {
  return this.layer().update.call(this);
}

module.exports = callable(View);
