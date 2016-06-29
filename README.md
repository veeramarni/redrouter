## RedRouter

[![Build Status](https://travis-ci.org/DerekTBrown/redrouter.svg?branch=master)](https://travis-ci.org/DerekTBrown/redrouter)
[![npm version](https://badge.fury.io/js/redrouter.svg)](https://badge.fury.io/js/redrouter)

RedRouter is a universal reverse-proxy developed in Node.JS.  It is designed to be modular as possible, allowing you to use whatever Backend, Resolver and Proxy Agent you wish.   What are these things, you ask?

#### Backend
Backends are used to store the proxy records themselves.  By default, RedRouter stores proxy records in a memory cache, but you can additionally choose to search the following:
- [X] etcd
- [ ] memcached
- [ ] mongodb
- [ ] mysql
- [ ] redis
- [ ] consul

once a record has been found, it is added to the local memory cache, to reduce the time for subsequent requests.

#### Resolvers
Resolvers are used to determine the configuration of the proxy connection that is to be created.  This could be as simple as appending an IP Address, or more advanced; like round-robin routing, location-based routing, etc. Writing or extending an existing resolver is the easiest way to implement application-specific functionality. Some basic resolvers that have been implemented:
- [X] static resolver
- [ ] round robin
- [ ] dynamic load balancing
- [ ] location-based
- [X] ssh username-based routing

#### Middleware
Your application can optionally implement a middleware stack, used to transform the content of incoming messages.  Middleware is not something that we intend to be modular, but rather, would typically be used to inject your own functionality without modifying existing resolver or proxy agent code.

#### Proxy Agent
Proxy agents forward the content to a destination given the route provided by
the resolver.  Some that have been implemented:
- [ ] HTTP
- [ ] HTTPS
- [X] SSH (Requires SSH Resolver)
- [X] SSH over WS (Basic wrapper used by Wetty)
- [ ] SOCKS

#### Usecases
We are in the process of writing some simple example usecases in the `./examples` folder.  Feel free to contribute your own example code.  Some of the uses we have thought of:
- [ ] HTTP Proxy
- [ ] Dynamic SSH Tunnel


## Getting Started

#### Encryption
If you wish to use encryption, you can pass options into the SSL object:
ssl: {

}

## API

## Contributing
> RedRouter began by merging code from the [RedBird](https://github.com/OptimalBits/redbird) and [RedWire](https://github.com/metocean/redwire) projects.  Thanks to them for their incredible contribuitions!

Because of its modularity, contributing to the RedRouter project is easy.  Simply make a feature request in the issues, so that we can discuss any details, and you can ask any questions that arise.  Right now, packages in the /agent, /backend and /resolver folders will all be included in the core module- but to reduce the number of dependencies in the future, these will be moved to separate repositories.
