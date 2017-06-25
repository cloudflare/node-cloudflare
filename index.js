'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Client = require('./lib/Client');

var resources = {
  dnsRecords: require('./lib/resources/DNSRecords'),
  ips: require('./lib/resources/IPs'),
  zones: require('./lib/resources/Zones'),
  user: require('./lib/resources/User')
};

var Cloudflare = auto(prototypal({
  constructor: function (auth) {
    var client = new Client({
      email: auth && auth.email,
      key: auth && auth.key
    });

    Object.defineProperty(this, '_client', {
      value: client,
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.keys(resources).forEach(function (resource) {
      Object.defineProperty(this, resource, {
        value: resources[resource](this._client),
        writable: true,
        enumerable: false,
        configurable: true
      });
    }, this);
  }
}));

module.exports = Cloudflare;
