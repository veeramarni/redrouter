/**
  SSH Tunnel Example using RedRouter
**/

// Import RedRouter Core
var redrouter = require('../');

// Import RedRouter Components
var backend_etcd = require('../lib/backend/etcd');
var agent_ssh = require('../lib/agent/ssh_proxy');
var resolver_ssh = require('../lib/resolver/ssh');

/*
  Define a RedRouter Instance
*/
var proxy = new redrouter({
  backend : {
    constructor: backend_etcd,
    options: {
      host: "localhost:2379",
      etcd_conn_opts: {}
    }
  },
  resolvers: [
    { constructor: resolver_ssh,
      options: {
        defaults: {
          allowed_auth: ['password']
        }
      }
    }
  ],
  agents: [
    { constructor: agent_ssh, options: { host: 'localhost', port: 3000}}
  ]
});
