/**
  Describes a resolver used to resolve the destination
**/

// Imports

/**
  Creates a Resolver
**/
var method = Resolver.prototype;
function Resolver(redrouter, opts){
  this.log = redrouter.log;

  return this;
}

/**
  Resolve Method

  req -> request information.  Should be of the format:

  // Request only handled by ssh_username resolver
  example a: {
    resolver: "ssh",
    data: "CTX OBJECT"
  }

  // Request handled by all global resolvers:
  example b: {
    resolver: "*",
    data: "REQUEST OF ANY TYPE"
  }

  opts -> global resolver Options
  callback -> call with null if not resolved
              call with route if resolved
**/
method.resolve = function(req, opts, callback){
  callback(req);
}

/**
  Destroy Method
**/
method.destroy = function(){

}

module.exports = Resolver;
