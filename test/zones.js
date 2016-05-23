/* eslint-disable camelcase */
import test from 'ava';
import nock from 'nock';
import CF, {Zone, PaginatedResponse} from '../';

nock.disableNetConnect();

test.beforeEach(t => {
  t.context.cf = new CF({
    key: 'deadbeef',
    email: 'cloudflare@example.com',
    h2: false
  });
});

test('parses /zones response', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones')
    .reply(200, {
      result: [{
        id: '1',
        name: 'example.com',
        created_on: '2014-01-01T05:20:00.12345Z',
        modified_on: '2015-06-21T01:34:00.0000Z'
      }, {
        id: '2',
        name: 'cloudflare.com'
      }],
      result_info: {
        page: 1,
        per_page: 20,
        count: 2,
        total_count: 2
      }
    });

  let response = await t.context.cf.browseZones();
  t.true(response instanceof PaginatedResponse);

  let zones = response.result;

  t.true(zones.length === 2);
  t.true(Zone.is(zones[0]));
  t.true(Zone.is(zones[1]));

  t.true(zones[0].id === '1');
  t.true(zones[0].name === 'example.com');
  t.true(zones[0].createdOn instanceof Date);
  t.true(zones[0].modifiedOn instanceof Date);
});

test('list accepts query parameters', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones')
    .query({status: 'pending', direction: 'asc'})
    .reply(200, {
      result: [{
        id: '1',
        name: 'example.com'
      }, {
        id: '2',
        name: 'cloudflare.com'
      }],
      result_info: {
        page: 1,
        per_page: 20,
        count: 2,
        total_count: 2
      }
    });

  let response = await t.context.cf.browseZones({
    status: 'pending',
    direction: 'asc'
  });

  t.true(response instanceof PaginatedResponse);

  let zones = response.result;

  t.true(zones.length === 2);
  t.true(Zone.is(zones[0]));
  t.true(Zone.is(zones[1]));

  t.true(zones[0].id === '1');
  t.true(zones[0].name === 'example.com');
});

test('fetch a Zone by id', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones/1')
    .reply(200, {
      result: {
        id: '1',
        name: 'example.com'
      }
    });

  let zone = await t.context.cf.readZone('1');

  t.true(Zone.is(zone));
});

test('delete a Zone by id', async t => {
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1')
    .reply(200, {
      result: {
        id: '1'
      }
    });

  let zone = await t.context.cf.deleteZone('1');

  t.false(Zone.is(zone));
  t.true(zone.id === '1');
});

test('delete a Zone by Zone', async t => {
  let z = Zone.create({
    id: '1',
    name: 'example.com'
  });
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1')
    .reply(200, {
      result: {
        id: '1'
      }
    });

  let zone = await t.context.cf.deleteZone(z);

  t.false(Zone.is(zone));
  t.true(zone.id === '1');
});

test('edit paused status', async t => {
  let z = Zone.create({
    id: '1',
    name: 'example.com',
    paused: false
  });

  z.paused = true;

  nock('https://api.cloudflare.com')
    .patch('/client/v4/zones/1', {
      paused: true
    })
    .reply(200, {
      result: {
        id: '1',
        name: 'example.com',
        paused: true
      }
    });

  let zone = await t.context.cf.editZone(z);
  t.true(Zone.is(zone));
  t.true(zone.paused);
});

test('edit vanity name servers', async t => {
  let z = Zone.create({
    id: '1',
    name: 'example.com',
    vanity_name_servers: ['ns1.example.com']
  });

  z.vanityNameservers = z.vanityNameservers.concat('ns2.example.com');

  nock('https://api.cloudflare.com')
    .patch('/client/v4/zones/1', {
      vanity_name_servers: ['ns1.example.com', 'ns2.example.com']
    })
    .reply(200, {
      result: {
        id: '1',
        name: 'example.com',
        vanity_name_servers: ['ns1.example.com', 'ns2.example.com']
      }
    });

  let zone = await t.context.cf.editZone(z);
  t.true(Zone.is(zone));
  t.deepEqual(zone.vanityNameservers, ['ns1.example.com', 'ns2.example.com']);
});

test('edit paused and vanity name servers', async t => {
  var result = {
    id: '1',
    name: 'example.com',
    vanity_name_servers: ['ns1.example.com'],
    paused: false
  };

  let z = Zone.create({
    id: '1',
    name: 'example.com',
    vanity_name_servers: ['ns1.example.com']
  });

  z.vanityNameservers = z.vanityNameservers.concat('ns2.example.com');
  z.paused = true;

  nock('https://api.cloudflare.com')
    .patch('/client/v4/zones/1', {
      vanity_name_servers: ['ns1.example.com', 'ns2.example.com']
    })
    .reply(200, function (uri, requestBody) {
      result.vanity_name_servers = requestBody.vanity_name_servers;
      return {
        result: result
      };
    })
    .patch('/client/v4/zones/1', {
      paused: true
    })
    .reply(200, function (uri, requestBody) {
      result.paused = requestBody.paused;
      return {
        result: result
      };
    });

  let zone = await t.context.cf.editZone(z);
  t.true(Zone.is(zone));
  t.true(zone.paused);
  t.deepEqual(zone.vanityNameservers, ['ns1.example.com', 'ns2.example.com']);
});

test('add zone', async t => {
  let z = Zone.create({
    name: 'example.com'
  });

  nock('https://api.cloudflare.com')
    .post('/client/v4/zones', {
      name: 'example.com',
      jump_start: false
    })
    .reply(200, {
      result: {
        id: '8',
        name: 'example.com'
      }
    });

  let zone = await t.context.cf.addZone(z, false);
  t.true(Zone.is(zone));
  t.true(zone.id === '8');
});

test('zone with embedded owners doesn\'t error', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones')
    .reply(200, {
      result: [{
        id: '1',
        name: 'example.com',
        created_on: '2014-01-01T05:20:00.12345Z',
        modified_on: '2015-06-21T01:34:00.0000Z',
        owner: {
          id: 'cf',
          email: 'cloudflare@example.com',
          name: 'CloudFlare',
          owner_type: 'user'
        }
      }, {
        id: '2',
        name: 'cloudflare.com'
      }],
      result_info: {
        page: 1,
        per_page: 20,
        count: 2,
        total_count: 2
      }
    });

  let response = await t.context.cf.browseZones();
  t.true(response instanceof PaginatedResponse);

  let zones = response.result;

  t.true(zones.length === 2);
  t.true(Zone.is(zones[0]));
  t.true(Zone.is(zones[1]));

  t.true(zones[0].id === '1');
  t.true(zones[0].name === 'example.com');
  t.true(zones[0].createdOn instanceof Date);
  t.true(zones[0].modifiedOn instanceof Date);
  t.true(zones[0].owner.id === 'cf');
  t.true(zones[0].owner.email === 'cloudflare@example.com');
});
