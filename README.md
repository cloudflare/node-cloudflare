# CloudFlare Node.js client

> Note: This CloudFlare client is not yet production ready.  It is still in the
> very early stages of development

## Using the client

```js
var cloudflare = require('cloudflare').createClient({
    email: 'you@email.com',
    token: 'somethingFromCloudFlare'
});
```

### List all available domains

```js
cloudflare.listDomains(function (err, domains) {
  if (err) throw err;
  domains.forEach(function (domain) {
    var plan   = domain.props.plan,
        status = domain.zone_status_class.replace('status-', '');

    console.log("Domain: %s, plan: %s, status: %s", domain.display_name, plan, status);
  });
});
```
