'use strict';
var prototypal = require('es-class');
var assign = require('object-assign');
var got = require('got');

module.exports = prototypal({
  got: function (uri, options) {
    options = assign({}, options);

    return got(uri, options);
  }
});
