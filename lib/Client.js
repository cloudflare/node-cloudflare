/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const pkg = require('../package.json');
const Getter = require('./Getter');

const USER_AGENT = JSON.stringify({
  bindings_version: pkg.version, // eslint-disable-line camelcase
  lang: 'node',
  lang_version: process.version, // eslint-disable-line camelcase
  platform: process.platform,
  arch: process.arch,
  publisher: 'cloudflare',
});

const isPlainObject = function isPlainObject(x) {
  const prototype = Object.getPrototypeOf(x);
  const toString = Object.prototype.toString;

  return (
    toString.call(x) === '[object Object]' &&
    (prototype === null || prototype === Object.getPrototypeOf({}))
  );
};

const isUserServiceKey = function isUserServiceKey(x) {
  return x && x.substring(0, 5) === 'v1.0-';
};

module.exports = prototypal({
  constructor: function constructor(options) {
    this.email = options.email;
    this.key = options.key;
    this.token = options.token;
    this.getter = new Getter(options);
  },
  request(requestMethod, requestPath, data, opts) {
    const uri = `https://api.cloudflare.com/client/v4/${requestPath}`;
    const key = opts.auth.key || this.key;
    const token = opts.auth.token || this.token;
    const email = opts.auth.email || this.email;

    const options = {
      json: opts.json !== false,
      timeout: opts.timeout || 1e4,
      retries: opts.retries,
      method: requestMethod,
      headers: {
        'user-agent': `cloudflare/${pkg.version} node/${process.versions.node}`,
        'Content-Type': opts.contentType || 'application/json',
        Accept: 'application/json',
        'X-Cloudflare-Client-User-Agent': USER_AGENT,
      },
    };

    if (isUserServiceKey(key)) {
      options.headers['X-Auth-User-Service-Key'] = key;
    } else if (key) {
      options.headers['X-Auth-Key'] = key;
      options.headers['X-Auth-Email'] = email;
    } else if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (requestMethod === 'GET') {
      options.query = data;
    } else {
      options.body = data;
    }

    if (
      options.body &&
      (isPlainObject(options.body) || Array.isArray(options.body))
    ) {
      options.body = JSON.stringify(options.body);
    }

    return this.getter.got(uri, options).then(res => res.body);
  },
});
