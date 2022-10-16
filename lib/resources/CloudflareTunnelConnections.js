/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Resource = require('../Resource');

/**
 * Cloudflare Tunnel Connections represents the /accounts/:accountId/cfd_tunnel/:tunnel_id/connections API endpoint.
 *
 * @class CloudflareTunnelConnections
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/cfd_tunnel/:tunnel_id/connections',

    includeBasic: ['browse', 'del'],

    /**
     * browse allows for listing all Cloudflare Tunnel Connections for a Cloudflare Tunnel
     *
     * @function browse
     * @memberof CloudflareTunnelConnections
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} tunnel_id - The tunnel ID
     * @returns {Promise<Object>} The Cloudflare Tunnel Connections response object.
     */
    /**
     * del removes stale connection resources from a Cloudflare Tunnel
     *
     * @function del
     * @memberof CloudflareTunnelConnections
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} tunnel_id - The tunnel ID
     * @returns {Promise<Object>} The response object.
     */
  })
);
