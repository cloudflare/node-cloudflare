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
 * Zones represents the /zones API endpoint.
 *
 * @class Zones
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones',
    hasBrokenPatch: true,

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * activationCheck initiates another zone activation check
     *
     * @function activationCheck
     * @memberof Zones
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @returns {Promise<Object>} The response object
     */
    activationCheck: method({
      method: 'PUT',
      path: ':id/activation_check',
    }),

    /**
     * purgeCache purges files from Cloudflare's cache
     *
     * @function purgeCache
     * @memberof Zones
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @param {Object} [params] - Parameters to restrict purges
     * @param {string[]|Object[]} [params.files] - Files to purge from the Cloudflare cache
     * @param {string[]} [params.tags] - Purge files served with these Cache-Tag headers
     * @param {string[]} [params.hosts] - Purge files that match these hosts
     * @returns {Promise<Object>} The response object
     */
    purgeCache: method({
      method: 'DELETE',
      path: ':id/purge_cache',
    }),

    /**
     * browse allows for listing all the zones
     *
     * @function browse
     * @memberof Zones
     * @instance
     * @async
     * @returns {Promise<Object>} The zone browse response object.
     */
    /**
     * read allows for retrieving a specific zone
     *
     * @function read
     * @memberof Zones
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @returns {Promise<Object>} The zone response object.
     */
    /**
     * edit allows for modifying a specific zone
     *
     * @function edit
     * @memberof Zones
     * @instance
     * @async
     * @param {string} id - The zone ID
     * @param {Object} zone - The modified zone object
     * @returns {Promise<Object>} The zone response object.
     */
    /**
     * add allows for creating a new zone
     *
     * @function add
     * @memberof Zones
     * @instance
     * @async
     * @param {Object} zone - The new zone object
     * @returns {Promise<Object>} The zone response object.
     */
    /**
     * del allows for removing a new zone
     *
     * @function del
     * @memberof Zones
     * @instance
     * @async
     * @param {string} id - The zone ID to delete
     * @returns {Promise<Object>} The zone response object.
     */
  })
);
