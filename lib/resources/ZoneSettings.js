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
 * ZoneSettings represents the /zones/:zoneID/settings API endpoint.
 *
 * @class ZoneSettings
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/settings',

    includeBasic: ['browse', 'read', 'edit'],

    /**
     * editAll allows for editing of all the zone settings at once
     *
     * @function editAll
     * @memberof ZoneSettings
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @param {Object} settings - The modified zone settings
     * @returns {Promise<Object>} The response object
     */
    editAll: method({
      method: 'PATCH',
    }),

    /**
     * browse allows for listing all the zone settings
     *
     * @function browse
     * @memberof ZoneSettings
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @returns {Promise<Object>} The zone settings response object.
     */
    /**
     * read retrieves a single zone setting
     *
     * @function read
     * @memberof ZoneSettings
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @param {string} setting = The setting name
     * @returns {Promise<Object>} The zone settings response object.
     */
    /**
     * edit modifies a single zoen setting
     *
     * @function edit
     * @memberof ZoneSettings
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @param {string} setting = The setting name
     * @param {sting|Object} value - The new zone setting
     * @returns {Promise<Object>} The zone settings response object.
     */
  })
);
