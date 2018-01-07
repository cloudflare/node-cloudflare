/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const URLPattern = require('url-pattern');

const options = ['key', 'email'];

const isPlainObject = function isPlainObject(x) {
  const prototype = Object.getPrototypeOf(x);
  const toString = Object.prototype.toString;

  return (
    toString.call(x) === '[object Object]' &&
    (prototype === null || prototype === Object.getPrototypeOf({}))
  );
};

const isOptionsHash = function isOptionsHash(obj) {
  const hasProp = function(acc, option) {
    if (acc) {
      return acc;
    }

    return Object.prototype.hasOwnProperty.call(obj, option);
  };

  return isPlainObject(obj) && options.reduce(hasProp, false);
};

const getDataFromArgs = function getDataFromArgs(args) {
  if (args.length > 0) {
    if (isPlainObject(args[0]) && !isOptionsHash(args[0])) {
      return args.shift();
    }
  }

  return {};
};

const getOptionsFromArgs = function getOptionsFromArgs(args) {
  const opts = {
    auth: {},
    headers: {},
  };

  if (args.length > 0) {
    const arg = args[args.length - 1];

    if (isOptionsHash(arg)) {
      const params = args.pop();

      if (params.key) {
        opts.auth.key = params.key;
      }

      if (params.email) {
        opts.auth.email = params.email;
      }
    }
  }

  return opts;
};

const identity = function identity(x) {
  return x;
};

module.exports = function(spec) {
  const requestMethod = (spec.method || 'GET').toUpperCase();
  const encode = spec.encode || identity;

  return function() {
    const fullPath = this.createFullPath(spec.path);
    const urlPattern = new URLPattern(fullPath);
    const urlParams = urlPattern.names;
    let err;
    const args = Array.prototype.slice.call(arguments);
    const urlData = {};

    for (let i = 0, length = urlParams.length; i < length; i++) {
      const arg = args[0];

      const param = urlParams[i]; // eslint-disable-line security/detect-object-injection

      if (!arg) {
        /* eslint-disable security/detect-object-injection */
        err = new Error(
          `Cloudflare: Argument "${
            urlParams[i]
          }" required, but got: ${arg} (on API request to ${requestMethod} ${fullPath})`
        );
        /* eslint-enable security/detect-object-injection */

        return Promise.reject(err);
      }

      urlData[param] = args.shift(); // eslint-disable-line security/detect-object-injection
    }

    const data = encode(getDataFromArgs(args));
    const opts = getOptionsFromArgs(args);

    if (args.length !== 0) {
      err = new Error(
        `Cloudflare: Unknown arguments (${args}). Did you mean to pass an options object? (on API request to ${requestMethod} ${fullPath})`
      );

      return Promise.reject(err);
    }

    const requestPath = urlPattern.stringify(urlData);

    if (requestMethod !== 'PATCH' || !this.hasBrokenPatch) {
      return this._client.request(requestMethod, requestPath, data, opts);
    }

    const patched = Object.keys(data);

    const sendPatch = function sendPatch() {
      const patch = patched.pop();
      const datum = {};

      datum[patch] = data[patch]; // eslint-disable-line security/detect-object-injection

      // noinspection JSPotentiallyInvalidUsageOfThis
      return this._client
        .request(requestMethod, requestPath, datum, opts)
        .then(response => {
          if (patched.length > 0) {
            return sendPatch.call(this);
          }

          return response;
        });
    };

    return sendPatch.call(this);
  };
};
