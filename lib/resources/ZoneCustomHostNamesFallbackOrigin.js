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
 * ZoneCustomHostNamesFallbackOrigin represents the /zones/:zoneID/custom_hostnames/fallback_origin API endpoint.
 *
 * @class ZoneCustomHostNamesFallbackOrigin
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/custom_hostnames/fallback_origin',

    /**
     * read allows for retrieving the fallback origin settings
     *
     * @function read
     * @memberof ZoneCustomHostNamesFallbackOrigin
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @returns {Promise<Object>} The fallback origin response object.
     */
    read: method({
      method: 'GET',
    }),
    /**
     * edit allows for modifying the fallback origin settings
     *
     * @function edit
     * @memberof ZoneCustomHostNamesFallbackOrigin
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @param {Object} origin - The origin hostname for the fallback origin
     * @returns {Promise<Object>} The custom hostname response object.
     */
    edit: method({
      method: 'PUT',
    }),
    /**
     * del allows for removing the fallback origin
     *
     * @function del
     * @memberof ZoneCustomHostNamesFallbackOrigin
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @returns {Promise<Object>} The custom hostname response object.
     */
    del: method({
      method: 'DELETE',
    }),
  })
);
