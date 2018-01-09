/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const shouldProxy = require('should-proxy');
const HttpsProxyAgent = require('https-proxy-agent');

/**
 * proxyAgent returns an HTTPS agent to use to access the base URL.
 *
 * @private
 * @param {string} httpsProxy - HTTPS Proxy URL
 * @param {string} noProxy - URLs that should be excluded from proxying
 * @param {string} base - The client base URL
 * @returns {https.Agent|null} - The HTTPS agent, if required to access the base URL.
 */
const proxyAgent = function proxyAgent(httpsProxy, noProxy, base) {
  if (!httpsProxy) {
    return null;
  }
  noProxy = noProxy || '';

  const ok = shouldProxy(base, {
    no_proxy: noProxy, // eslint-disable-line camelcase
  });

  if (!ok) {
    return null;
  }

  return new HttpsProxyAgent(httpsProxy);
};

module.exports.proxyAgent = proxyAgent;
