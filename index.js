var https  = require('https');
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


function CloudFlare(token, email) {
    this.token = token;
    this.email = email;
}

CloudFlare.ACTIONS = {
    "listDomains":    "zone_load_multi"
};

var proto = CloudFlare.prototype;

proto.listDomains = function (fn) {
    this._request("zone_load_multi", { act: "zone_load_multi" }, function (err, res) {
        fn(err, res);
    });
};

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
        console.log(res);

        fn(err, res);
    });
};

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
    var uri = url.parse(endpoint);

    uri.method = 'POST';

    var postData = this.createRequestData(action, params);
    postData = qs.stringify(postData).toString('utf8');

    uri.headers = {
        'content-length': postData.length,
        'content-type':   'application/x-www-form-urlencoded; charset=utf-8'
    };

    var req = https.request(uri, function (res) {
        var data = "";

        res.on('data', function (d) {
            data += d.toString('utf8');
        });

        res.on('end', function () {
            try {
                data = JSON.parse(data);

                if ("success" === data.result) {
                    fn(null, data.response);
                } else {
                    fn(new Error(data.msg), data.response);
                }
            } catch (e) {
                fn(new Error("Unable to parse response"), data, res);
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
