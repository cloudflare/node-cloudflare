var https  = require('https');
var http   = require('http');
var url    = require('url');
var qs     = require('querystring');
var assert = require('assert');
var util   = require('./common');

var endpoint = 'https://www.cloudflare.com/api_json.html';


function validateType(type) {
    return (/^(A|CNAME|MX|TXT|SPF|AAAA|NS|SRV|LOC)$/).test(type);
}


/**
 * API client for the CloudFlare Client API
 *
 * @class CloudFlare
 * @constructor
 * @link  http://www.cloudflare.com/docs/client-api.html
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

Retrieve the current stats and settings for a particular website. This function
can be used to get currently settings of values such as the security level.

For these values, the latest data is from one day ago

 - 20 = Past 30 days
 - 30 = Past 7 days
 - 40 = Past day

The values are for Pro accounts

 - 100 = 24 hours ago
 - 110 = 12 hours ago
 - 120 = 6 hours ago

@method domainStats
@link   http://www.cloudflare.com/docs/client-api.html#s3.1
@param  {String}   domain    The zone (domain) that statistics are being retrieved from
@param  {String}   interval  The time interval for the statistics denoted by these values:
@param  {Function} fn
**/
cf.domainStats = function domainStats(domain, interval, fn) {
  this._request("stats", { z: domain, interval: interval }, function (err, res) {
    fn(err, res);
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
@param  {String}   zones  List of zones separated by comma
@param  {Array}    zones  List of zones
@param  {Function} fn
**/
cf.zoneCheck = function zoneCheck(zones, fn) {
  var options = {
    zones: util.isString(zones) ? zones : zones.join(',')
  };

  // The `zones` param should end with a `,` since the zone names included
  // in the response from CloudFlare will include a `\n` appended to the
  // last zone.  There is also a strange issue when requesting a single
  // zone will not actually pull the correct data.  So, make sure there are
  // at least two "zones" being requested.
  options.zones = options.zones + ",";

  this._request("zone_check", options, function (err, res) {
    if (err) {
      fn(err, res);
    } else if (res && res.hasOwnProperty("zones")) {
      // Remove the empty zone info that is added because of the trailing
      // `,` that we force on the `zones` request param.
      if ("\n" in res.zones) {
        delete res.zones["\n"];
      }

      fn(null, res.zones);
    } else {
      fn(err, res);
    }
  });
};
cf.zone_check = cf.zoneCheck;

/**
Pull recent IPs visiting site

Returns a list of IP address which hit your site classified by type.

@method zoneIps
@link   http://www.cloudflare.com/docs/client-api.html#s3.5
@param  {String}   domain              The target domain
@param  {Object}   options
@param  {String}   [options.hours=24]  Past number of hours to query. Default is 24, maximum is 48.
@param  {String}   [options.class]     Restrict the result set to a given class as given by:
    - "r" -- regular
    - "s" -- crawler
    - "t" -- threat
@param  {String}   [options.geo]    Optional. Set to 1 to add longitude and latitude information to response
@param  {Function} fn
**/
cf.zoneIps = function zoneIps(domain, options, fn) {
  var args = util.args(arguments),
      defaults = {
        hours: "24"
      };

  if (args.length === 2) {
    domain  = args[0];
    options = {};
    fn      = args[1];
  }

  this._request("zone_ips", util.mix(defaults, options, { z: domain }), function (err, res) {
    fn(err, res);
  });
};
cf.zone_ips = cf.zoneIps;

/**
Check threat score for a given IP

Find the current threat score for a given IP. Note that scores are on a
logarithmic scale, where a higher score indicates a higher threat.

@method checkIp
@link   http://www.cloudflare.com/docs/client-api.html#s3.6
@param  {String}   ip  The target IP
@param  {Function} fn
**/
cf.checkIp = function checkIp(ip, fn) {
  this._request("ip_lkup", { ip: ip }, function (err, res) {
    fn(err, res);
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
  this._request("zone_settings", { z: domain }, function (err, res) {
    fn(err, res);
  });
};
cf.zone_settings = cf.zoneSettings;

/**
Set the security level

This function sets the Basic Security Level to:

 - "help" -- I'm under attack!
 - "high" -- High
 - "med" -- Medium
 - "low" -- Low
 - "eoff" -- Essentially Off

@method secLvl
@link   http://www.cloudflare.com/docs/client-api.html#s4.1
@param  {String}   domain  The target domain
@param  {String}   level   The security level:
    * "help" -- I'm under attack!
    * "high" -- High
    * "med" -- Medium
    * "low" -- Low
    * "eoff" -- Essentially Off
@param  {Function} fn
**/
cf.secLvl = function secLvl(domain, level, fn) {
  this._request("sec_lvl", { z: domain, v: level }, function (err, res) {
    fn(err, res);
  });
};
cf.sec_lvl = cf.secLvl;

/**
Set the cache level

This function sets the Caching Level to Aggressive or Basic.

@method cacheLevel
@link   http://www.cloudflare.com/docs/client-api.html#s4.2
@param  {String}   domain  The target domain
@param  {String}   level   The cache level:
    * "agg" -- Aggressive
    * "basic" -- Basic
@param  {Function} fn
**/
cf.cacheLevel = function cacheLevel(domain, level, fn) {
  this._request("cache_lvl", { z: domain, v: level }, function (err, res) {
    fn(err, res);
  });
};
cf.cache_lvl = cf.cacheLevel;

/**
Toggling Development Mode

This function allows you to toggle Development Mode on or off for a particular
domain. When Development Mode is on the cache is bypassed. Development mode
remains on for 3 hours or until when it is toggled back off.

@method devmode
@link   http://www.cloudflare.com/docs/client-api.html#s4.3
@param  {String}   domain  The target domain
@param  {Boolean}  enable  True to enable, False to disable
@param  {Function} fn
**/
cf.devmode = function devmode(domain, enable, fn) {
  this._request("devmode", { z: domain, v: enable ? "1" : "0" }, function (err, res) {
    fn(err, res);
  });
};

/**
Clear CloudFlare's cache

This function will purge CloudFlare of any cached files. It may take up to 48
hours for the cache to rebuild and optimum performance to be achieved so this
function should be used sparingly.

@method clearCache
@link   http://www.cloudflare.com/docs/client-api.html#s4.4
@param  {String}   domain   The target domain
@param  {String}   [v="1"] Value can only be "1".  It is recommended to
    omit this argument to allow the default to be used.
@param  {Function} fn
**/
cf.clearCache = function clearCache(domain, v, fn) {
  var args = util.args(arguments);

  if (args.length === 2) {
    fn = args.pop();
    v  = "1";
  }

  assert.equal(v, "1", "The argument `v` can only be \"1\".");

  this._request("fpurge_ts", { z: domain, v: v }, function (err, res) {
    fn(err, res);
  });
};
cf.fpurge_ts = cf.clearCache;

/**
Purge a single file in CloudFlare's cache

This function will purge a single file from CloudFlare's cache.

@method zoneFilePurge
@link   http://www.cloudflare.com/docs/client-api.html#s4.5
@param  {String}   domain  The target domain
@param  {String}   url     The full URL of the file that needs to be purged from
    Cloudflare's cache. Keep in mind, that if an HTTP and an HTTPS version of the
    file exists, then both versions will need to be purged independently
@param  {Function} fn
**/
cf.zoneFilePurge = function zoneFilePurge(domain, url, fn) {
  this._request("zone_file_purge", { z: domain, url: url }, function (err, res) {
    fn(err, res);
  });
};
cf.zone_file_purge = cf.zoneFilePurge;

/**
Update the snapshot of site for CloudFlare's challenge page

Tells CloudFlare to take a new image of your site.

@method zoneGrab
@link   http://www.cloudflare.com/docs/client-api.html#s4.6
@param  {String}   zoneId  ID of zone, found in **zone_check**
@param  {Function} fn
**/
cf.zoneGrab = function zoneGrab(zoneId, fn) {
  this._request("zone_grab", { zid: zoneId }, function (err, res) {
    fn(err, res);
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
    fn(err, res);
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
    fn(err, res);
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
    fn(err, res);
  });
};
cf.nul = cf.unlistIp;

/**
Toggle IPv6 support

Toggles IPv6 support

@method ipv46
@link   http://www.cloudflare.com/docs/client-api.html#s4.8
@param  {String}   domain  The target domain
@param  {Boolean}  enable  Disable with false, enable with true
@param  {Function} fn
**/
cf.ipv46 = function ipv46(domain, enable, fn) {
  this._request("ipv46", { z: domain, v: enable ? "1" : "0" }, function (err, res) {
    fn(err, res);
  });
};
cf.ipv46 = cf.ipv46;

/**
Set Rocket Loader

Changes Rocket Loader setting

@method async
@link   http://www.cloudflare.com/docs/client-api.html#s4.9
@param  {String}   domain  The target domain
@param  {Boolean}  value   True will use the "automatic" async setting, False will disable
@param  {String}   value
    - 0 = off
    - a = automatic
    - m = manual
@param  {Function} fn
**/
cf.async = function async(domain, value, fn) {
  var options = { z: domain };

  if (value === true || value === 'a') {
    options.v = 'a';
  } else if (value === false || value == '0') {
    options.v = '0';
  } else if (value === 'm') {
    options.v = 'm';
  } else {
    throw new Error('Invalid option for the "value" argument.  Should be one of 0, a or m.  See docs for details.');
  }

  this._request("async", options, function (err, res) {
    fn(err, res);
  });
};
cf.async = cf.async;

/**
Set Minification

Changes minification settings

@method minify
@link   http://www.cloudflare.com/docs/client-api.html#s4.10
@param  {String}   domain  The target domain
@param  {Boolean}  setting  False will disable
@param  {String}   setting  Should be one of the following:
    - 0 = off
    - 1 = JavaScript only
    - 2 = CSS only
    - 3 = JavaScript and CSS
    - 4 = HTML only
    - 5 = JavaScript and HTML
    - 6 = CSS and HTML
    - 7 = CSS, JavaScript, and HTML
@param  {Function} fn
**/
cf.minify = function minify(domain, setting, fn) {
  var options = { z: domain };
  if (false === setting) {
    options.v = '0';
  } else if (setting.match(/^[0-7]$/)) {
    // add the "" to ensure the value is treated as a string
    options.v = "" + setting;
  } else {
    throw new Error('Invalid value for the "setting" argument.');
  }

  this._request("minify", options, function (err, res) {
    fn(err, res);
  });
};
cf.minify = cf.minify;

/**
Add a DNS record

Create a DNS record for a zone

@method addDomainRecord
@link   http://www.cloudflare.com/docs/client-api.html#s5.1
@param  {String}   domain             The target domain
@param  {Object}   options
@param  {String}   options.type       Type of DNS record. Values include:
  A, CNAME, MX, TXT, SPF, AAAA, NS, SRV and LOC
@param  {String}   options.name       Name of the DNS record.
@param  {String}   options.content    The content of the DNS record, will depend
    on the the type of record being added
@param  {String}   [options.ttl=1]    TTL of record in seconds. Value must be in
    between 120 and 4,294,967,295 seconds.  A value of 1 is the default "automatic"
@param  {String}   [options.prio]     [MX/SRV only] MX record priority.
@param  {String}   [options.service]  [SRV only] Service for SRV record
@param  {String}   [options.srvname]  [SRV only] Service Name for SRV record
@param  {String}   [options.protocol] [SRV only] Protocol for SRV record. Values include: [_tcp/_udp/_tls].
@param  {String}   [options.weight]   [SRV only] Weight for SRV record.
@param  {String}   [options.port]     [SRV only] Port for SRV record
@param  {String}   [options.target]   [SRV only] Target for SRV record
@param  {Function} fn
**/
cf.addDomainRecord = function addDomainRecord(domain, options, fn) {
  assert.equal(typeof options, 'object');
  assert.equal(typeof options.name, 'string');
  assert.equal(typeof options.content, 'string');
  assert.equal(typeof domain, 'string');

  var defaults = {
    type: "A",
    ttl:  "1"
  };

  this._request("rec_new", util.mix(defaults, options, { z: domain }), function (err, res) {
    if (err) {
      fn(err, res);
    } else {
      fn(null, res.rec.obj);
    }
  });
};
cf.rec_new = cf.addRecord = cf.addDomainRecord;

/**
Edit a DNS record

Edit a DNS record for a zone. The record will be updated to the data passed through arguments here.

@method editDomainRecord
@link   http://www.cloudflare.com/docs/client-api.html#s5.2
@param  {String}   domain             The target domain
@param  {String}   id                 DNS Record ID. Available by using the **rec_load_all** call.
@param  {Object}   options
@param  {String}   options.type       Type of DNS record. Values include:
  A, CNAME, MX, TXT, SPF, AAAA, NS, SRV and LOC
@param  {String}   options.name       Name of the DNS record.
@param  {String}   options.content    The content of the DNS record, will depend
    on the the type of record being added
@param  {String}   [options.ttl=1]    TTL of record in seconds. Value must be in
    between 120 and 4,294,967,295 seconds.  A value of 1 is the default "automatic"
@param  {String}   [options.prio]     [MX/SRV only] MX record priority.
@param  {String}   [options.service]  [SRV only] Service for SRV record
@param  {String}   [options.srvname]  [SRV only] Service Name for SRV record
@param  {String}   [options.protocol] [SRV only] Protocol for SRV record. Values include: [_tcp/_udp/_tls].
@param  {String}   [options.weight]   [SRV only] Weight for SRV record.
@param  {String}   [options.port]     [SRV only] Port for SRV record
@param  {String}   [options.target]   [SRV only] Target for SRV record
@param  {Function} fn
**/
cf.editDomainRecord = function editDomainRecord(domain, id, options, fn) {
  this._request("rec_edit", util.mix({}, options, { z: domain, id: id }), function (err, res) {
    fn(err, res);
  });
};
cf.rec_edit = cf.editDomainRecord;

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
  var options = {
    z: domain,
    id: id
  };

  this._request("rec_delete", options, function (err, res) {
    fn(err, res);
  });
};
cf.deleteRecord = cf.rec_delete = cf.deleteDomainRecord;


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

cf._response = function (req, res, fn) {
  var str = "",
      data;

  res.setEncoding('utf8');
  res.on('data', function (d) {
    str += d.toString();
  });

  res.on('end', function (chunk) {
    if (chunk) {
      str += chunk.toString();
    }

    try {
      data = JSON.parse(str);
    } catch (e) {
      return fn(new Error("Unable to parse response"), data, res);
    }

    if ("success" === data.result) {
      fn(null, data.response);
    } else {
      fn(new Error(data.msg), data);
    }
  });
};

cf.createPostData = function (action, params) {
  var postData = this.createRequestData(action, params);

  return qs.stringify(postData).toString('utf8');
};

cf._request = function (action, params, fn) {
  var uri    = url.parse(this.endpoint),
      client = uri.protocol === 'http:' ? http : https,
      data   = this.createPostData(action, params);

  uri.method = 'POST';

  uri.headers = {
    'content-length': data.length,
    'content-type':   'application/x-www-form-urlencoded; charset=utf-8'
  };

  var req = client.request(uri, function (res) {
    cf._response(req, res, fn);
  });

  req.write(data);
  req.end();

  req.on('error', function (e) {
    console.error(e);
  });
};

module.exports = {
  CloudFlare: CloudFlare,

  createClient: function (options) {
    if (arguments.length === 2) {
      var args = Array.prototype.slice.call(arguments);

      options = {
        token: args[0],
        email: args[1]
      };
    }

    assert.equal(typeof(options), 'object');
    assert.equal(typeof(options.token), 'string');
    assert.equal(typeof(options.email), 'string');

    return new CloudFlare(options.token, options.email);
  }
};
