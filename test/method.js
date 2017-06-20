'use strict';
var assert = require('power-assert');
var td = require('testdouble');
var mocha = require('mocha');

var describe = mocha.describe;
var it = mocha.it;
var beforeEach = mocha.beforeEach;
var afterEach = mocha.afterEach;

var Resource = require('../lib/Resource');
var Client = require('../lib/Client');
var method = require('../lib/method');

describe('method', function () {
  var FakeResource;
  var FakeClient;
  beforeEach(function () {
    FakeClient = td.constructor(Client);
    FakeResource = td.constructor(Resource);
  });
  afterEach(function () {
    td.reset();
  });

  it('should make basic request', function () {
    var body = {
      hello: 'world'
    };

    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath(undefined)).thenReturn('/');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td.when(client.request('GET', '/', {}, {
      auth: {},
      headers: {}
    })).thenResolve(body);

    var subject = method({}).bind(resource);

    return subject().then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should interpolate URL parameters', function () {
    var body = {
      hello: 'world'
    };

    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath('/:id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td.when(client.request('POST', 'example/42', {}, {
      auth: {},
      headers: {}
    })).thenResolve(body);

    var subject = method({
      method: 'POST',
      path: '/:id'
    }).bind(resource);

    return subject(42).then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should reject when URL parameters are not provided', function () {
    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath('/:id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();

    var subject = method({
      method: 'POST',
      path: '/:id'
    }).bind(resource);

    return subject().catch(function (err) {
      assert(err.message.match(/^Cloudflare: Argument/));
    });
  });

  it('should extract data from arguments', function () {
    var body = {
      hello: 'world'
    };
    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath('/:id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td.when(client.request('POST', 'example/42', {
      name: 'world'
    }, {
      auth: {},
      headers: {}
    })).thenResolve(body);

    var subject = method({
      method: 'POST',
      path: '/:id'
    }).bind(resource);

    return subject(42, {
      name: 'world'
    }).then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should extract options with no body', function () {
    var body = {
      hello: 'world'
    };

    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath(undefined)).thenReturn('/');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td.when(client.request('GET', '/', {}, {
      auth: {
        key: 'SCA1EAB1E',
        email: 'other@domain.email'
      },
      headers: {}
    })).thenResolve(body);

    var subject = method({}).bind(resource);

    return subject({
      key: 'SCA1EAB1E',
      email: 'other@domain.email'
    }).then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should extract options with body', function () {
    var body = {
      hello: 'world'
    };

    var client = new FakeClient();
    var resource = new FakeResource();
    resource._client = client;

    td.when(resource.createFullPath('/:id')).thenReturn('example/:id');
    td.when(client.request(), {ignoreExtraArgs: true}).thenReject();
    td.when(client.request('POST', 'example/42', {
      name: 'world'
    }, {
      auth: {
        key: 'SCA1EAB1E',
        email: 'other@domain.email'
      },
      headers: {}
    })).thenResolve(body);

    var subject = method({
      method: 'POST',
      path: '/:id'
    }).bind(resource);

    return subject(42, {
      name: 'world'
    }, {
      key: 'SCA1EAB1E',
      email: 'other@domain.email'
    }).then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });
});
