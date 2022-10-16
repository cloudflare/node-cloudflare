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
 * Cloudflare Tunnels represents the /accounts/:accountId/cfd_tunnel API endpoint.
 *
 * @class CloudflareTunnels
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/cfd_tunnel',

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * token gets the Tunnel token for a previously created Cloudflare Tunnel
     *
     * @function clean
     * @memberof ArgoTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The tunnel ID to get the token of
     * @returns {Promise<Object>} The response object.
     */
    token: method({
        method: 'GET',
        path: ':id/token',
      }),
    
    /**
     * browse allows for listing all Cloudflare Tunnels for an account
     *
     * @function browse
     * @memberof CloudflareTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The Cloudflare Tunnels response object.
     */
    /**
     * read allows for retrieving the specified Cloudflare Tunnel
     *
     * @function read
     * @memberof CloudflareTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Cloudflare Tunnel ID
     * @returns {Promise<Object>} The Cloudflare Tunnel object.
     */
    /**
     * add allows for creating a new Cloudflare Tunnel for an account.
     *
     * @function add
     * @memberof CloudflareTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} tunnel - The new Cloudflare Tunnel object
     * @returns {Promise<Object>} The created Cloudflare Tunnel object.
     */
    /**
     * edit allows for modification of the specified Cloudflare Tunnel
     *
     * @function edit
     * @memberof CloudflareTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} tunnel - The updated Cloudflare Tunnel object
     * @returns {Promise<Object>} The updated Cloudflare Tunnel object.
     */
    /**
     * del allows for deleting the specified Tunnel
     *
     * @function del
     * @memberof CloudflareTunnels
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Cloudflare Tunnel ID
     * @returns {Promise<Object>} The deleted Cloudflare Tunnel object.
     */
  })
);
