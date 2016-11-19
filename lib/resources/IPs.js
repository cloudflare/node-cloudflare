'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'ips',

  includeBasic: [
    'browse'
  ]
}));
