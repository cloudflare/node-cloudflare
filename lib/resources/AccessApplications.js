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
 * Access Applications represents the /accounts/:accountId/access/apps API endpoint.
 *
 * @class AccessApplications
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/access/apps',

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * browse allows for listing all Access Applications for an account
     *
     * @function browse
     * @memberof AccessApplications
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The Access Applications response object.
     */
    /**
     * read allows for retrieving the specified Access Applications
     *
     * @function read
     * @memberof AccessApplications
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Access Applications ID
     * @returns {Promise<Object>} The Access Applications object.
     */
    /**
     * edit allows for modifying a specific Access Applications
     *
     * @function edit
     * @memberof AccessApplications
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} application - The modified Access Applications object
     * @returns {Promise<Object>} The Access Applications response object.
     */
    /**
     * add allows for creating a new Access Applications for an account.
     *
     * @function add
     * @memberof AccessApplications
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} application - The new Access Applications object
     * @returns {Promise<Object>} The created Access Applications object.
     */
    /**
     * del allows for deleting the specified Application
     *
     * @function del
     * @memberof AccessApplications
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The Access Applications ID
     * @returns {Promise<Object>} The deleted Access Applications object.
     */
  })
);
