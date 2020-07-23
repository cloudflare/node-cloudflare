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
 * ZoneAnalytics represents the /zones/:zoneId/analytics API endpoint.
 *
 * @class ZoneAnalytics
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/analytics',
    dashboard: method({
      method: 'GET',
      path: 'dashboard',
    }),
    colos: method({
      method: 'GET',
      path: 'colos',
    }),
  })
);
