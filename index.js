'use strict';
var url = require('url');
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
    MaxRedirectError: got.MaxRedirectError,
    IPRanges: ips.IPRanges
  },
  constructor: function (auth) {
    this._got = function (endpoint, options) {
      options = options || {};

      var uri = url.resolve('https://api.cloudflare.com/client/v4/', endpoint);

      return got(uri, {
        json: true,
        timeout: options.timeout || 1E4,
        method: options.method,
        headers: {
          'user-agent': 'cloudflare/' + pkg.version + ' node/' + process.versions.node,
          'X-Auth-Key': auth.key,
          'X-Auth-Email': auth.email
        }
      });
    };
  },
  readIPs: ips.read
});
