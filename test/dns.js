/* eslint-disable camelcase */
import test from 'ava';
import nock from 'nock';
import CF, {DNSRecord, PaginatedResponse, Zone} from '../';

nock.disableNetConnect();

test.beforeEach(t => {
  t.context.cf = new CF({
    key: 'deadbeef',
    email: 'cloudflare@example.com',
    h2: false
  });
});

test('parse DNS records for zone by id', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones/1/dns_records')
    .reply(200, {
      result: [{
        id: '80808',
        type: 'A',
        name: 'example.com',
        content: '8.8.8.8',
        ttl: 120
      }],
      result_info: {
        page: 1,
        per_page: 20,
        count: 1,
        total_count: 1
      }
    });

  var response = await t.context.cf.browseDNS('1');

  t.true(response instanceof PaginatedResponse);

  let records = response.result;

  t.true(records.length === 1);
  t.true(records[0] instanceof DNSRecord);

  t.true(records[0].id === '80808');
  t.true(records[0].name === 'example.com');
  t.true(records[0].content === '8.8.8.8');
});

test('parse DNS records for zone by Zone', async t => {
  const z = new Zone({id: 1});
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones/1/dns_records')
    .reply(200, {
      result: [{
        id: '80808',
        type: 'A',
        name: 'example.com',
        content: '8.8.8.8',
        ttl: 120
      }],
      result_info: {
        page: 1,
        per_page: 20,
        count: 1,
        total_count: 1
      }
    });

  var response = await t.context.cf.browseDNS(z);

  t.true(response instanceof PaginatedResponse);

  let records = response.result;

  t.true(records.length === 1);
  t.true(records[0] instanceof DNSRecord);

  t.true(records[0].id === '80808');
  t.true(records[0].name === 'example.com');
  t.true(records[0].content === '8.8.8.8');
});

test('fetch DNS record by id', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones/1/dns_records/80808')
    .reply(200, {
      result: [{
        id: '80808',
        type: 'A',
        name: 'example.com',
        content: '8.8.8.8',
        ttl: 120
      }]
    });

  let record = await t.context.cf.readDNS('80808', '1');

  t.true(record instanceof DNSRecord);
});

test('fetch DNS record with Zone', async t => {
  const z = new Zone({id: 1});
  nock('https://api.cloudflare.com')
    .get('/client/v4/zones/1/dns_records/80808')
    .reply(200, {
      result: [{
        id: '80808',
        type: 'A',
        name: 'example.com',
        content: '8.8.8.8',
        ttl: 120
      }]
    });

  let record = await t.context.cf.readDNS('80808', z);

  t.true(record instanceof DNSRecord);
});

test('edit DNS Record', async t => {
  const rr = new DNSRecord({
    id: '80808',
    type: 'A',
    name: 'example.com',
    ttl: 120,
    content: '8.8.4.4'
  });
  rr.zoneId = '1';

  nock('https://api.cloudflare.com')
    .put('/client/v4/zones/1/dns_records/80808', {
      id: '80808',
      type: 'A',
      name: 'example.com',
      ttl: 120,
      content: '8.8.4.4',
      zone_id: '1'
    })
    .reply(200, {
      result: {
        id: '80808',
        type: 'A',
        name: 'example.com',
        ttl: 120,
        content: '8.8.4.4',
        zone_id: '1'
      }
    });

  let record = await t.context.cf.editDNS(rr);

  t.true(record instanceof DNSRecord);
});

test('add DNS Record', async t => {
  const rr = new DNSRecord({
    type: 'AAAA',
    name: 'example.com',
    ttl: 120,
    content: '2001:4860:4860::8888'
  });
  rr.zoneId = '1';

  nock('https://api.cloudflare.com')
    .post('/client/v4/zones/1/dns_records', {
      type: 'AAAA',
      name: 'example.com',
      ttl: 120,
      content: '2001:4860:4860::8888',
      zone_id: '1'
    })
    .reply(200, {
      result: {
        id: '90909',
        type: 'AAAA',
        name: 'example.com',
        ttl: 120,
        content: '2001:4860:4860::8888',
        zone_id: '1'
      }
    });

  let record = await t.context.cf.addDNS(rr);

  t.true(record instanceof DNSRecord);
  t.true(record.id === '90909');
});

test('delete DNS Record', async t => {
  const rr = new DNSRecord({
    id: '80808',
    type: 'A',
    name: 'example.com',
    ttl: 120,
    content: '8.8.4.4'
  });
  rr.zoneId = '1';

  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/dns_records/80808')
    .reply(200, {
      result: {
        id: '80808'
      }
    });

  let record = await t.context.cf.deleteDNS(rr);

  t.false(record instanceof DNSRecord);
  t.true(record.id === '80808');
});
