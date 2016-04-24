'use strict';

function IPRanges(v4, v6) {
  this.IPv4CIDRs = v4;
  this.IPv6CIDRs = v6;
}

function read(options) {
  return this._got('ips', options).then(function (response) {
    var result = response.body.result;
    return new IPRanges(result.ipv4_cidrs, result.ipv6_cidrs);
  });
}

module.exports.read = read;
module.exports.IPRanges = IPRanges;
