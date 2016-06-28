import test from 'ava';
import nock from 'nock';
import CF, {Zone} from '../';

nock.disableNetConnect();

test.beforeEach(t => {
  t.context.cf = new CF({
    key: 'deadbeef',
    email: 'cloudflare@example.com',
    h2: false
  });
});

test('purge everything by id', async t => {
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/purge_cache', {
      purge_everything: true // eslint-disable-line camelcase
    })
    .reply(200, {
      success: true
    });

  t.true(await t.context.cf.deleteCache('1', {
    purge_everything: true // eslint-disable-line camelcase
  }));
});

test('purge everything by Zone', async t => {
  const z = Zone.create({id: 1});
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/purge_cache', {
      purge_everything: true // eslint-disable-line camelcase
    })
    .reply(200, {
      success: true
    });

  t.true(await t.context.cf.deleteCache(z, {
    purge_everything: true // eslint-disable-line camelcase
  }));
});

test('purge URL by id', async t => {
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/purge_cache', {
      files: [
        'https://example.com/purge_url'
      ]
    })
    .reply(200, {
      success: true
    });

  t.true(await t.context.cf.deleteCache('1', {
    files: [
      'https://example.com/purge_url'
    ]
  }));
});

test('purge URL by Zone', async t => {
  const z = Zone.create({id: 1});
  nock('https://api.cloudflare.com')
    .delete('/client/v4/zones/1/purge_cache', {
      files: [
        'https://example.com/purge_url'
      ]
    })
    .reply(200, {
      success: true
    });

  t.true(await t.context.cf.deleteCache(z, {
    files: [
      'https://example.com/purge_url'
    ]
  }));
});
