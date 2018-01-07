/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const assert = require('power-assert');
const td = require('testdouble');
const mocha = require('mocha');

const describe = mocha.describe;
const it = mocha.it;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;

describe('HTTP Client', () => {
  let FakeGetter;
  let Client;

  beforeEach(done => {
    FakeGetter = td.replace('../lib/Getter');
    Client = require('../lib/Client'); // eslint-disable-line global-require

    done();
  });

  afterEach(done => {
    td.reset();
    done();
  });

  it('should convert data into query parameters in GET requests', () => {
    const getter = new FakeGetter();
    const email = 'fake@domain.email';
    const key = 'DEADBEEF';
    const body = {
      hello: 'world',
    };

    const options = {
      json: true,
      method: 'GET',
      headers: {
        'X-Auth-Key': key,
        'X-Auth-Email': email,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      query: {
        name: 'world',
      },
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        getter.got(
          'https://api.cloudflare.com/client/v4/example/42',
          td.matchers.contains(options)
        )
      )
      .thenResolve({body});

    const subject = new Client({
      email,
      key,
    });

    const res = subject.request(
      'GET',
      'example/42',
      {
        name: 'world',
      },
      {
        auth: {},
        headers: {},
      }
    );

    return res.then(resp => assert.deepEqual(resp, body));
  });

  it('should pass data as body for non-GET requests', () => {
    const getter = new FakeGetter();
    const body = {
      hello: 'world',
    };
    const options = {
      json: true,
      timeout: 42,
      retries: 1337,
      method: 'TEST',
      body: JSON.stringify({
        name: 'world',
      }),
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        getter.got(
          'https://api.cloudflare.com/client/v4/example/42',
          td.matchers.contains(options)
        )
      )
      .thenResolve({body});

    const subject = new Client({});

    const res = subject.request(
      'TEST',
      'example/42',
      {
        name: 'world',
      },
      {
        timeout: 42,
        retries: 1337,
        auth: {},
        headers: {},
      }
    );

    return res.then(resp => assert.deepEqual(resp, body));
  });

  it('should support User Service Auth keys', () => {
    const getter = new FakeGetter();
    const email = 'fake@domain.email';
    const key = 'v1.0-DEADBEEF';
    const body = {
      hello: 'world',
    };

    const options = {
      json: true,
      method: 'GET',
      headers: {
        'X-Auth-User-Service-Key': key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      query: {
        name: 'world',
      },
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        getter.got(
          'https://api.cloudflare.com/client/v4/example/42',
          td.matchers.contains(options)
        )
      )
      .thenResolve({body});

    const subject = new Client({
      email,
      key,
    });

    const res = subject.request(
      'GET',
      'example/42',
      {
        name: 'world',
      },
      {
        auth: {},
        headers: {},
      }
    );

    return res.then(resp => assert.deepEqual(resp, body));
  });

  it('should override authentication', () => {
    const getter = new FakeGetter();
    const body = {
      hello: 'world',
    };
    const options = {
      json: true,
      method: 'TEST',
      body: JSON.stringify({
        name: 'world',
      }),
      headers: {
        'X-Auth-Key': 'DEADBEEF',
        'X-Auth-Email': 'fake@domain.email',
      },
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        getter.got(
          'https://api.cloudflare.com/client/v4/example/42',
          td.matchers.contains(options)
        )
      )
      .thenResolve({body});

    const subject = new Client({
      email: 'other@domain.email',
      key: '5CA1AB1E',
    });

    const res = subject.request(
      'TEST',
      'example/42',
      {
        name: 'world',
      },
      {
        auth: {
          email: 'fake@domain.email',
          key: 'DEADBEEF',
        },
        headers: {},
      }
    );

    return res.then(resp => assert.deepEqual(resp, body));
  });
});
