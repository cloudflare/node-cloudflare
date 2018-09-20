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
 * EnterpriseZoneWorkersRoutes represents the zones/:zoneId/workers/routes API endpoint.
 *
 * @class EnterpriseZoneWorkersRoutes
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/workers/routes',

    includeBasic: ['browse', 'read', 'add', 'del'],

    /**
     * browse allows for listing all of a zone's workers routes
     *
     * @function browse
     * @memberof EnterpriseZoneWorkersRoutes
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @returns {Promise<Object>} The route browse response object.
     */
    /**
     * read allows for retrieving a specific zone's workers route
     *
     * @function read
     * @memberof EnterpriseZoneWorkersRoutes
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @param {string} id - The route ID
     * @returns {Promise<Object>} The route response object.
     */
    /**
     * edit allows for modifying a specific zone's workers
     *
     * @function edit
     * @memberof EnterpriseZoneWorkersRoutes
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @param {string} id - The route ID
     * @param {Object} config - The modified route object
     * @returns {Promise<Object>} The custom hostname response object.
     */
    edit: method({
      method: 'PUT',
      path: ':id',
    }),
    /**
     * add allows for creating a workers route
     *
     * @function add
     * @memberof EnterpriseZoneWorkersRoutes
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @param {Object} config - The new route object
     * @returns {Promise<Object>} The custom route response object.
     */
    /**
     * del allows for removing a workers routes
     *
     * @function del
     * @memberof EnterpriseZoneWorkersRoutes
     * @instance
     * @async
     * @param {string} zone_id - The zone ID
     * @param {string} id - The route ID to delete
     * @returns {Promise<Object>} The custom route response object.
     */
  })
);
