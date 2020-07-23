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
 * AccountSubscriptions represents the /accounts/:accountId/subscriptions API endpoint.
 *
 * @class AccountSubscriptions
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/subscriptions',
    includeBasic: ['browse', 'edit', 'add', 'del'],
  })
);
