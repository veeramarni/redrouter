/**
  SSH Tunnel Example using RedRouter
**/

// Import RedRouter Core
var redrouter = require('../../').create;
var fs = require('fs');

// Import RedRouter Components
var backend_etcd = require('redrouter.backend.etcd');
var agent_ssh = require('redrouter.agent.ssh-proxy');
var resolver_ssh = require('redrouter.resolver.ssh');
var middleware_docker = require('redrouter.middleware.docker');

/*
  Define a RedRouter Instance
*/
var proxy = new redrouter({
  ssl:{
    key: fs.readFileSync('local/host.key'),
    cert: fs.readFileSync('local/host.key.pub')
  },
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
  middleware: [
    { constructor: middleware_docker,
      options: {
         docker_url: "tcp://localhost:2375"
      }
    }
  ],
  agents: [
    { constructor: agent_ssh,
      options: {
        host: 'localhost',
        port: 3000
      }
    }
  ]
});
