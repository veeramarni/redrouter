/**
  SSH Proxy over WebSockets
**/

// Import RedRouter Core
var redrouter = require('../../').create;

// Import RedRouter Components
var backend_etcd = require('redrouter.backend.etcd');
var agent_wetty = require('redrouter.agent.wetty');
var resolver_ssh = require('redrouter.resolver.ssh');

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

      }
    }
  ],
  agents: [
    { constructor: agent_wetty,
      options: {

      }
    }
  ]
});
