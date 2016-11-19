'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');
var method = require('../method');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones',
  hasBrokenPatch: true,

  includeBasic: [
    'browse',
    'read',
    'edit',
    'add',
    'del'
  ],

  activationCheck: method({
    method: 'PUT',
    path: '/:id/activation_check'
  }),

  purgeCache: method({
    method: 'DELETE',
    path: '/:id/purge_cache'
  })
}));
