'use strict';
var url = require('url');
var spdy = require('spdy');
var got = require('got');
var prototypal = require('es-class');
var pkg = require('./package.json');

var ips = require('./lib/ips');
var zones = require('./lib/zones');
var purge = require('./lib/purge');
var dns = require('./lib/dns');

/**
 * Stub for paginated responses.
 *
 * Can be expanded later allow for getting the next page of results.
 */
function PaginatedResponse(result, info) {
  this.result = result;
  this.page = info.page;
  this.perPage = info.per_page;
  this.count = info.count;
  this.total = info.total_count;
}

module.exports = prototypal({
  static: {
    RequestError: got.RequestError,
    ReadError: got.ReadError,
    ParseError: got.ParseError,
    HTTPError: got.HTTPError,
    MaxRedirectError: got.MaxRedirectError,
    PaginatedResponse: PaginatedResponse
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
        query: options.query,
        body: options.body,
        headers: {
          'user-agent': 'cloudflare/' + pkg.version + ' node/' + process.versions.node,
          'X-Auth-Key': opts.key,
          'X-Auth-Email': opts.email,
          'Content-Type': 'application/json'
        },
        agent: spdyAgent
      });
    };
  },
  _paginateResponse: function (result, info) {
    return new PaginatedResponse(result, info);
  },
  readIPs: ips.read,
  browseZones: zones.browse,
  readZone: zones.read,
  editZone: zones.edit,
  addZone: zones.add,
  deleteZone: zones.delete,
  deleteCache: purge.delete,
  browseDNS: dns.browse,
  readDNS: dns.read,
  editDNS: dns.edit,
  deleteDNS: dns.delete,
  addDNS: dns.add
});

module.exports.IPRanges = ips.IPRanges;
module.exports.Zone = zones.Zone;
module.exports.DNSRecord = dns.DNSRecord;
