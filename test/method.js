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

const Resource = require('../lib/Resource');
const Client = require('../lib/Client');
const method = require('../lib/method');

describe('method', () => {
  let FakeResource;
  let FakeClient;

  beforeEach(done => {
    FakeClient = td.constructor(Client);
    FakeResource = td.constructor(Resource);

    done();
  });
  afterEach(done => {
    td.reset();
    done();
  });

  it('should make basic request', () => {
    const body = {
      hello: 'world',
    };

    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(undefined)).thenReturn('/');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        client.request(
          'GET',
          '/',
          {},
          {
            auth: {},
            headers: {},
          }
        )
      )
      .thenResolve(body);

    const subject = method({}).bind(resource);

    return subject().then(resp => assert.deepEqual(resp, body));
  });

  it('should interpolate URL parameters', () => {
    const body = {
      hello: 'world',
    };

    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(':id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        client.request(
          'POST',
          'example/42',
          {},
          {
            auth: {},
            headers: {},
          }
        )
      )
      .thenResolve(body);

    const subject = method({
      method: 'POST',
      path: ':id',
    }).bind(resource);

    return subject(42).then(resp => assert.deepEqual(resp, body));
  });

  it('should reject when URL parameters are not provided', () => {
    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(':id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();

    const subject = method({
      method: 'POST',
      path: ':id',
    }).bind(resource);

    return subject().catch(err =>
      assert(err.message.match(/^Cloudflare: Argument/))
    );
  });

  it('should extract data from arguments', () => {
    const body = {
      hello: 'world',
    };
    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(':id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        client.request(
          'POST',
          'example/42',
          {
            name: 'world',
          },
          {
            auth: {},
            headers: {},
          }
        )
      )
      .thenResolve(body);

    const subject = method({
      method: 'POST',
      path: ':id',
    }).bind(resource);

    return subject(42, {
      name: 'world',
    }).then(resp => assert.deepEqual(resp, body));
  });

  it('should extract options with no body', () => {
    const body = {
      hello: 'world',
    };

    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(undefined)).thenReturn('/');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        client.request(
          'GET',
          '/',
          {},
          {
            auth: {
              key: 'SCA1EAB1E',
              email: 'other@domain.email',
            },
            headers: {},
          }
        )
      )
      .thenResolve(body);

    const subject = method({}).bind(resource);

    return subject({
      key: 'SCA1EAB1E',
      email: 'other@domain.email',
    }).then(resp => assert.deepEqual(resp, body));
  });

  it('should extract options with body', () => {
    const body = {
      hello: 'world',
    };

    const client = new FakeClient();
    const resource = new FakeResource();

    resource._client = client; // eslint-disable-line no-underscore-dangle

    td.when(resource.createFullPath(':id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td
      .when(
        client.request(
          'POST',
          'example/42',
          {
            name: 'world',
          },
          {
            auth: {
              key: 'SCA1EAB1E',
              email: 'other@domain.email',
            },
            headers: {},
          }
        )
      )
      .thenResolve(body);

    const subject = method({
      method: 'POST',
      path: ':id',
    }).bind(resource);

    return subject(
      42,
      {
        name: 'world',
      },
      {
        key: 'SCA1EAB1E',
        email: 'other@domain.email',
      }
    ).then(resp => assert.deepEqual(resp, body));
  });
});
