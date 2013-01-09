var https  = require('https');
var http   = require('http');
var url    = require('url');
var qs     = require('querystring');
var assert = require('assert');

var endpoint = 'https://www.cloudflare.com/api_json.html';


///--- Internal Helpers

function _clone(object) {
    var keys, prop, clone = {};

    assert.ok(object);

    keys = Object.getOwnPropertyNames(object);
    keys.forEach(function (k) {
        prop = Object.getOwnPropertyDescriptor(object, k);

        Object.defineProperty(clone, k, prop);
    });

    return clone;
}

function mixin(target) {
  Array.prototype.slice.call(arguments, 1).forEach(function (o) {
    Object.getOwnPropertyNames(o).forEach(function(attr) {
      var getter = Object.getOwnPropertyDescriptor(o, attr).get,
          setter = Object.getOwnPropertyDescriptor(o, attr).set;

      if (!getter && !setter) {
        target[attr] = o[attr];
      }
      else {
        Object.defineProperty(target, attr, {
          get: getter,
          set: setter
        });
      }
    });
  });

  return target;
}


function validateType(type) {
    return (/^(A|CNAME|MX|TXT|SPF|AAAA|NS|SRV|LOC)$/).test(type);
}


/**
 * API client for the CloudFlare Client API
 *
 * @constructor
 * @link  http://www.cloudflare.com/docs/client-api.html
 * @class CloudFlare
 * @param {String} token API token from the (My Account)[https://www.cloudflare.com/my-account] page
 * @param {String} email Email address associated with your CloudFlare account
 */
function CloudFlare(token, email) {
    this.token    = token;
    this.email    = email;
    this.endpoint = endpoint;
}

var cf = CloudFlare.prototype;

