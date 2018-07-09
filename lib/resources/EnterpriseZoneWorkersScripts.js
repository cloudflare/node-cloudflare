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
 * EnterpriseZoneWorkersScripts represents the accounts/:accountId/workers/scripts API endpoint.
 *
 * @class EnterpriseZoneWorkersScripts
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/workers/scripts',

    includeBasic: ['browse', 'del'],

    /**
     * read retrieves a single workers script
     *
     * @function read
     * @memberof EnterpriseZoneWorkersScripts
     * @instance
     * @async
     * @param {string} account_id - The enterprise account ID
     * @param {string} name - The script name
     * @returns {Promise<Object>} The workers script response object.
     */
    read: method({
      method: 'GET',
      path: ':name',
      json: false,
    }),

    /**
     * edit uploads a new version of a workers script
     *
     * @function edit
     * @memberof EnterpriseZoneWorkersScripts
     * @instance
     * @async
     * @param {string} account_id - The enterprise account ID
     * @param {string} name - The script name
     * @param {string} script - The script
     * @returns {Promise<Object>} The response object
     */
    edit: method({
      method: 'PUT',
      path: ':name',
      contentType: 'application/javascript',
    }),

    /**
     * browse allows for listing all the workers scripts
     *
     * @function browse
     * @memberof EnterpriseZoneWorkersScripts
     * @instance
     * @async
     * @param {string} account_id - The enterprise account ID
     * @param {string} name - The script name
     * @returns {Promise<Object>} The zone workers script response object.
     */
    /**
     * del allows for deleting the specified workers script
     *
     * @function del
     * @memberof EnterpriseZoneWorkersScripts
     * @instance
     * @async
     * @param {string} account_id - The enterprise account ID
     * @param {string} name - The script name
     * @returns {Promise<Object>} The deleted zone workers script response object.
     */
  })
);
