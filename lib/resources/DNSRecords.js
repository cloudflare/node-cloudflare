'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');
var method = require('../method');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones/:zoneId/dns_records',

  includeBasic: [
    'browse',
    'read',
    'add',
    'del'
  ],

  edit: method({
    method: 'PUT',
    path: '/:id'
  })
}));
