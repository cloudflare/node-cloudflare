# Cloudflare Node.js bindings

[![Stability Stable][badge-stability]][badge-stability-url]
[![NPM version][badge-npm]][badge-npm-url]
[![Travis CI][badge-travis]][badge-travis-url]
[![Coveralls][badge-coveralls]][badge-coveralls-url]
[![NPM downloads][badge-npm-downloads]][badge-npm-downloads]
[![Libraries.io Dependencies][badge-libraries]][badge-libraries-url]

[Cloudflare v4 API][cf-api] bindings for Node.js, providing a sourdough
"BREAD" (Browse, Read, Edit, Add, and Delete) interface.

[cf-api]: https://api.cloudflare.com/
[badge-stability]: https://img.shields.io/badge/stability-stable-green.svg?style=flat-square
[badge-stability-url]: https://github.com/dominictarr/stability/blob/4d649a5b3af8444720929a50254dfbb071ce27e7/levels.json#L8-L9
[badge-npm]: https://img.shields.io/npm/v/cloudflare.svg?style=flat-square
[badge-npm-downloads]: https://img.shields.io/npm/dm/cloudflare.svg?style=flat-square
[badge-npm-url]: https://www.npmjs.com/package/cloudflare
[badge-travis]: https://img.shields.io/travis/cloudflare/node-cloudflare/master.svg?style=flat-square
[badge-travis-url]: https://travis-ci.org/cloudflare/node-cloudflare
[badge-coveralls]: https://img.shields.io/coveralls/github/cloudflare/node-cloudflare/master.svg?style=flat-square
[badge-coveralls-url]: https://coveralls.io/github/cloudflare/node-cloudflare
[badge-libraries]: https://img.shields.io/librariesio/github/cloudflare/node-cloudflare.svg?style=flat-square
[badge-libraries-url]: https://libraries.io/npm/cloudflare

With these bindings, you'll get the following features:

* A Promise-based API. With modern versions of Node.js, this can be
  leveraged for async/await and generator support.
* Automatic handling of Gzip/Deflate compression.

Node.js v4 and greater are supported.

## Configuration

Set your account email address and API key.  The API key can be found on
the [My Account][my-account] page in the Cloudflare dashboard.

[my-account]: https://www.cloudflare.com/a/account

```javascript
var cf = require('cloudflare')({
  email: 'you@example.com',
  key: 'your Cloudflare API key'
});
```

## API Overview

Every resource is accessed via your `cf` instance:

```javascript
// cf.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method returns a promise, which can be chained or used
with async/await.

```javascript
cf.zones.read('023e105f4ecef8ad9ca31a8372d0c353').then(function (resp) {
  return resp.result.status;
});


// where supported
async function getZoneStatus(id) {
  var resp = await cf.zones.read('023e105f4ecef8ad9ca31a8372d0c353');
  return resp.result.status;
}
```

### Documentation

* [Generated JSDoc](https://cloudflare.github.io/node-cloudflare)
