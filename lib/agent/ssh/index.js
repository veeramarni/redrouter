/**
  SSH Server-Agent for RedRouter
**/

// Imports
var ssh2 = require('ssh2');
var fs = require('fs');

// Create Super Object
var _super = require('../../agent.js').prototype;
var method = SSHAgent.prototype = Object.create( _super );
    method.constructor = SSHAgent;

/**
  Creates SSH Server Agent Constructor
**/
function SSHAgent(redrouter, options){

  var _this = this;
  this.log = redrouter.log;

  // Handle Incoming Connections
  this.connections = [];
  this.ssh_server = new ssh2.Server({
    hostKeys: [fs.readFileSync('../local/host.key')]
  }, function(client) {

     var route = {};
     var server;

     client.on('authentication', function(ctx) {

       // Request Data
       var req = {
         resolver : "ssh_username",
         data : ctx
       }

       // Resolve Route
       redrouter.resolve(req, function(record){

         if(!record){
           ctx.reject();
         }
         else{
           route = record;
           ctx.accept();
         }

       });

     }).on('error', function(err){
       redrouter.log.warn(err);

     }).on('ready',function(){

       // User Requests a new Session
       client.on('session', function(accept, reject){
         var session = accept();

         // User Requests a PTY
         session.on('pty', function(accept, reject, info){
           var channel = accept();
         });

         // User Alerts to Window Change
         session.on('window-change', function(accept, reject, info){
           var channel = accept();
         });

         // User Requests Shell
         session.on('shell', function(accept, reject){

           server = new ssh2.Client();
           server.on('ready', function(){
             var channel = accept();
             server.shell(function(err,stream){

               if(err){
                 redrouter.log.warn(err);
               }
               else{
                 stream.pipe(channel).pipe(stream);
               }

             });

           }).on('error', function(err){
             redrouter.log.warn(err);
           }).connect(route);


         });

       }).on('error',function(err){
         console.log(err);
       });

    }).on('end', function() {
      if(typeof server !== "undefined" ){
        server.end();
      }
    });

  }).listen(options.port, options.host, function() {
      console.log('Listening for SSH Requests on port ' + this.address().port);
  });

  /* Server Destroy Behavior */
  this.ssh_server.on('close', function(){
    connections.forEach(function(connection){
      connection.end();
    });
  });

}

/**
  Destroys the SSHServer
**/
method.destroy = function(){
  this.ssh_server.close();
  _super.destroy.apply(this);
}



module.exports = SSHAgent;
