/* eslint-disable camelcase */
import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
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
  t.true(DNSRecord.is(records[0]));

  t.true(records[0].id === '80808');
  t.true(records[0].name === 'example.com');
  t.true(records[0].content === '8.8.8.8');
});

test('parse DNS records for zone by Zone', async t => {
  const z = Zone.create({id: 1});
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
  t.true(DNSRecord.is(records[0]));

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

  t.true(DNSRecord.is(record));
});

test('fetch DNS record with Zone', async t => {
  const z = Zone.create({id: 1});
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

  t.true(DNSRecord.is(record));
});

test('edit DNS Record', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    id: '80808',
    type: 'A',
    name: 'example.com',
    ttl: 120,
    content: '8.8.4.4'
  });
  rr.content = '8.8.8.8';

  nock('https://api.cloudflare.com')
    .put('/client/v4/zones/1/dns_records/80808', {
      id: '80808',
      type: 'A',
      name: 'example.com',
      ttl: 120,
      content: '8.8.8.8',
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

  t.true(DNSRecord.is(record));
});

test('add DNS Record', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'AAAA',
    name: 'example.com',
    ttl: 120,
    content: '2001:4860:4860::8888'
  });

  nock('https://api.cloudflare.com')
    .post('/client/v4/zones/1/dns_records', {
      type: 'AAAA',
      name: 'example.com',
      ttl: 120,
      content: '2001:4860:4860::8888'
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
    })
    .post('/client/v4/zones/1/dns_records', {
      id: '',
      type: 'AAAA',
      name: 'example.com',
      ttl: 120,
      content: '2001:4860:4860::8888'
    })
    .reply(400, {
      success: false,
      errors: [{
        code: 1004,
        message: 'DNS Validation Error'
      }],
      result: null
    });

  let record = await t.context.cf.addDNS(rr);

  t.true(DNSRecord.is(record));
  t.true(record.id === '90909');
});

test('delete DNS Record', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    id: '80808',
    type: 'A',
    name: 'example.com',
    ttl: 120,
    content: '8.8.4.4'
  });

  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/dns_records/80808')
    .reply(200, {
      result: {
        id: '80808'
      }
    });

  let record = await t.context.cf.deleteDNS(rr);

  t.false(DNSRecord.is(record));
  t.true(record.id === '80808');
});

test('create SRV record', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'SRV',
    data: {
      name: 'a'
    }
  });
  nock('https://api.cloudflare.com')
    .post('/client/v4/zones/1/dns_records')
    .reply(200, {
      result: {
        id: '12345',
        type: 'SRV',
        data: rr.data
      }
    });
  let record = await t.context.cf.addDNS(rr);
  t.true(record.data.name === 'a');
});

test('passes only type and data for SRV record creation', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'SRV',
    name: 'something',
    content: 'random content',
    data: {
      name: 'a'
    }
  });
  const cf = t.context.cf;
  const fakeGot = sinon.stub(cf, '_got').returns(Promise.resolve({
    body: {
      result: rr.toJSON()
    }
  }));
  await t.context.cf.addDNS(rr);
  const body = JSON.parse(fakeGot.getCall(0).args[1].body);
  // Should only have type and data as keys, even though more data was passed to DNSRecord constructor
  t.deepEqual(Object.keys(body).sort(), ['data', 'type'], 'Incorrect values present in body');
});

test('create MX record without priority - defaults to 0', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'MX',
    name: 'something.com',
    ttl: 100
  });
  nock('https://api.cloudflare.com')
    .post('/client/v4/zones/1/dns_records')
    .reply(200, {
      result: {
        id: '12345',
        type: 'MX',
        priority: rr.priority
      }
    });
  let record = await t.context.cf.addDNS(rr);
  t.is(record.priority, 0);
});

test('creating MX record includes priority in body', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'MX',
    name: 'something.com',
    ttl: 100
  });
  const cf = t.context.cf;
  const fakeGot = sinon.stub(cf, '_got').returns(Promise.resolve({
    body: {
      result: rr.toJSON()
    }
  }));
  await t.context.cf.addDNS(rr);
  // Re-read body from the _got call
  const body = JSON.parse(fakeGot.getCall(0).args[1].body);
  // Should include priority even if not provided in rr
  t.is(body.priority, 0);
});

test('create MX record with priority', async t => {
  const rr = DNSRecord.create({
    zone_id: '1',
    type: 'MX',
    name: 'something.com',
    ttl: 100,
    priority: 50
  });
  const cf = t.context.cf;
  const fakeGot = sinon.stub(cf, '_got').returns(Promise.resolve({
    body: {
      result: rr.toJSON()
    }
  }));
  await t.context.cf.addDNS(rr);
  // Re-read body from the _got call
  const body = JSON.parse(fakeGot.getCall(0).args[1].body);
  // Should have the priority provided to rr
  t.is(body.priority, 50);
});
