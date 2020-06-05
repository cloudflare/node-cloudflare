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
 * PageRules represents the /zones/:zoneID/pagerules API endpoint.
 *
 * @class PageRules
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/pagerules',

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * browse allows for listing all the page rules
     *
     * @function browse
     * @memberof PageRules
     * @instance
     * @async
     * @returns {Promise<Object>} The page rules browse response object.
     */
    /**
     * read allows for retrieving a specific page rule
     *
     * @function read
     * @memberof PageRules
     * @instance
     * @async
     * @param {string} id - The page rule ID
     * @returns {Promise<Object>} The page rule response object.
     */
    /**
     * edit allows for modifying a specific zone
     *
     * @function edit
     * @memberof PageRules
     * @instance
     * @async
     * @param {string} id - The page rule ID
     * @param {Object} page_rule - The modified page rule object
     * @returns {Promise<Object>} The page rule response object.
     */
    /**
     * add allows for creating a new zone
     *
     * @function add
     * @memberof PageRules
     * @instance
     * @async
     * @param {Object} zone - The new page rule object
     * @returns {Promise<Object>} The page rule response object.
     */
    /**
     * del allows for removing a new zone
     *
     * @function del
     * @memberof PageRules
     * @instance
     * @async
     * @param {string} id - The page rule ID to delete
     * @returns {Promise<Object>} The page rule response object.
     */
  })
);
