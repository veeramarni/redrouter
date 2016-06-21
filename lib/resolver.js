/**
  Describes a piece of middleware used to resolve the destination
**/

// Imports

/**
  Creates a Resolver
**/
var method = Resolver.prototype;
function Resolver(redrouter, opts){

  return this;
}

/**
  Resolve Method

  req -> request information
  opts -> global resolver Options
  callback -> call with null if not resolved
              call with route if resolved
**/
method.resolve = function(req, opts, callback){

}

/**
  Destroy Method
**/
method.destroy = function(){

}
