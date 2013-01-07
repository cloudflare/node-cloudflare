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

var proto = CloudFlare.prototype;

/**
 * List all the domains for this account
 *
 * @method listDomains
 * @param  {Function} fn
 */
proto.listDomains = function (fn) {
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

/**
 * List all records for the specified domain
 *
 * @method listDomainRecords
 * @param  {String}   domain
 * @param  {Function} fn
 */
proto.listDomainRecords = function (domain, fn) {
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

/**
 * Add a new record to a domain
 *
 * @method addRecord
 * @param  {String}   domain
 * @param  {Object}   options
 * @param  {Function} fn
 */
proto.addRecord = function (domain, options, fn) {
    assert.equal(typeof options, 'object');
    assert.equal(typeof options.name, 'string');
    assert.equal(typeof options.content, 'string');
    assert.equal(typeof domain, 'string');

    var opts = {
        z:       domain,
        name:    options.name,
        content: options.content,
        type:    options.type || "A",
        ttl:     options.ttl || "240"
    };

    this._request("rec_new", opts, function (err, res) {
        fn(err, res.rec.obj);
    });
};

/**
 * Deletes a specific record from a domain
 *
 * @method deleteDomainRecord
 * @param  {String}   domain
 * @param  {String}   id
 * @param  {Function} fn
 */
proto.deleteDomainRecord = function (domain, id, fn) {
    var opts = {
        z: domain,
        id: id
    };

    this._request("rec_delete", opts, function (err, res) {
        fn(err, res);
    });
};

/**
 * Creates the request data for the provided action
 *
 * @protected
 * @method createRequestData
 * @param  {String}  action
 * @param  {Object}  params
 * @return {Object}
 */
proto.createRequestData = function (action, params) {
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


proto._request = function (action, params, fn) {
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
