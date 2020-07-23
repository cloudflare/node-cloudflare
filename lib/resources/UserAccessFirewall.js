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
 * UserAccessFirewall represents the /user/firewall/access_rules/rules API endpoint.
 *
 * @class UserAccessFirewall
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'user/firewall/access_rules/rules',
    includeBasic: ['browse', 'read', 'edit', 'delete'],
  })
);
