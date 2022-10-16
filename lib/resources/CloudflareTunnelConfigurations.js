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
 * Cloudflare Tunnel Configurations represents the /accounts/:accountId/cfd_tunnel/:tunnel_id/configurations API endpoint.
 *
 * @class CloudflareTunnelConfigurations
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/cfd_tunnel/:tunnel_id/configurations',

    includeBasic: ['read'],

    /**
     * edit allows for modification of the specified Cloudflare Tunnel Configuration
     *
     * @function edit
     * @memberof CloudflareTunnelConfigurations
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} tunnel_id -  The Cloudflare Tunnel ID being modified
     * @param {Object} configuration - The modified Cloudflare Tunnel Configuration object
     * @returns {Promise<Object>} The Cloudflare Tunnel Configuration object.
     */
     edit: method({
      method: 'PUT',
      path: '',
    }),
    /**
     * read allows for retrieving the specified Cloudflare Tunnel Configuration
     *
     * @function read
     * @memberof CloudflareTunnelConfigurations
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} tunnel_id - The Cloudflare Tunnel ID
     * @returns {Promise<Object>} The Cloudflare Tunnel Configuration object.
     */
  })
);
