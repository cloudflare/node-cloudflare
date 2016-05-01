'use strict';
var join = require('url-join');

function remove(z, query, options) {
  var CF = this.constructor;

  var zid = z instanceof CF.Zone ? z.id : z;
  var uri = join('zones', zid, 'purge_cache');

  options = options || {};
  options.method = 'DELETE';
  options.query = query;

  return this._got(uri, options).then(function (response) {
    return response.body.success;
  });
}

module.exports.delete = remove;
