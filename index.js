/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Client = require('./lib/Client');

/* eslint-disable global-require */
const resources = {
  dnsRecords: require('./lib/resources/DNSRecords'),
  ips: require('./lib/resources/IPs'),
  zones: require('./lib/resources/Zones'),
  zoneSettings: require('./lib/resources/ZoneSettings'),
  zoneCustomHostNames: require('./lib/resources/ZoneCustomHostNames'),
  user: require('./lib/resources/User'),
};
/* eslint-enable global-require */

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
const Cloudflare = auto(
  prototypal({
    constructor: function constructor(auth) {
      const client = new Client({
        email: auth && auth.email,
        key: auth && auth.key,
      });

      Object.defineProperty(this, '_client', {
        value: client,
        writable: false,
        enumerable: false,
        configurable: false,
      });

      Object.keys(resources).forEach(function(resource) {
        Object.defineProperty(this, resource, {
          value: resources[resource](this._client), // eslint-disable-line security/detect-object-injection
          writable: true,
          enumerable: false,
          configurable: true,
        });
      }, this);
    },
  })
);

module.exports = Cloudflare;
