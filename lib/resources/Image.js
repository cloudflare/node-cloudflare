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

module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/images',
    hasBrokenPatch: true,

    getImageDetails: method({
      method: 'GET',
      path: 'v1/:id',
    }),

    createImageUploadUrl: method({
      method: 'POST',
      path: 'v2/direct_upload',
    }),

    del: method({
      method: 'DELETE',
      path: 'v1/:id',
    }),
  })
);
