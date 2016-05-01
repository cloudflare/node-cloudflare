import test from 'ava';
import nock from 'nock';
import CF, {HTTPError, RequestError, ParseError} from '../';

nock.disableNetConnect();

test.beforeEach(t => {
  t.context.client = new CF({
    key: 'deadbeef',
    email: 'cloudflare@example.com',
    h2: false
  });
});

test('includes auth header', async t => {
  nock('https://api.cloudflare.com')
    .matchHeader('X-Auth-Key', 'deadbeef')
    .matchHeader('X-Auth-Email', 'cloudflare@example.com')
    .get('/client/v4/hello')
    .reply(200, {
      hello: 'world'
    });

  const res = await t.context.client._got('hello');

  t.deepEqual(res.body, {hello: 'world'});
});

test('includes user agent', async t => {
  nock('https://api.cloudflare.com')
    .matchHeader('user-agent', /^cloudflare\/.*? node\/.*?$/)
    .get('/client/v4/hello')
    .reply(200, {
      hello: 'world'
    });

  const res = await t.context.client._got('hello');

  t.deepEqual(res.body, {hello: 'world'});
});

test('rejects on non-200', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/status/500')
    .reply(500, {
      error: 'Internal Server Error'
    });

  await t.throws(t.context.client._got('status/500'), HTTPError, 'Response code 500 (Internal Server Error)');
});

test('rejects on socket timeout', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/status/500')
    .socketDelay(2)
    .reply(500, {
      error: 'Internal Server Error'
    });

  await t.throws(t.context.client._got('status/500', {
    timeout: 1,
    retries: 0
  }), RequestError);
});

test('rejects if JSON parse error', async t => {
  nock('https://api.cloudflare.com')
    .get('/client/v4/error')
    .reply(200, '{json: false');

  await t.throws(t.context.client._got('error'), ParseError);
});
