/**
  Creates an SSH2 Connection Object based on an SSH2 Authentication Context
**/

// Imports

/**
  Creates a Resolver
**/
var _super = require('../../resolver.js').prototype;
var method = SSH_Username.prototype = Object.create( _super );
    method.constructor = SSH_Username;


function SSH_Username(redrouter, opts){
   _super.constructor.apply(this, arguments);

  // Save Redrouter instance
  this.backend = redrouter.backend;

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

  // Check Request Type
  if (req.resolver == "ssh_username"){

    // Fetch Username
    var username = req.data.username;

    // Get ETCD Record for SSH_USERNAME::
    this.backend.retrieveRecord("SSH_USERNAME::"+username, function(err, res){
      if(err){
        this.log.warn(err);
        callback(null);
      }
      else{
        callback(res);
      }
    });

  }
  else{
    callback(null);
  }

}
/**
  Destroy Method
**/
method.destroy = function(){

}

module.exports = SSH_Username;
