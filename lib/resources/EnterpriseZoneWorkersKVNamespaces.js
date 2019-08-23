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
 * EnterpriseZoneWorkersKVNamespaces represents the accounts/:accountId/storage/kv/namespaces API endpoint.
 *
 * @class EnterpriseZoneWorkersKVNamespaces
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/storage/kv/namespaces',

    includeBasic: ['browse', 'add', 'del'],

    /**
     * browse allows for listing all of a zone's workers namespaces
     *
     * @function browse
     * @memberof EnterpriseZoneWorkersKVNamespaces
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @returns {Promise<Object>} The namespace response object.
     */
    /**
     * add allows for creating a workers namespace
     *
     * @function add
     * @memberof EnterpriseZoneWorkersKVNamespaces
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {Object} config - The namespace object
     * @returns {Promise<Object>} The namespace response object.
     */
    /**
     * del allows for deleting a workers namespace
     *
     * @function del
     * @memberof EnterpriseZoneWorkersKVNamespaces
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} id - The namespace id
     * @returns {Promise<Object>} The namespace response object.
     */
    /**
     * edit allows for renaming a workers namespace
     *
     * @function edit
     * @memberof EnterpriseZoneWorkersKVNamespaces
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} id - The namespace id
     * @param {Object} config - The namespace object
     * @returns {Promise<Object>} The namespace response object.
     */
    edit: method({
      method: 'PUT',
      path: ':id',
    }),
  })
);
