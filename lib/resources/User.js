'use strict';
var prototypal = require('es-class');
var auto = require('autocreate');

var Resource = require('../Resource');
var method = require('../method');

module.exports = auto(prototypal({
  extends: Resource,
  path: 'user',

  read: method({
    method: 'GET'
  }),

  edit: method({
    method: 'PATCH'
  })
}));
