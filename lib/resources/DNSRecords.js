'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');
var method = require('../method');

/**
 * DNSRecords represents the /zones/:zoneID/dns_records API endpoint.
 *
 * @class DNSRecords
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones/:zoneId/dns_records',

  includeBasic: [
    'browse',
    'read',
    'add',
    'del'
  ],

  /**
   * edit allows for modification of the specified DNS Record
   *
   * @function edit
   * @memberof DNSRecords
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The DNS record ID being modified
   * @param {Object} record - The modified dns record object
   * @returns {Promise<Object>} The DNS record object.
   */
  edit: method({
    method: 'PUT',
    path: '/:id'
  })

  /**
   * browse allows for listing all DNS Records for a zone
   *
   * @function browse
   * @memberof DNSRecords
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @returns {Promise<Object>} The DNS browser response object.
   */
  /**
   * read allows for retrieving the specified DNS Record
   *
   * @function read
   * @memberof DNSRecords
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The DNS record ID
   * @returns {Promise<Object>} The DNS record object.
   */
  /**
   * add allows for creating a new DNS record for a zone.
   *
   * @function add
   * @memberof DNSRecords
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {Object} record - The new DNS record object
   * @returns {Promise<Object>} The created DNS record object.
   */
  /**
   * del allows for deleting the specified DNS Record
   *
   * @function del
   * @memberof DNSRecords
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The DNS record ID to delete
   * @returns {Promise<Object>} The deleted DNS record object.
   */
}));
