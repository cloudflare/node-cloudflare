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
 * UserTokens represents the /user/tokens API endpoint.
 *
 * @class UserTokens
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'user/tokens',

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],
    /**
     * roll rotates the token secret
     *
     * @function roll
     * @memberof UserTokens
     * @instance
     * @async
     * @param {string} id - The User Token ID
     * @returns {Promise<Object>} The User Token response object.
     */
    roll: method({
      method: 'PUT',
      path: ':id/value',
    }),
    /**
     * verify the token secret
     *
     * @function verify
     * @memberof UserTokens
     * @instance
     * @async
     * @returns {Promise<Object>} The User Token response object.
     */
    verify: method({
      method: 'GET',
      path: 'verify',
    }),
    /**
     * browsePermissionGroups browse all available permission groups
     *
     * @function browsePermissionGroups
     * @memberof UserTokens
     * @instance
     * @async
     * @returns {Promise<Object>} The response object.
     */
    browsePermissionGroups: method({
      method: 'GET',
      path: 'permission_groups',
    }),
    /**
     * browse allows for listing user tokens
     *
     * @function browse
     * @memberof UserTokens
     * @instance
     * @async
     * @returns {Promise<Object>} The User Token response object.
     */
    /**
     * read allows for retrieving a user token's details
     *
     * @function read
     * @memberof UserTokens
     * @instance
     * @async
     * @param {string} id - The User Token ID
     * @returns {Promise<Object>} The User Token object.
     */
    /**
     * add allows for creating a user token.
     *
     * @function add
     * @memberof UserTokens
     * @instance
     * @async
     * @param {Object} token - The new user token object
     * @returns {Promise<Object>} The created user token object.
     */
    /**
     * del allows for deleting a user token.
     *
     * @function del
     * @memberof UserTokens
     * @instance
     * @async
     * @param {string} id - The user token ID to delete
     * @returns {Promise<Object>} The deleted user token object.
     */
  })
);
