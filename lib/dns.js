'use strict';
var join = require('url-join');

function DNSRecord(rr) {
  this.id = rr.id;
  this.type = rr.type;
  this.name = rr.name;
  this.content = rr.content;
  this.proxiable = rr.proxiable;
  this.proxied = rr.proxied;
  this.ttl = rr.ttl;
  this.locked = rr.locked;
  this.zoneId = rr.zone_id;
  this.zoneName = rr.zone_name;
  this.createdOn = new Date(rr.created_on);
  this.modifiedOn = new Date(rr.modified_on);
  this.data = rr.data;
}

DNSRecord.prototype.toJSON = function () {
  /* eslint-disable camelcase */
  return {
    id: this.id,
    type: this.type,
    name: this.name,
    content: this.content,
    proxiable: this.proxiable,
    proxied: this.proxied,
    ttl: this.ttl,
    locked: this.locked,
    zone_id: this.zoneId,
    zone_name: this.zoneName,
    created_on: this.createdOn,
    modified_on: this.modifiedOn,
    data: this.data
  };
};

function browse(z, query, options) {
  options = options || {};
  options.query = query;

  var CF = this.constructor;
  var zid = z instanceof CF.Zone ? z.id : z;
  var uri = join('zones', zid, 'dns_records');

  return this._got(uri, options).then(function (response) {
    var records = response.body.result.map(function (rr) {
      return new DNSRecord(rr);
    });

    return this._paginateResponse(records, response.body.result_info);
  }.bind(this));
}

function read(did, z, options) {
  var CF = this.constructor;
  var zid;

  if (!zid && z instanceof CF.Zone) {
    zid = z.id;
  } else {
    zid = z;
  }

  var uri = join('zones', zid, 'dns_records', did);

  return this._got(uri, options).then(function (response) {
    return new DNSRecord(response.body.result);
  });
}

function edit(rr, options) {
  options = options || {};

  var did = rr.id;
  var zid = rr.zoneId;

  var uri = join('zones', zid, 'dns_records', did);
  options.method = 'PUT';
  options.body = JSON.stringify(rr);

  return this._got(uri, options).then(function (response) {
    return new DNSRecord(response.body.result);
  });
}

function add(rr, options) {
  options = options || {};

  var zid = rr.zoneId;

  var uri = join('zones', zid, 'dns_records');
  options.method = 'POST';
  options.body = JSON.stringify(rr);

  return this._got(uri, options).then(function (response) {
    return new DNSRecord(response.body.result);
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
