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
 * Argo Tunnels represents the /accounts/:accountId/tunnels API endpoint.
 *
 * @class ArgoTunnels
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
     * @memberof ArgoTunnels
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
     * browse allows for listing all Argo Tunnels for an account
     *
     * @function browse
     * @memberof ArgoTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The Argo Tunnels response object.
     */
    /**
     * read allows for retrieving the specified Argo Tunnel
     *
     * @function read
     * @memberof ArgoTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Argo Tunnel ID
     * @returns {Promise<Object>} The Argo Tunnel object.
     */
    /**
     * add allows for creating a new Argo Tunnel for an account.
     *
     * @function add
     * @memberof ArgoTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} tunnel - The new Argo Tunnel object
     * @returns {Promise<Object>} The created Argo Tunnel object.
     */
    /**
     * del allows for deleting the specified Tunnel
     *
     * @function del
     * @memberof ArgoTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Argo Tunnel ID
     * @returns {Promise<Object>} The deleted Argo Tunnel object.
     */
  })
);
