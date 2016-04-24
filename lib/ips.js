'use strict';
var verymodel = require('verymodel');

var IPRanges = new verymodel.Model({
  IPv4CIDRs: {type: 'array', static: true, alias: 'ipv4_cidrs'},
  IPv6CIDRs: {type: 'array', static: true, alias: 'ipv6_cidrs'}
});

IPRanges.is = function (o) {
  if (o && o.__verymeta && o.__verymeta.model) {
    return o.__verymeta.model === this;
  }

  return false;
};

function read(options) {
  return this._got('ips', options).then(function (response) {
    return IPRanges.create(response.body.result);
  });
}

module.exports.read = read;
module.exports.IPRanges = IPRanges;
