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
  t.true(zones[0] instanceof Zone);
  t.true(zones[1] instanceof Zone);

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
  t.true(zones[0] instanceof Zone);
  t.true(zones[1] instanceof Zone);

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

  t.true(zone instanceof Zone);
});
