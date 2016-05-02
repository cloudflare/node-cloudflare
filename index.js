'use strict';
var url = require('url');
var spdy = require('spdy');
var got = require('got');
var prototypal = require('es-class');
var pkg = require('./package.json');

var ips = require('./lib/ips');

function canUseH2(opt) {
  return opt !== false && !process.versions.node.match(/^0\.10/);
}

module.exports = prototypal({
  static: {
    RequestError: got.RequestError,
    ReadError: got.ReadError,
    ParseError: got.ParseError,
    HTTPError: got.HTTPError,
    MaxRedirectError: got.MaxRedirectError,
    IPRanges: ips.IPRanges
  },
  constructor: function (opts) {
    opts = opts || {};

    var spdyAgent = canUseH2(opts.h2) ? spdy.createAgent({
      host: 'api.cloudflare.com',
      port: 443,
      protocol: ['h2']
    }).once('error', function (err) {
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
