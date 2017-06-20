'use strict';
var assert = require('power-assert');
var mocha = require('mocha');
var prototypal = require('es-class');
var td = require('testdouble');

var describe = mocha.describe;
var it = mocha.it;
var beforeEach = mocha.beforeEach;
var afterEach = mocha.afterEach;

var Resource = require('../lib/Resource');
var Client = require('../lib/Client');

describe('Resource', function () {
  var FakeClient;
  beforeEach(function () {
    FakeClient = td.constructor(Client);
  });

  afterEach(function () {
    td.reset();
  });

  it('creates an instance of a Resource', function () {
    var client = new FakeClient();
    var subject = new Resource(client);

    assert(subject instanceof Resource);
    assert.strictEqual(subject._client, client);
  });

  describe('createFullPath', function () {
    it('returns root when unconfigured', function () {
      var client = new FakeClient();
      var subject = new Resource(client);

      var path = subject.createFullPath();

      assert.equal(path, '/');
    });

    it('joins method path with resource path', function () {
      var client = new FakeClient();
      var subject = new Resource(client);
      subject.path = 'example';

      var path = subject.createFullPath('foo');

      assert.equal(path, 'example/foo');
    });
  });

  describe('subclass', function () {
    it('creates and instance of Resource and Klass', function () {
      var Klass = prototypal({
        extends: Resource
      });
      var client = new FakeClient();
      var subject = new Klass(client);

      assert(subject instanceof Resource);
      assert(subject instanceof Klass);
      assert.strictEqual(subject._client, client);
    });

    it('joins method path with resource path', function () {
      var Klass = prototypal({
        extends: Resource,
        path: 'example'
      });
      var client = new FakeClient();
      var subject = new Klass(client);

      var path = subject.createFullPath('foo');

      assert.equal(path, 'example/foo');
    });

    it('includes basic methods', function () {
      var Klass = prototypal({
        extends: Resource,
        includeBasic: [
          'browse',
          'del'
        ]
      });
      var client = new FakeClient();
      var subject = new Klass(client);

      assert(Object.hasOwnProperty.call(subject, 'browse'));
      assert(typeof subject.browse === 'function');
      assert(Object.hasOwnProperty.call(subject, 'del'));
      assert(typeof subject.del === 'function');
    });
  });
});
