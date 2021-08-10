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
 * EnterpriseZoneWorkersKV represents the accounts/:accountId/storage/kv/namespaces API endpoint.
 *
 * @class EnterpriseZoneWorkersKV
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/storage/kv/namespaces/:namespaceId',

    /**
     * browse allows for listing all the keys of a namespace
     *
     * @function browse
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @returns {Promise<Object>} The KV response object.
     */
    browse: method({
      method: 'GET',
      path: 'keys',
    }),
    /**
     * add allows for creating a key-value pair in a namespace
     *
     * @function add
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @param {string} id - The key to store into
     * @param {string} value - The value to store
     * @returns {Promise<Object>} The KV response object
     */
    add: method({
      method: 'PUT',
      path: 'values/:id',
    }),
    /**
     * read allows for reading the contents of key in a namespace
     *
     * @function read
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @param {string} id - The key to read from
     * @returns {Promise<Object>} The KV response object
     */
    read: method({
      method: 'GET',
      path: 'values/:id',
      json: false,
      contentType: 'text/plain',
    }),
    /**
     * del allows for deleting a key and its contents in a namespace
     *
     * @function del
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @param {string} id - The key to delete
     * @returns {Promise<Object>} The KV response object
     */
    del: method({
      method: 'DELETE',
      path: 'values/:id',
    }),
    /**
     * addMulti allows for creating multiple key-value pairs in a namespace
     *
     * @function addMulti
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @param {Array<Object>} data - An array containing key-vaue pair Objects to add
     * @returns {Promise<Object>} The KV response object
     */
    addMulti: method({
      method: 'PUT',
      path: 'bulk',
    }),
    /**
     * delMulti allows for deleting multiple key-value pairs in a namespace
     *
     * @function delMulti
     * @memberof EnterpriseZoneWorkersKV
     * @instance
     * @async
     * @param {string} account_id - The account ID
     * @param {string} namespace_id - The namespace ID
     * @param {Array<String>} data - The array with keys to delete
     * @returns {Promise<Object>} The KV response object
     */
    delMulti: method({
      method: 'DELETE',
      path: 'bulk',
    }),
  })
);
