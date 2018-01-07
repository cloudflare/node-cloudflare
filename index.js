'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Client = require('./lib/Client');

var resources = {
  dnsRecords: require('./lib/resources/DNSRecords'),
  ips: require('./lib/resources/IPs'),
  zones: require('./lib/resources/Zones'),
  zoneSettings: require('./lib/resources/ZoneSettings'),
  zoneCustomHostNames: require('./lib/resources/ZoneCustomHostNames'),
  user: require('./lib/resources/User')
};

/**
 * Constructs and returns a new Cloudflare API client with the specified authentication.
 *
 * @class Cloudflare
 * @param {Object} auth - The API authentication for an account
 * @param {string} auth.email - The account email address
 * @param {string} auth.key - The account API token key
 *
 * @property {DNSRecords} dnsRecords - DNS Records instance
 * @property {IPs} ips - IPs instance
 * @property {Zones} zones - Zones instance
 * @property {ZoneSettings} zoneSettings - Zone Settings instance
 * @property {ZoneCustomHostNames} zoneCustomHostNames - Zone Custom Host Names instance
 * @property {User} user - User instance
 */
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
