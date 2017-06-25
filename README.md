# Cloudflare Node.js bindings

[Cloudflare v4 API][cf-api] bindings for Node.js, providing a sourdough
"BREAD" (Browse, Read, Edit, Add, and Delete) interface.

[cf-api]: https://api.cloudflare.com/

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

### Available resources and methods

* dnsRecords
    * `browse()`
    * `read(dnsRecordId)`
    * `edit(dnsRecordId, params)`
    * `add(params)`
    * `del(dnsRecordId)`
* ips
    * `browse()`
* zones
    * `browse()`
    * `read(zoneId)`
    * `edit(zoneId, params)`
    * `add(params)`
    * `del(zoneId)`
    * `activationCheck(zoneId)`
    * `purgeCache(zoneId, params)`
* user
    * `read()`
    * `edit(params)`