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
 * AccountAccessFirewall represents the /accounts/:accountId/firewall/access_rules/rules API endpoint.
 *
 * @class AccountAccessFirewall
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/firewall/access_rules/rules',
    includeBasic: ['browse', 'read', 'edit', 'del', 'add'],
  })
);
