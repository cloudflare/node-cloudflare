/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const assign = require('object-assign');
const got = require('got');

module.exports = prototypal({
  constructor: function constructor(options) {
    this._agent = options.agent;
  },
  got(uri, options) {
    options = assign({}, options);
    options.agent = this._agent;

    return got(uri, options);
  },
});
