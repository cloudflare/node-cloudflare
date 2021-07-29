/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Client = require('./lib/Client');
const proxy = require('./lib/proxy');

/* eslint-disable global-require */
const resources = {
  argoTunnels: require('./lib/resources/ArgoTunnels'),
  dnsRecords: require('./lib/resources/DNSRecords'),
  enterpriseZoneWorkersScripts: require('./lib/resources/EnterpriseZoneWorkersScripts'),
  enterpriseZoneWorkersRoutes: require('./lib/resources/EnterpriseZoneWorkersRoutes'),
  enterpriseZoneWorkersKVNamespaces: require('./lib/resources/EnterpriseZoneWorkersKVNamespaces'),
  enterpriseZoneWorkersKV: require('./lib/resources/EnterpriseZoneWorkersKV'),
  ips: require('./lib/resources/IPs'),
  pageRules: require('./lib/resources/PageRules'),
  zones: require('./lib/resources/Zones'),
  zoneSettings: require('./lib/resources/ZoneSettings'),
  zoneCustomHostNames: require('./lib/resources/ZoneCustomHostNames'),
  zoneWorkers: require('./lib/resources/ZoneWorkers'),
  zoneWorkersScript: require('./lib/resources/ZoneWorkersScript'),
  zoneWorkersRoutes: require('./lib/resources/ZoneWorkersRoutes'),
  user: require('./lib/resources/User'),
  userTokens: require('./lib/resources/UserTokens'),
  stream: require('./lib/resources/Stream'),
};
/* eslint-enable global-require */

/**
 * withEnvProxy configures an HTTPS proxy if required to reach the Cloudflare API.
 *
 * @private
 * @param {Object} opts - The current Cloudflare options
 */
const withEnvProxy = function withEnvProxy(opts) {
  /* eslint-disable no-process-env */
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const noProxy = process.env.NO_PROXY || process.env.no_proxy;
  /* eslint-enable no-process-env */

  if (httpsProxy) {
    const agent = proxy.proxyAgent(
      httpsProxy,
      noProxy,
      'https://api.cloudflare.com'
    );

    if (agent) {
      opts.agent = agent;
    }
  }
};

/**
 * Constructs and returns a new Cloudflare API client with the specified authentication.
 *
 * @class Cloudflare
 * @param {Object} auth - The API authentication for an account
 * @param {string} auth.email - The account email address
 * @param {string} auth.key - The account API key
 * @param {string} auth.token - The account API token
 *
 * @property {DNSRecords} dnsRecords - DNS Records instance
 * @property {IPs} ips - IPs instance
 * @property {PageRules} pageRules - Page Rules instance
 * @property {Zones} zones - Zones instance
 * @property {ZoneSettings} zoneSettings - Zone Settings instance
 * @property {ZoneCustomHostNames} zoneCustomHostNames - Zone Custom Host Names instance
 * @property {User} user - User instance
 */
const Cloudflare = auto(
  prototypal({
    constructor: function constructor(auth) {
      const opts = {
        email: auth && auth.email,
        key: auth && auth.key,
        token: auth && auth.token,
      };

      withEnvProxy(opts);

      const client = new Client(opts);

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
