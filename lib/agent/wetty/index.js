/**
  Accepts incoming Socket.IO Requests and pipes them into an SSH Client
**/

// Imports
var ssh2 = require('ssh2');

// Create Super Object
var _super = require('redrouter').agent.prototype;
var method = WettyAgent.prototype = Object.create( _super );
    method.constructor = WettyAgent;

/**
  Wetty Server Agent Constructor
**/
function WettyAgent(redrouter, opts){
    var _this = this;
        _this.log = redrouter.log;

    var opts = {
      port: opts.port || 3000,
      ssl : opts.ssl,
      socket_path : opts.socket_path || '/wetty/socket.io/', // Must both start and end with /
      https_enabled: opts.https_enabled || false
    }

    // Construct Server
    var httpserv;
    if (opts.https_enabled){
      httpserv = require('https').createServer(opts.ssl).listen(opts.port, function(){
          redrouter.log.info('listening for wetty on https port '+ opts.port)
      });
    }
    else{
      httpserv = require('http').createServer().listen(opts.port, function(){
          redrouter.log.info('listening for wetty on http port ' + opts.port)
      });
    }

    // Start SocketIO
    var io = require('socket.io')(httpserv, { path : opts.socket_path });
        io.on('connection', function(socket){
            // Server Object
            var server;

            // Request Data
            var req = {
              resolver : "ssh-ws",
              data : socket.request
            }

            // Resolve Request
            redrouter.resolve(req, function(record){
              if(!record){
                socket.emit('exception', {errorMessage: '404 : Proxy Record Not Found'});
              }
              else{

                // Merge Records
                route = {
                  host: socket.request._query['host'] || (record.host || defaults.host),
                  username: record.username || (socket.request._query['username'] || defaults.username),
                  port : socket.request._query['port'] || (record.port || 22),
                  password: socket.request._query['password'] || (record.password || defaults.password),
                  privateKey: record.privateKey 
                }

                // log
                redrouter.log.info(route.username + " connected.");

                // Errors
                if (typeof route.host === "undefined"){
                  redrouter.log.warn("Host cannot be undefined.");
                }

                // Start Client
                    server = new ssh2.Client();
                    server.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish){

                       // Output overall instructions
                       socket.emit('output', instructions);

                       // Responses
                       var exp_prompt_length = prompts.length;
                       var responses = [];

                       // Continuation through Prompts
                       var interactivePrompt = function(){

                           // Handle Prompts Response
                           socket.once('input', function(data){
                              responses.push(data);

                              if(prompts.length > 0){
                                interactivePrompt();
                              }
                           });

                           // Send Prompts
                           socket.emit('prompt', prompts.shift());
                       }

                       // Return Responses
                       if (responses.length == exp_prompt_length){
                         finish(responses);
                       }
                       else{
                         redrouter.log.warn("incorrect number of responses");
                         destroyConnection();
                       }
                    }).on('ready', function(){

                       server.shell(function(err, stream){
                          // Handle Errors
                          if (err){
                            redrouter.log.warn(err);
                            destroyConnection();
                          }

                          else{
                            // Output Data
                            stream.on('close', function(){
                              destroyConnection();
                            }).on('data', function(data){
                              socket.emit('output', data);
                            });

                            // Input Data
                            socket.on('input', function(data){
                              stream.write(data);
                            });

                            // Resize Event
                            socket.on('resize', function(data){
                                stream.setWindow(data.rows, data.cols, data.height, data.width);
                            });

                          }
                       })


                    }).on('end', function(){
                      destroyConnection();
                    }).connect(route);

                // Handle Disconnect
                socket.on('disconnect', destroyConnection);

                // Destroy Function
                var destroyConnection = function(){
                  if (typeof server !== "undefined"){
                    server.close();
                  }
                  socket.close();
                  redrouter.log.info(route.username + " disconnected.");
                }

              }
            });
        });

}

// Export
module.exports = WettyAgent;
