'use strict';
var prototypal = require('es-class');
var join = require('url-join');
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

module.exports = prototypal({
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
  createFullPath: function (methodPath) {
    return join(this.path, methodPath);
  },
  path: '',
  hasBrokenPatch: false
});
