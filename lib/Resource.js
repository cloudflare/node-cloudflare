/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const method = require('./method');

const BASIC_METHODS = {
  browse: method({
    method: 'GET',
  }),
  read: method({
    method: 'GET',
    path: ':id',
  }),
  edit: method({
    method: 'PATCH',
    path: ':id',
  }),
  add: method({
    method: 'POST',
  }),
  del: method({
    method: 'DELETE',
    path: ':id',
  }),
};

/**
 * Resource generates basic methods defined on subclasses. It is not intended to
 * be constructed directly.
 *
 * @class Resource
 * @private
 */
module.exports = prototypal(
  /** @lends Resource.prototype */
  {
    constructor: function constructor(client) {
      Object.defineProperty(this, '_client', {
        value: client,
        writable: false,
        enumerable: false,
        configurable: false,
      });

      if (Array.isArray(this.includeBasic)) {
        this.includeBasic.forEach(function(basicMethod) {
          Object.defineProperty(this, basicMethod, {
            value: BASIC_METHODS[basicMethod], // eslint-disable-line security/detect-object-injection
            writable: true,
            enumberable: false,
            configurable: true,
          });
        }, this);
      }
    },
    /**
     * @param {string} methodPath - The path from the {@link method} that should be
     *        joined with the resource's path.
     */
    createFullPath(methodPath) {
      return (methodPath && [this.path, methodPath].join('/')) || this.path;
    },
    path: '',
    hasBrokenPatch: false,
  }
);
