'use strict';
var url = require('url');
var spdy = require('spdy');
var got = require('got');
var prototypal = require('es-class');
var pkg = require('./package.json');

var ips = require('./lib/ips');

module.exports = prototypal({
  static: {
    RequestError: got.RequestError,
    ReadError: got.ReadError,
    ParseError: got.ParseError,
    HTTPError: got.HTTPError,
    MaxRedirectError: got.MaxRedirectError
  },
  constructor: function (opts) {
    opts = opts || {};

    var spdyAgent = opts.h2 ? spdy.createAgent({
      host: 'api.cloudflare.com',
      port: 443,
      protocol: ['h2']
    }).once('error', function (err) {
      /* istanbul ignore next */
      this.emit('error', err);
    }) : undefined;

    this._got = function (endpoint, options) {
      options = options || {};

      var uri = url.resolve('https://api.cloudflare.com/client/v4/', endpoint);

      return got(uri, {
        json: true,
        timeout: options.timeout || 1E4,
        retries: options.retries,
        method: options.method,
        headers: {
          'user-agent': 'cloudflare/' + pkg.version + ' node/' + process.versions.node,
          'X-Auth-Key': opts.key,
          'X-Auth-Email': opts.email
        },
        agent: spdyAgent
      });
    };
  },
  readIPs: ips.read
});

module.exports.IPRanges = ips.IPRanges;
