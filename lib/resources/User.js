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
 * User represents the /user API endpoint.
 *
 * @class User
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'user',

    /**
     * read returns the current user object
     *
     * @function read
     * @memberof User
     * @instance
     * @async
     * @returns {Promise<Object>} The user object
     */
    read: method({
      method: 'GET',
    }),

    /**
     * edit allows for modification of the current user
     *
     * @function edit
     * @memberof User
     * @instance
     * @async
     * @param {Object} user - The modified user object
     * @returns {Promise<Object>} The user object
     */
    edit: method({
      method: 'PATCH',
    }),
  })
);
