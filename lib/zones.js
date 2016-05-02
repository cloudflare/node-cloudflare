'use strict';
var join = require('url-join');

function Zone(z) {
  this.id = z.id;
  this.name = z.name;
  this.devMode = z.development_mode;
  this.originalNameServers = z.original_name_servers;
  this.originalRegistrar = z.original_registrar;
  this.originalDNSHost = z.original_dnshost;
  this.createdOn = new Date(z.created_on);
  this.modifiedOn = new Date(z.modified_on);
  this.nameservers = z.name_servers;
  this.owner = z.owner;
  this.permissions = z.permissions;
  this.plan = z.plan;
  this.status = z.status;
  this.paused = z.paused;
  this.type = z.type;
  this.host = z.host;
  this.vanitiyNameservers = z.vanity_name_servers;
  this.betas = z.betas;
  this.deactivationReason = z.deactivation_reason;
  this.meta = z.meta;
}

function browse(query, options) {
  options = options || {};
  options.query = query;

  return this._got('zones', options).then(function (response) {
    var zones = response.body.result.map(function (z) {
      return new Zone(z);
    });

    return this._paginateResponse(zones, response.body.result_info);
  }.bind(this));
}

function read(zid, options) {
  var uri = join('zones', zid);

  return this._got(uri, options).then(function (response) {
    return new Zone(response.body.result);
  });
}

function remove(z, options) {
  var zid = z instanceof Zone ? z.id : z;
  var uri = join('zones', zid);

  options = options || {};
  options.method = 'DELETE';

  return this._got(uri, options).then(function (response) {
    return response.body.result;
  });
}

module.exports.browse = browse;
module.exports.read = read;
module.exports.delete = remove;
module.exports.Zone = Zone;
