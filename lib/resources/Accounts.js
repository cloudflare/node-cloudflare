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
 * Accounts represents the /accounts API endpoint.
 *
 * @class Accounts
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts',
    includeBasic: ['browse', 'get', 'edit'],
    auditLogs: method({
      method: 'GET',
      path: 'audit_logs',
    }),
  })
);
