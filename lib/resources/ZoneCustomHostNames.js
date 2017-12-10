'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'zones/:zoneId/custom_hostnames',

  includeBasic: [
    'browse',
    'read',
    'edit',
    'add',
    'del'
  ]
}));
