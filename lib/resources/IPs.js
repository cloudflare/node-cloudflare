'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');

/**
 * IPs represents the /ips API endpoint.
 *
 * @class IPs
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(prototypal(
  {
    extends: Resource,
    path: 'ips',

    includeBasic: [
      'browse'
    ]

  /**
   * browse returns a Promise of the current Cloudflare IPv4 and IPv6 addresses.
   *
   * @function browse
   * @memberof IPs
   * @instance
   * @async
   * @returns {Promise<Object>} The IPv4 and IPv6 addresses
   * @example
   * // logs the fetched IP addresses
   * cf.ips.browse(console.log)
   */
  }
));
