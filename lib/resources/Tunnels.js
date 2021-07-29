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
 * Tunnels represents the /accounts/:accountId/tunnels API endpoint.
 *
 * @class Tunnels
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/tunnels',

    includeBasic: ['browse', 'read', 'add', 'del'],

    /**
     * clean removes stale connection resources from an Argo Tunnel
     *
     * @function clean
     * @memberof Tunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The tunnel ID being modified
     * @returns {Promise<Object>} The response object.
     */
    clean: method({
      method: 'DELETE',
      path: ':id/connections',
    }),


    /**
     * browse allows for listing all Tunnel for an account
     *
     * @function browse
     * @memberof Tunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The Tunnels browser response object.
     */
    /**
     * read allows for retrieving the specified Tunnel
     *
     * @function read
     * @memberof Tunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Tunnel ID
     * @returns {Promise<Object>} The Tunnel object.
     */
    /**
     * add allows for creating a new Tunnel for an account.
     *
     * @function add
     * @memberof Tunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Tunnel ID
     * @returns {Promise<Object>} The created Tunnel object.
     */
    /**
     * del allows for deleting the specified Tunnel
     *
     * @function del
     * @memberof Tunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Tunnel ID
     * @returns {Promise<Object>} The deleted Tunnel object.
     */
  })
);
