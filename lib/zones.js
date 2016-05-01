'use strict';
var url = require('url');
var verymodel = require('verymodel');

var Zone = new verymodel.Model({
  id: {type: 'string', max: 32, static: true},
  name: {type: 'string', max: 253, static: true},
  devMode: {type: 'integer', alias: 'development_mode', static: true},
  originalNameServers: {type: 'array', alias: 'original_name_servers', static: true},
  originalRegistrar: {type: 'string', alias: 'original_registrar', static: true},
  originalDNSHost: {type: 'array', max: 50, alias: 'original_dns_host', static: true},
  createdOn: {type: 'date', alias: 'created_on', processIn: function (val) {
    return new Date(val);
  }, processOut: function (val) {
    return val.toISOString();
  }, default: function () {
    return new Date();
  }, static: true},
  modifiedOn: {type: 'date', alias: 'modified_on', processIn: function (val) {
    return new Date(val);
  }, processOut: function (val) {
    return val.toISOString();
  }, default: function () {
    return new Date();
  }, static: true},
  nameservers: {type: 'array', static: true},
  owner: {model: {
    id: {type: 'string', max: 32, static: true},
    email: {type: 'string', max: 90, static: true},
    name: {type: 'string', max: 100, static: true},
    ownerType: {type: 'enum', values: ['user', 'organization'], alias: 'owner_type', static: true}
  }, static: true},
  permissions: {type: 'array', static: true},
  plan: {},
  status: {type: 'enum', values: ['active', 'pending', 'initializing', 'moved', 'deleted', 'deactivated'], static: true},
  paused: {type: 'boolean'},
  type: {type: 'enum', values: ['full', 'partial'], static: true},
  host: {model: {
    name: {type: 'string', static: true},
    website: {type: 'string', static: true}
  }, static: true},
  vanityNameservers: {type: 'array', alias: 'vanity_name_servers'},
  betas: {type: 'array', static: true},
  deactivationReason: {type: 'enum', alias: 'deactivation_reason', values: ['abuse_violation', 'plan_limits_exceeded'], static: true},
  meta: {static: true}
});

Zone.is = function (o) {
  if (o && o.__verymeta && o.__verymeta.model) {
    return o.__verymeta.model === this;
  }

  return false;
};

function browse(query, options) {
  options = options || {};
  options.query = query;

  return this._got('zones', options).then(function (response) {
    var zones = response.body.result.map(function (z) {
      return Zone.create(z);
    });

    return this._paginateResponse(zones, response.body.result_info);
  }.bind(this));
}

function read(zid, options) {
  var uri = url.resolve('zones/', zid);

  return this._got(uri, options).then(function (response) {
    return Zone.create(response.body.result);
  });
}

module.exports.browse = browse;
module.exports.read = read;
module.exports.Zone = Zone;
