/*eslint-env node */
'use strict';

// Imports
var waterfall = require("async");

/**
    Creates a RedRouter Server Instance
**/
var method = RedRouter.prototype;
function RedRouter (opts){
    var _this = this;

  // Start Logging
    var bunyan = require('bunyan');
     _this.log = bunyan.createLogger({
                     name: "RedRouter",
                     streams: [
                       {
                         level: 'info',
                         stream: process.stdout
                       },
                       {
                         level: 'error',
                         path: 'var/tmp/redrouter.log'
                       }
                     ],
                     src: true
                 });

  // Load Backends
    if (opts.backend !== undefined)
      _this.backend = require('./lib/'+opts.backend+'.js')(_this, opts.backend_opts);
    else
      _this.backend = require('./backend.js')(_this, opts.backend_opts);

  // Load Resolvers
    opts.resolvers.forEach(function(rsl){
      _this.resolvers.push(rsl(_this, opts.resolvers));
    });

  /**
    Resolve Function

    Does an in-order traversal of the resolvers, and evaluates
    to the first route passed back from each resolver
  **/
    this.resolve = function(req, callback){
      async.forEachOf(_this.resolvers,function(res, priority, cb){
        opts.resolver_opts.priority = priority;
        res.resolve(req, opts.resolver_opts, cb);
      },
      function(route){
        callback(route);
      }
    }

  /**
    Destroy Function

    Runs the provided destroy method on all subcomponents
  **/
    this.destroy = function(){

      // Destroy Proxy Agents

      // Destroy Backend
      _this.backend.destroy();

      // Destroy Resolvers
      _this.resolvers.forEach(function(rsl){
          rsl.destroy();
      });
    }

}


module.exports = RedRouter;
