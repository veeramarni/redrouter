## SHTTY


RedRouter is a universal reverse-proxy developed in Node.JS.  It is designed to be modular as possible, allowing you to use whatever Backend, Resolver and Proxy Agent you wish.  What are these things, you ask?

> RedRouter began by merging code from the [RedBird](https://github.com/OptimalBits/redbird) and [RedWire](https://github.com/metocean/redwire) projects.  Thanks to them for their incredible contribuitions!

#### Backend
Backends are used to store the Proxy Records themselves.  By default, RedRouter stores proxy records in a memory cache, but you can opt to use the following:
- [X] etcd
- [ ] memcached
- [ ] mongodb
- [ ] redis
- [ ] consul

#### Resolvers
Resolvers are used to determine the configuration of the proxy connection that is to be created.  This could be as simple as appending an IP Address, or more advanced; like round-robin routing, location-based routing, etc. Writing or extending an existing resolver is the easiest way to implement application-specific functionality. Some basic resolvers that have been implemented:
- [X] static resolver
- [ ] round robin
- [ ] dynamic load balancing
- [ ] location-based

#### Proxy Agents
Proxy agents listen on a given port, and use  Typically, proxy agents will be protocol-specific. Some that have been implemented:
- [ ] HTTP
- [ ] HTTPS
- [X] SSH
- [X] WebSSH (Basic wrapper used by Wetty)
- [ ] SOCKS

## Getting Started

## API

## Contributing
Because of its modularity, contributing to the RedRouter project is easy.  Simply make a feature request in the issues, so that we can discuss any details, and you can ask any questions that arise.
