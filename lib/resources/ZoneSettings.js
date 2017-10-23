'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');
var method = require('../method');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones/:zoneId/settings',

  includeBasic: [
    'browse',
    'read',
    'edit'
  ],

  editAll: method({
    method: 'PATCH',
    path: '/'
  })
}));
