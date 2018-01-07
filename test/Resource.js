/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const assert = require('power-assert');
const mocha = require('mocha');
const prototypal = require('es-class');
const td = require('testdouble');

const describe = mocha.describe;
const it = mocha.it;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;

const Resource = require('../lib/Resource');
const Client = require('../lib/Client');

describe('Resource', () => {
  let FakeClient;

  beforeEach(done => {
    FakeClient = td.constructor(Client);

    done();
  });

  afterEach(done => {
    td.reset();
    done();
  });

  it('creates an instance of a Resource', done => {
    const client = new FakeClient();
    const subject = new Resource(client);

    assert(subject instanceof Resource);
    assert.strictEqual(subject._client, client); // eslint-disable-line no-underscore-dangle

    done();
  });

  describe('createFullPath', () => {
    it('returns root when unconfigured', done => {
      const client = new FakeClient();
      const subject = new Resource(client);

      const path = subject.createFullPath();

      assert.equal(path, '');

      done();
    });

    it('joins method path with resource path', done => {
      const client = new FakeClient();
      const subject = new Resource(client);

      subject.path = 'example';

      const path = subject.createFullPath('foo');

      assert.equal(path, 'example/foo');

      done();
    });
  });

  describe('subclass', () => {
    it('creates and instance of Resource and Klass', done => {
      const Klass = prototypal({
        extends: Resource,
      });
      const client = new FakeClient();
      const subject = new Klass(client);

      assert(subject instanceof Resource);
      assert(subject instanceof Klass);
      assert.strictEqual(subject._client, client); // eslint-disable-line no-underscore-dangle

      done();
    });

    it('joins method path with resource path', done => {
      const Klass = prototypal({
        extends: Resource,
        path: 'example',
      });
      const client = new FakeClient();
      const subject = new Klass(client);

      const path = subject.createFullPath('foo');

      assert.equal(path, 'example/foo');

      done();
    });

    it('includes basic methods', done => {
      const Klass = prototypal({
        extends: Resource,
        includeBasic: ['browse', 'del'],
      });
      const client = new FakeClient();
      const subject = new Klass(client);

      assert(Object.hasOwnProperty.call(subject, 'browse'));
      assert(typeof subject.browse === 'function');
      assert(Object.hasOwnProperty.call(subject, 'del'));
      assert(typeof subject.del === 'function');

      done();
    });
  });
});
