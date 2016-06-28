'use strict';
var join = require('url-join');

function remove(z, query, options) {
  var CF = this.constructor;

  var zid = CF.Zone.is(z) ? z.id : z;
  var uri = join('zones', zid, 'purge_cache');

  options = options || {};
  options.method = 'DELETE';
  options.body = JSON.stringify(query);

  return this._got(uri, options).then(function (response) {
    return response.body.success;
  });
}

module.exports.delete = remove;
