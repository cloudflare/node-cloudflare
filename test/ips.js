import test from 'ava';
import nock from 'nock';
import CF, {IPRanges} from '../';

nock.disableNetConnect();

test('parses /ips response', async t => {
  let cf = new CF({
    key: 'deadbeef',
    email: 'cloudflare@example.com',
    h2: false
  });

  nock('https://api.cloudflare.com')
    .get('/client/v4/ips')
    .reply(200, {
      result: {
        ipv4_cidrs: [ // eslint-disable-line camelcase
          '127.0.0.0/8'
        ],
        ipv6_cidrs: [ // eslint-disable-line camelcase
          'fe80::/64'
        ]
      }
    });

  let ips = await cf.readIPs();
  t.true(IPRanges.is(ips));
  t.deepEqual(ips.toJSON(), {
    IPv4CIDRs: [
      '127.0.0.0/8'
    ],
    IPv6CIDRs: [
      'fe80::/64'
    ]
  });
});
