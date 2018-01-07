'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');

/**
 * ZoneCustomHostNames represents the /zones/:zoneID/custom_hostnames API endpoint.
 *
 * @class ZoneCustomHostNames
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones/:zoneId/custom_hostnames',

  includeBasic: [
    'browse',
    'read',
    'edit',
    'add',
    'del'
  ]

  /**
   * browse allows for listing all of a zone's custom hostanames
   *
   * @function browse
   * @memberof ZoneCustomHostNames
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @returns {Promise<Object>} The custom hostname browse response object.
   */
  /**
   * read allows for retrieving a specific custom hostname
   *
   * @function read
   * @memberof ZoneCustomHostNames
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The custom hostname ID
   * @returns {Promise<Object>} The custom hostname response object.
   */
  /**
   * edit allows for modifying a specific zone
   *
   * @function edit
   * @memberof ZoneCustomHostNames
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The custom hostname ID
   * @param {Object} config - The modified custom hostname object
   * @returns {Promise<Object>} The custom hostname response object.
   */
  /**
   * add allows for creating a new zone
   *
   * @function add
   * @memberof ZoneCustomHostNames
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {Object} config - The new custom hostname object
   * @returns {Promise<Object>} The custom hostname response object.
   */
  /**
   * del allows for removing a new zone
   *
   * @function del
   * @memberof ZoneCustomHostNames
   * @instance
   * @async
   * @param {string} zone_id - The zone ID
   * @param {string} id - The custom hostname ID to delete
   * @returns {Promise<Object>} The custom hostname response object.
   */
}));
