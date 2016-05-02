# CloudFlare API Client for Node.js

> Note: This CloudFlare client is not yet production ready.  It is still in the
> very early stages of development

An edible "BREAD" (Browse, Read, Edit, Add, and Delete) API Client for the
CloudFlare v4 Client API.

With this API client, you'll get the following features:

* Promise-based API, allowing for easy async/await usage in harmony JavaScript
  engines, and with JavaScript transpilers.
* Effortlessly connects over HTTP/2 (Node.js 0.12 and greater)
* Automatic handling of Gzip/Deflate compression.
* Expontential backoff and retry in the presence of error.

## Usage

### Creating a Client

```javascript
var CFClient = require('cloudflare');
var client = new CFClient({
    email: 'you@example.com',
    key: 'deadbeef'
});
```

### Zones

#### `Zone`

* *API Reference*: [Zone properties](https://api.cloudflare.com/#zone-properties)

A normalized representation of a CloudFlare Zone. Properties that were
`snake_cased` have been changed to be `camelCased`.

#### `browseZones([query, [options]): Promise<PaginatedResponse<Zone[]>>`

* query: An object to pass filter and sorting parameters to the API
* options: *see Request Options*
* *Returns*: A Promise that resolves to a list of `Zone` objects wrapped in a `PaginatedResponse`
* *API Reference*: [List zones](https://api.cloudflare.com/#zone-list-zones)

Retrives the list of `Zone` objects, optionally filtered and sorted by `query` options.

#### `readZone(z_id, [options]): Promise<Zone>`

* z_id: The string Zone id
* options: *see Request Options*
* *Returns*: A Promise that resolves to a `Zone`
* *API Reference*: [Zone details](https://api.cloudflare.com/#zone-zone-details)

Retrives the `Zone` for the zone identifier `z_id`.

#### `deleteZone(z, [options]): Promise<{id: string}>`

* z: `Zone` object or string zone id
* options: *see Request Options*
* *Returns*: A Promise that resolves to a tombstone stub
* *API Reference*: [Delete a zone](https://api.cloudflare.com/#zone-delete-a-zone)

Deletes the `Zone` from CloudFlare. A tombstone stub is returned.

#### `deleteCache(z, query, [options]): Promise<bool>`

* z: `Zone` object or string zone id
* query: The (required) purge options for the API:
  * `purge_everything`: Delete all of the zone's content from the CloudFlare
    cache. **Note**: This may cause an increase in connections to your server
    after performing this action.
  * `files`: An array of URLs that should be removed from cache.
  * `tags`: Removes assets from cache that were served with a Cache-Tag header
    that matches a string in this array.
* options: *see Request Options*
* *Returns*: A Promise that resolves to `true`.
* *API Reference*:
  [Purge all files](https://api.cloudflare.com/#zone-purge-all-files) and
  [Purge individual files by URL and Cache-Tags](https://api.cloudflare.com/#zone-purge-individual-files-by-url-and-cache-tags)

Purges content from CloudFlare's cache. Please note that `query` is required for
this API call.

### DNS

The CloudFlare API client makes it easy to manage DNS records for domains on CloudFlare.

#### `DNSRecord`

* *API Reference*: [DNS Records for a Zone](https://api.cloudflare.com/#dns-records-for-a-zone-properties)

A normalized representation of a CloudFlare DNS Record type. Properties that
were `snake_cased` have been changed to be `camelCased`.

#### `browseDNS(z, [query, [options]]): Promise<PaginatedResponse<DNSRecord[]>>`

* z: `Zone` object or string zone id
* query: An object to pass filter and sorting parameters to the API
* options: *see Request Options*
* *Returns*: A Promise that resolves to a list of `DNSRecord` objects wrapped in a `PaginatedResponse`
* *API Reference*: [List DNS Records](https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records)

Retrives the listing of `DNSRecord` objects for a `Zone` (or zone id).

#### `readDNS(dns_id, z, [options]): Promise<DNSRecord>`

* dns_id: The string DNS record id
* z: `Zone` object or string zone id
* options: *see Request Options*
* *Returns*: A Promise that resolves to a `DNSRecord`
* *API Reference*: [DNS record details](https://api.cloudflare.com/#dns-records-for-a-zone-dns-record-details)

Retrive the `DNSRecord` for a identifier `did` from `Zone` (or zone id).

#### `editDNS(d, [options]): Promise<DNSRecord>`

* d: The `DNSRecord` to be saved
* options: *see Request Options*
* *Returns*: A Promise that resolves to a new `DNSRecord`
* *API Reference*: [Update DNS record](https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record)

Save the modifications to the `DNSRecord`.

#### `addDNS(d, [options]): Promise<DNSRecord>`

* d: The `DNSRecord` to be added
* options: *see Request Options*
* *Returns*: A Promise that resolves to a new `DNSRecord`
* *API Reference*: [Create DNS record](https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record)

Create a DNS Record corresponding to the provided `DNSRecord`. A new `DNSRecord`
with an id field is returned.

#### `deleteDNS(d, [options]): Promise<{id: string}>`

* d: The `DNSRecord` to be deleted
* options: *see Request Options*
* *Returns*: A Promise that resolves to a tombstone stub
* *API Reference*: [Delete DNS record](https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record)

Deletes the `DNSRecord` from the DNS. A tombstone stub is returned.

### CloudFlare IPs

#### `IPRanges`

* *API Reference*: [CloudFlare IPs properties](https://api.cloudflare.com/#cloudflare-ips-properties)

Normalized representation of the CloudFlare IP Ranges.

```
IPRanges{
    IPv4CIDRs: [
        '199.27.128.0/21'
    ],
    IPv6CIDRs: [
        '2400:cb00::/32'
    ]
}
```

#### `readIPs(): Promise<IPRanges>`

* *Returns*: A Promise that resolves to `IPRanges`
* *API Reference*: [CloudFlare IPs](https://api.cloudflare.com/#cloudflare-ips)

Retrieves the CloudFlare Edge IP addresses. These are the IP addresses used by
CloudFlare to connect to your server.
