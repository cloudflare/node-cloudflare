'use strict';
var prototypal = require('es-class');
var method = require('./method');

var BASIC_METHODS = {
  browse: method({
    method: 'GET'
  }),
  read: method({
    method: 'GET',
    path: '/:id'
  }),
  edit: method({
    method: 'PATCH',
    path: '/:id'
  }),
  add: method({
    method: 'POST'
  }),
  del: method({
    method: 'DELETE',
    path: '/:id'
  })
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
    constructor: function (client) {
      Object.defineProperty(this, '_client', {
        value: client,
        writable: false,
        enumerable: false,
        configurable: false
      });

      if (Array.isArray(this.includeBasic)) {
        this.includeBasic.forEach(function (m) {
          Object.defineProperty(this, m, {
            value: BASIC_METHODS[m],
            writable: true,
            enumberable: false,
            configurable: true
          });
        }, this);
      }
    },
  /**
   * @param {string} methodPath - The path from the {@link method} that should be
   *        joined with the resource's path.
   */
    createFullPath: function (methodPath) {
      return (methodPath && [this.path, methodPath].join('/')) || this.path;
    },
    path: '',
    hasBrokenPatch: false
  }
);
