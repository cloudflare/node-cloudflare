'use strict';
var prototypal = require('es-class');
var assign = require('object-assign');
var got = require('got');

module.exports = prototypal({
  constructor: function (options) {
    this.options = options || {};
  },
  got: function (uri, options) {
    options = assign({}, this.options, options);

    return got(uri, options);
  }
});
