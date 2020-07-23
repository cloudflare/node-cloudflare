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
 * ZoneAccessFirewall represents the /zones/:zoneId/firewall/access_rules/rules API endpoint.
 *
 * @class ZoneAccessFirewall
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'zones/:zoneId/firewall/access_rules/rules',
    includeBasic: ['browse', 'read', 'edit', 'delete'],
  })
);
