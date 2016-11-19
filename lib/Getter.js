'use strict';
var prototypal = require('es-class');
var assign = require('object-assign');
var got = require('got');
var spdy = require('spdy');

module.exports = prototypal({
  constructor: function (options) {
    this.agent = options.h2 ? spdy.createAgent({
      host: 'api.cloudflare.com',
      port: 443,
      protocol: ['h2']
    }) : undefined;
  },
  got: function (uri, options) {
    options = assign({}, options, {
      agent: this.agent
    });

    return got(uri, options);
  }
});
