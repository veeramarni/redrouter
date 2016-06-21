/**
  An Interface to the Internal Shtty Record Cache
**/

// Imports

var NodeCache = require('node-cache');

/**
  Constructor for Internal Cache
**/
var method = Backend.prototype;
function Backend(redrouter, opts){
  var set_TTL = opts.TTL || 3600;
  var set_checkperiod = opts.checkperiod || 600;

  this.ncache = new NodeCache({ stdTTL : set_TTL, checkperiod : set_checkperiod});

  return this;
}

/**
  Formats and Validates a Record
**/
method.formatRecord = function(target, dest, opts){
  var json = {
    dest : dest,
    proto : opts.proto || "ssh",
    port : opts.port || 22
  };

  //TODO Add Data Validation

  return { key : target, val : json };
}

/**
  Adds a Proxy Record
  Target -> String describing SSH Address
  Dest -> Array of Destination Addresses.  Multiple addressess are load balanced.
  Opts -> Array of Options
  CB -> Callback; should handle errors;
**/
method.addRecord = function(target,dest,opts,cb){
  var record = this.formatRecord(target,dest,opts);

  //TODO Record Validation

  this.ncache.set(record.key, record.value, function(err, res){
    cb(err,res);
  });
}

/**
  Removes a Proxy Record
  Target -> String describing SSH Address
  CB -> Callback; should handle errors;
**/
method.removeRecord = function(target, cb){
  this.ncache.del(target, function(err,count){
    cb(err,count);
  });
}

/**
  Retrieves a Proxy Record
  Target -> Target to Retrieve
  CB -> Callback;  Returns err if infrastructure-layer error and record,
                   which is null if not found.
**/
method.retrieveRecord = function(target, cb){
  this.ncache.get(target,function(err,record){
    cb(err,record);
  })
}

/**
  Outputs all Proxy Records Synchronously
  CB -> Callback; called on completion
**/
method.getAll = function(){
  return this.ncache.keys();
}

/**
  Destroys the the SHTTY Instance
**/
method.destroy = function(){
  this.ncache.flushAll();
  this.ncache.close();
}

module.exports = Backend;
