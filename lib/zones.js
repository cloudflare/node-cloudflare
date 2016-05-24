'use strict';
var join = require('url-join');
var verymodel = require('verymodel');
var pick = require('lodash/pick');

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
  nameservers: {type: 'array', static: true, alias: 'name_servers'},
  owner: {model: {
    id: {type: 'string', max: 32},
    email: {type: 'string', max: 90},
    name: {type: 'string', max: 100},
    ownerType: {type: 'enum', values: ['user', 'organization'], alias: 'owner_type'}
  }, static: true},
  permissions: {type: 'array', static: true},
  plan: {},
  status: {type: 'enum', values: ['active', 'pending', 'initializing', 'moved', 'deleted', 'deactivated'], static: true},
  paused: {type: 'boolean'},
  type: {type: 'enum', values: ['full', 'partial'], static: true},
  host: {model: {
    name: {type: 'string'},
    website: {type: 'string'}
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
  var uri = join('zones', zid);

  return this._got(uri, options).then(function (response) {
    return Zone.create(response.body.result);
  });
}

function edit(z, options) {
  options = options || {};

  var uri = join('zones', z.id);
  var changes = z.getChanges();

  var patched = Object.keys(changes).map(function (key) {
    var change = changes[key];
    change.key = Zone.alias[key];
    return change;
  }).filter(function (change) {
    return change.changed;
  }).map(function (change) {
    var body = {};
    body[change.key] = change.now;
    return body;
  });

  if (!patched.length) {
    return Promise.resolve(z.makeClone());
  }

  options.method = 'PATCH';

  function sendPatched() {
    var patch = patched.pop();

    options.body = JSON.stringify(patch);

    return this._got(uri, options).then(function (response) {
      if (patched.length) {
        return sendPatched.call(this);
      }

      return Zone.create(response.body.result);
    }.bind(this));
  }

  return sendPatched.call(this);
}

function add(z, jumpstart, options) {
  options = options || {};

  var body = pick(z.toJSON({useAliases: true}), ['name']);

  if (jumpstart === false) {
    body.jump_start = false; // eslint-disable-line camelcase
  }

  options.method = 'POST';
  options.body = JSON.stringify(body);

  return this._got('zones', options).then(function (response) {
    return Zone.create(response.body.result);
  });
}

function remove(z, options) {
  var zid = Zone.is(z) ? z.id : z;
  var uri = join('zones', zid);

  options = options || {};
  options.method = 'DELETE';

  return this._got(uri, options).then(function (response) {
    return response.body.result;
  });
}

module.exports.browse = browse;
module.exports.read = read;
module.exports.edit = edit;
module.exports.add = add;
module.exports.delete = remove;
module.exports.Zone = Zone;
