/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Resource = require('../Resource');
const method = require('../method');

/**
 * ZoneWorkersScript represents the /zones/:zoneID/workers/script API endpoint.
 *
 * @class ZoneWorkersScript
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/workers/script',

    /**
     * read retrieves a the current workers script
     *
     * @function read
     * @memberof ZoneWorkersScript
     * @instance
     * @async
     * @param {string} zone_id - The enterprise account ID
     * @returns {Promise<Object>} The workers script response object.
     */
    read: method({
      method: 'GET',
      json: false,
    }),

    /**
     * read retrieves a the current workers script
     *
     * @function read
     * @memberof ZoneWorkersScript
     * @instance
     * @async
     * @param {string} zone_id - The enterprise account ID
     * @param {string} script - The script
     * @returns {Promise<Object>} The workers script response object.
     */
    edit: method({
      method: 'PUT',
      contentType: 'application/javascript',
    }),

    /**
     * del allows for deleting the workers script
     *
     * @function del
     * @memberof ZoneWorkersScript
     * @instance
     * @async
     * @returns {Promise<Object>} The deleted zone workers script response object.
     */
    del: method({
      method: 'DELETE',
    }),
  })
);
