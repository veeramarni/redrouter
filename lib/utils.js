/**
  Util functions for TuxLab
**/
var utils = [];

/**
  constructorApply
  Applies a dynamic constructor to create an object
**/
utils.constructorApply = function(ctor, args){
  return new (ctor.bind.apply(ctor, [null].concat(args)))();
}

module.exports = utils