/**
Retrieve domain statistics for a given time frame

Retrieve the current stats and settings for a particular website. This function can be used to get currently settings of values such as the security level.

@method domainStats
@link   http://www.cloudflare.com/docs/client-api.html#s3.1
@param  {String}   domain            The zone (domain) that statistics are being retrieved from
@param  {Object}   options
@param  {String}   options.interval  The time interval for the statistics denoted by these values:
@param  {Function} fn
**/
cf.domainStats = function domainStats(domain, options, fn) {
  this._request("stats", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.stats = cf.domainStats;

/**
Retrieve the list of domains

This lists all domains in a CloudFlare account along with other data.

@method listDomains
@link   http://www.cloudflare.com/docs/client-api.html#s3.2
@param  {Function} fn
**/
cf.listDomains = function listDomains(fn) {
  this._request("zone_load_multi", { act: "zone_load_multi" }, function (err, res) {
    if (err) {
      fn(err, res);
    } else {
      var records = res.zones,
          result  = records.objs;

      result.hasMore = function () {
        return records.has_more;
      };
      result.getCount = function () {
        return records.count;
      };

      fn(null, result);
    }
  });
};
cf.zone_load_multi = cf.listDomains;

/**
Retrieve DNS Records of a given domain

Lists all of the DNS records from a particular domain in a CloudFlare account

@method listDomainRecords
@link   http://www.cloudflare.com/docs/client-api.html#s3.3
@param  {String}   domain  The domain that records are being retrieved from
@param  {Function} fn
**/
cf.listDomainRecords = function listDomainRecords(domain, fn) {
  assert.equal(typeof domain, 'string');

  this._request("rec_load_all", { z: domain }, function (err, res) {
    if (err) {
      fn(err);
    } else {
      var records = res.recs,
        result  = records.objs;

      result.hasMore = function () {
        return records.has_more;
      };
      result.getCount = function () {
        return records.count;
      };

      fn(null, result);
    }
  });
};
cf.rec_load_all = cf.listDomainRecords;

/**
Checks for active zones and returns their corresponding zids

@method zoneCheck
@link   http://www.cloudflare.com/docs/client-api.html#s3.4
@param  {Object}   options
@param  {String}   options.zones  List of zones separated by comma
@param  {Function} fn
**/
cf.zoneCheck = function zoneCheck(options, fn) {
  this._request("zone_check", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.zone_check = cf.zoneCheck;

/**
Pull recent IPs visiting site

Returns a list of IP address which hit your site classified by type.

@method zoneIps
@link   http://www.cloudflare.com/docs/client-api.html#s3.5
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.hours   Past number of hours to query. Default is 24, maximum is 48.
@param  {String}   options.class   Optional. Restrict the result set to a given class as given by:
@param  {String}   options.geo     Optional. Set to 1 to add longitude and latitude information to response
@param  {Function} fn
**/
cf.zoneIps = function zoneIps(domain, options, fn) {
  this._request("zone_ips", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.zone_ips = cf.zoneIps;

/**
Check threat score for a given IP

Find the current threat score for a given IP. Note that scores are on a logarithmic scale, where a higher score indicates a higher threat.

@method checkIp
@link   http://www.cloudflare.com/docs/client-api.html#s3.6
@param  {Object}   options
@param  {String}   options.ip  The target IP
@param  {Function} fn
**/
cf.checkIp = function checkIp(options, fn) {
  this._request("ip_lkup", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.ip_lkup = cf.checkIp;

/**
List all current setting values

Retrieves all current settings for a given domain.

@method zoneSettings
@link   http://www.cloudflare.com/docs/client-api.html#s3.7
@param  {String}   domain  The target domain
@param  {Function} fn
**/
cf.zoneSettings = function zoneSettings(domain, fn) {
  this._request("zone_settings", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.zone_settings = cf.zoneSettings;

/**
Set the security level

This function sets the Basic Security Level to I'M UNDER ATTACK! / HIGH / MEDIUM / LOW / ESSENTIALLY OFF.

@method secLvl
@link   http://www.cloudflare.com/docs/client-api.html#s4.1
@param  {Function} fn
**/
cf.secLvl = function secLvl(fn) {
  this._request("sec_lvl", options, function (err, res) {
    // remaining processing goes here
  });
};
cf.sec_lvl = cf.secLvl;

/**
Set the cache level

This function sets the Caching Level to Aggressive or Basic.

@method cacheLvl
@link   http://www.cloudflare.com/docs/client-api.html#s4.2
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v       The cache level:
@param  {Function} fn
**/
cf.cacheLvl = function cacheLvl(domain, options, fn) {
  this._request("cache_lvl", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.cache_lvl = cf.cacheLvl;

/**
Toggling Development Mode

This function allows you to toggle Development Mode on or off for a particular domain. When Development Mode is on the cache is bypassed. Development mode remains on for 3 hours or until when it is toggled back off.

@method devmode
@link   http://www.cloudflare.com/docs/client-api.html#s4.3
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v       1 for on, 0 for off
@param  {Function} fn
**/
cf.devmode = function devmode(domain, options, fn) {
  this._request("devmode", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.devmode = cf.devmode;

/**
Clear CloudFlare's cache

This function will purge CloudFlare of any cached files. It may take up to 48 hours for the cache to rebuild and optimum performance to be achieved so this function should be used sparingly.

@method fpurgeTs
@link   http://www.cloudflare.com/docs/client-api.html#s4.4
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v       Value can only be "1."c
@param  {Function} fn
**/
cf.fpurgeTs = function fpurgeTs(domain, options, fn) {
  this._request("fpurge_ts", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.fpurge_ts = cf.fpurgeTs;

/**
Purge a single file in CloudFlare's cache

This function will purge a single file from CloudFlare's cache.

@method zoneFilePurge
@link   http://www.cloudflare.com/docs/client-api.html#s4.5
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.url     The full URL of the file that needs to be purged from Cloudflare's cache. Keep in mind, that if an HTTP and an HTTPS version of the file exists, then both versions will need to be purged independently
@param  {Function} fn
**/
cf.zoneFilePurge = function zoneFilePurge(domain, options, fn) {
  this._request("zone_file_purge", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.zone_file_purge = cf.zoneFilePurge;

/**
Update the snapshot of site for CloudFlare's challenge page

Tells CloudFlare to take a new image of your site.

@method zoneGrab
@link   http://www.cloudflare.com/docs/client-api.html#s4.6
@param  {Object}   options
@param  {String}   options.zid  ID of zone, found in **zone_check**
@param  {Function} fn
**/
cf.zoneGrab = function zoneGrab(options, fn) {
  this._request("zone_grab", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.zone_grab = cf.zoneGrab;

/**
Whitelist IPs

Whitelist an IP address

@method whitelistIp
@link   http://www.cloudflare.com/docs/client-api.html#s4.7
@param  {String}   ip  The IP address you want to whitelist/blacklist
@param  {Function} fn
**/
cf.whitelistIp = function whitelistIp(ip, fn) {
  this._request("wl", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.wl = cf.whitelistIp;

/**
Blacklist IPs

Blacklist an IP address

@method banIp
@link   http://www.cloudflare.com/docs/client-api.html#s4.7
@param  {String}   ip  The IP address you want to whitelist/blacklist
@param  {Function} fn
**/
cf.banIp = function banIp(ip, fn) {
  this._request("ban", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.ban = cf.banIp;

/**
Unlist IPs

Remove an IP from both the whitelist and ban list

@method unlistIp
@link   http://www.cloudflare.com/docs/client-api.html#s4.7
@param  {String}   ip  The IP address you want to unlist
@param  {Function} fn
**/
cf.unlistIp = function unlistIp(ip, fn) {
  this._request("nul", {}, function (err, res) {
    // remaining processing goes here
  });
};
cf.nul = cf.unlistIp;

/**
Toggle IPv6 support

Toggles IPv6 support

@method ipv46
@link   http://www.cloudflare.com/docs/client-api.html#s4.8
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v       Disable with 0, enable with 1
@param  {Function} fn
**/
cf.ipv46 = function ipv46(domain, options, fn) {
  this._request("ipv46", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.ipv46 = cf.ipv46;

/**
Set Rocket Loader

Changes Rocket Loader setting

@method async
@link   http://www.cloudflare.com/docs/client-api.html#s4.9
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v       [0 = off, a = automatic, m = manual]
@param  {Function} fn
**/
cf.async = function async(domain, options, fn) {
  this._request("async", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.async = cf.async;

/**
Set Minification

Changes minification settings

@method minify
@link   http://www.cloudflare.com/docs/client-api.html#s4.10
@param  {String}   domain          The target domain
@param  {Object}   options
@param  {String}   options.v
@param  {Function} fn
**/
cf.minify = function minify(domain, options, fn) {
  this._request("minify", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.minify = cf.minify;

/**
Add a DNS record

Create a DNS record for a zone

@method addDomainRecord
@link   http://www.cloudflare.com/docs/client-api.html#s5.1
@param  {String}   domain            The target domain
@param  {Object}   options
@param  {String}   options.type      Type of DNS record. Values include: [A/CNAME/MX/TXT/SPF/AAAA/NS/SRV/LOC]
@param  {String}   options.name      Name of the DNS record.
@param  {String}   options.content   The content of the DNS record, will depend on the the type of record being added
@param  {String}   options.ttl       TTL of record in seconds. 1 = Automatic, otherwise, value must in between 120 and 4,294,967,295 seconds.
@param  {String}   options.prio      [applies to MX/SRV]
    MX record priority.
@param  {String}   options.service   [applies to SRV]
    Service for SRV record
@param  {String}   options.srvname   [applies to SRV]
    Service Name for SRV record
@param  {String}   options.protocol  [applies to SRV]
    Protocol for SRV record. Values include: [_tcp/_udp/_tls].
@param  {String}   options.weight    [applies to SRV]
    Weight for SRV record.
@param  {String}   options.port      [applies to SRV]
    Port for SRV record
@param  {String}   options.target    [applies to SRV]
    Target for SRV record
@param  {Function} fn
**/
cf.addDomainRecord = function addDomainRecord(domain, options, fn) {
  assert.equal(typeof options, 'object');
  assert.equal(typeof options.name, 'string');
  assert.equal(typeof options.content, 'string');
  assert.equal(typeof domain, 'string');

  var defaults = {
    type: "A",
    ttl:  "240"
  };

  this._request("rec_new", mixin(defaults, options, { z: domain }), function (err, res) {
    fn(err, res.rec.obj);
  });
};
cf.rec_new = cf.addDomainRecord;

/**
Edit a DNS record

Edit a DNS record for a zone. The record will be updated to the data passed through arguments here.

@method recEdit
@link   http://www.cloudflare.com/docs/client-api.html#s5.2
@param  {String}   domain                The target domain
@param  {Object}   options
@param  {String}   options.id            DNS Record ID. Available by using the **rec_load_all** call.
@param  {String}   options.type          Type of DNS record. Values include: [A/CNAME/MX/TXT/SPF/AAAA/NS/SRV/LOC]
@param  {String}   options.name          Name of the DNS record.
@param  {String}   options.content       The content of the DNS record, will depend on the the type of record being added
@param  {String}   options.ttl           TTL of record in seconds. 1 = Automatic, otherwise, value must in between 120 and 4,294,967,295 seconds.
@param  {String}   options.service_mode  [applies to A/AAAA/CNAME]
    Status of CloudFlare Proxy, 1 = orange cloud, 0 = grey cloud.
@param  {String}   options.prio          [applies to MX/SRV]
    MX record priority.
@param  {String}   options.service       [applies to SRV]
    Service for SRV record
@param  {String}   options.srvname       [applies to SRV]
    Service Name for SRV record
@param  {String}   options.protocol      [applies to SRV]
    Protocol for SRV record. Values include: [_tcp/_udp/_tls].
@param  {String}   options.weight        [applies to SRV]
    Weight for SRV record.
@param  {String}   options.port          [applies to SRV]
    Port for SRV record
@param  {String}   options.target        [applies SRV]
    Target for SRV record
@param  {Function} fn
**/
cf.recEdit = function recEdit(domain, options, fn) {
  this._request("rec_edit", mix({}, options, { z: domain }), function (err, res) {
    // remaining processing goes here
  });
};
cf.rec_edit = cf.recEdit;

/**
Edit a DNS record

Delete a record for a domain.

@method deleteDomainRecord
@link   http://www.cloudflare.com/docs/client-api.html#s5.3
@param  {String}   domain  The target domain
@param  {String}   id      DNS Record ID. Available by using the **rec_load_all** call.
@param  {Function} fn
**/
cf.deleteDomainRecord = function deleteDomainRecord(domain, id, fn) {
  var opts = {
    z: domain,
    id: id
  };

  this._request("rec_delete", mix({}, options, { z: domain }), function (err, res) {
    fn(err, res);
  });
};
cf.rec_delete = cf.deleteDomainRecord;


/**
 * Creates the request data for the provided action
 *
 * @protected
 * @method createRequestData
 * @param  {String}  action
 * @param  {Object}  params
 * @return {Object}
 */
cf.createRequestData = function (action, params) {
    var data =  {
        tkn:   this.token,
        email: this.email,
        a:     action
    };

    if (typeof params === 'object') {
        Object.keys(params).forEach(function (key) {
            data[key] = params[key];
        });
    }

    return data;
};


cf._request = function (action, params, fn) {
    var uri    = url.parse(this.endpoint),
        client = uri.protocol === 'http:' ? http : https;

    uri.method = 'POST';

    var postData = this.createRequestData(action, params);
    postData = qs.stringify(postData).toString('utf8');

    uri.headers = {
        'content-length': postData.length,
        'content-type':   'application/x-www-form-urlencoded; charset=utf-8'
    };

    var req = client.request(uri, function (res) {
        var str = "", data;

        res.on('data', function (d) {
            str += d.toString('utf8');
        });

        res.on('end', function () {
            try {
                data = JSON.parse(str);
            } catch (e) {
                return fn("Unable to parse response", data, res);
            }

            if ("success" === data.result) {
                fn(null, data.response);
            } else {
                fn(data.msg, data.response);
            }
        });
    });

    req.write(postData + '\n');
    req.end();

    req.on('error', function (e) {
        console.error(e);
    });
};

module.exports = {
    CloudFlare: CloudFlare,

    createClient: function (options) {
        assert.equal(typeof options, 'object');
        assert.equal(typeof options.token, 'string');
        assert.equal(typeof options.email, 'string');

        return new CloudFlare(options.token, options.email);
    }
};
