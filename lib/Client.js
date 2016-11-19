'use strict';
var prototypal = require('es-class');
var join = require('url-join');
var pkg = require('../package.json');
var Getter = require('./Getter');

var USER_AGENT = JSON.stringify({
  bindings_version: pkg.version, // eslint-disable-line camelcase
  lang: 'node',
  lang_version: process.version, // eslint-disable-line camelcase
  platform: process.platform,
  arch: process.arch,
  publisher: 'cloudflare'
});

function isPlainObject(x) {
  var prototype = Object.getPrototypeOf(x);
  var toString = Object.prototype.toString;

  return toString.call(x) === '[object Object]' &&
    (prototype === null || prototype === Object.getPrototypeOf({}));
}

function isUserServiceKey(x) {
  return x && x.substring(0, 5) === 'v1.0-';
}

module.exports = prototypal({
  constructor: function (options) {
    this.email = options.email;
    this.key = options.key;
    this.getter = new Getter(options);
  },
  request: function (requestMethod, requestPath, data, opts) {
    var uri = join('https://api.cloudflare.com/client/v4/', requestPath);

    var options = {
      json: true,
      timeout: opts.timeout || 1E4,
      retries: opts.retries,
      method: requestMethod,
      headers: {
        'user-agent': 'cloudflare/' + pkg.version + ' node/' + process.versions.node,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Cloudflare-Client-User-Agent': USER_AGENT
      }
    };

    if (isUserServiceKey(opts.auth.key || this.key)) {
      options.headers['X-Auth-User-Service-Key'] = opts.auth.key || this.key;
    } else {
      options.headers['X-Auth-Key'] = opts.auth.key || this.key;
      options.headers['X-Auth-Email'] = opts.auth.email || this.email;
    }

    if (requestMethod === 'GET') {
      options.query = data;
    } else {
      options.body = data;
    }

    if (options.body && isPlainObject(options.body)) {
      options.body = JSON.stringify(options.body);
    }

    return this.getter.got(uri, options).then(function (res) {
      return res.body;
    });
  }
});
