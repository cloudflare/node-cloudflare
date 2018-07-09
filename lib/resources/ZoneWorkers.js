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
 * ZoneWorkers represents the /zones/:zoneId/workers API endpoint.
 *
 * @class ZoneWorkers
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/workers',

    /**
     * validate allows for validating a workers script
     *
     * @function validate
     * @memberof ZoneWorkers
     * @instance
     * @async
     * @param {string} zoneId - The zone ID
     * @param {string} script - The worker script
     * @returns {Promise<Object>} The validate response object.
     */
    validate: method({
      method: 'PUT',
      path: 'validate',
      contentType: 'application/javascript',
    }),
  })
);
