'use strict';
var join = require('url-join');
var verymodel = require('verymodel');
var pick = require('lodash/pick');

var DNSRecord = new verymodel.Model({
  id: {type: 'string', static: true, max: 32},
  type: {type: 'enum', values: ['A', 'AAAA', 'CNAME', 'TXT', 'SRV', 'LOC', 'MX', 'NS', 'SPF']},
  name: {type: 'string', max: 255},
  content: {type: 'string'},
  proxiable: {type: 'boolean', static: true},
  proxied: {type: 'boolean'},
  ttl: {type: 'integer'},
  locked: {type: 'boolean', static: true},
  zoneId: {type: 'string', static: true, max: 32, alias: 'zone_id'},
  zoneName: {type: 'string', static: true, alias: 'zone_name'},
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
  data: {},
  meta: {}
});

DNSRecord.is = function (o) {
  if (o && o.__verymeta && o.__verymeta.model) {
    return o.__verymeta.model === this;
  }

  return false;
};

function browse(z, query, options) {
  options = options || {};
  options.query = query;

  var CF = this.constructor;
  var zid = CF.Zone.is(z) ? z.id : z;
  var uri = join('zones', zid, 'dns_records');

  return this._got(uri, options).then(function (response) {
    var records = response.body.result.map(function (rr) {
      return DNSRecord.create(rr);
    });

    return this._paginateResponse(records, response.body.result_info);
  }.bind(this));
}

function read(did, z, options) {
  var CF = this.constructor;
  var zid;

  if (!zid && CF.Zone.is(z)) {
    zid = z.id;
  } else {
    zid = z;
  }

  var uri = join('zones', zid, 'dns_records', did);

  return this._got(uri, options).then(function (response) {
    return DNSRecord.create(response.body.result);
  });
}

function edit(rr, options) {
  options = options || {};

  var did = rr.id;
  var zid = rr.zoneId;

  var uri = join('zones', zid, 'dns_records', did);
  options.method = 'PUT';
  options.body = JSON.stringify(rr.toJSON({useAliases: true}));

  return this._got(uri, options).then(function (response) {
    return DNSRecord.create(response.body.result);
  });
}

function add(rr, options) {
  options = options || {};

  var zid = rr.zoneId;

  var uri = join('zones', zid, 'dns_records');
  var body = pick(rr.toJSON({useAliases: true}), ['type', 'name', 'content', 'ttl', 'proxied', 'data']);
  options.method = 'POST';
  options.body = JSON.stringify(body);

  return this._got(uri, options).then(function (response) {
    return DNSRecord.create(response.body.result);
  });
}

function remove(rr, options) {
  options = options || {};

  var did = rr.id;
  var zid = rr.zoneId;

  var uri = join('zones', zid, 'dns_records', did);
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
module.exports.DNSRecord = DNSRecord;
