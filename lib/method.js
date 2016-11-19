'use strict';
var URLPattern = require('url-pattern');

var options = [
  'key',
  'email'
];

function isPlainObject(x) {
  var prototype = Object.getPrototypeOf(x);
  var toString = Object.prototype.toString;

  return toString.call(x) === '[object Object]' &&
    (prototype === null || prototype === Object.getPrototypeOf({}));
}

function getDataFromArgs(args) {
  if (args.length > 0) {
    if (isPlainObject(args[0]) && !isOptionsHash(args[0])) {
      return args.shift();
    }
  }
  return {};
}

function isOptionsHash(obj) {
  function hasProp(acc, option) {
    if (acc) {
      return acc;
    }

    return Object.prototype.hasOwnProperty.call(obj, option);
  }

  return isPlainObject(obj) && options.reduce(hasProp, false);
}

function getOptionsFromArgs(args) {
  var opts = {
    auth: {},
    headers: {}
  };

  if (args.length > 0) {
    var arg = args[args.length - 1];

    if (isOptionsHash(arg)) {
      var params = args.pop();

      if (params.key) {
        opts.auth.key = params.key;
      }

      if (params.email) {
        opts.auth.email = params.email;
      }
    }
  }

  return opts;
}

function identity(x) {
  return x;
}

module.exports = function (spec) {
  var requestMethod = (spec.method || 'GET').toUpperCase();
  var encode = spec.encode || identity;

  return function () {
    var fullPath = this.createFullPath(spec.path);
    var urlPattern = new URLPattern(fullPath);
    var urlParams = urlPattern.names;
    var err;
    var args = Array.prototype.slice.call(arguments);
    var urlData = {};

    for (var i = 0, l = urlParams.length; i < l; i++) {
      var arg = args[0];

      var param = urlParams[i];

      if (!arg) {
        err = new Error(
          'Cloudflare: Argument "' + urlParams[i] + '" required, but got: ' + arg +
          ' (on API request to ' + requestMethod + ' ' + fullPath + ')'
        );
        return Promise.reject(err);
      }

      urlData[param] = args.shift();
    }

    var data = encode(getDataFromArgs(args));
    var opts = getOptionsFromArgs(args);

    if (args.length !== 0) {
      err = new Error(
        'Cloudflare: Unknown arguments (' + args + '). Did you mean to pass an options object?' +
        ' (on API request to ' + requestMethod + ' ' + fullPath + ')'
      );
      return Promise.reject(err);
    }

    var requestPath = urlPattern.stringify(urlData);

    if (requestMethod !== 'PATCH' || !this.hasBrokenPatch) {
      return this._client.request(requestMethod, requestPath, data, opts);
    }

    var patched = Object.keys(data);

    function sendPatch() {
      var patch = patched.pop();
      var d = {};
      d[patch] = data[patch];

      // noinspection JSPotentiallyInvalidUsageOfThis
      return this._client.request(requestMethod, requestPath, d, opts).then(function (response) {
        if (patched.length > 0) {
          return sendPatch.call(this);
        }

        return response;
      }.bind(this));
    }

    return sendPatch.call(this);
  };
};
