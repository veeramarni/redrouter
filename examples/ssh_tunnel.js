/**
  SSH Tunnel Example using RedRouter
**/

// Import RedRouter Core
var redrouter = require('../');

// Import RedRouter Components
var backend_etcd = require('../lib/backend/etcd');
var client_ssh = require('../lib/client');
var server_ssh = require('../lib/server/ssh');
var resolver_static = require('../lib/resolver');

/*
  Define a RedRouter Instance
*/
var proxy = new redrouter({
  backend : [
    { constructor: backend_etcd, options: {}}
  ],
  resolvers: [
    { constructor: resolver_static, options: {}}
  ],
  server_agents: [
    { constructor: server_ssh, options: { host: 'localhost', port: '3000'}}
  ],
  client_agents: [
    { constructor: client_ssh, options: {}}
  ]
});
