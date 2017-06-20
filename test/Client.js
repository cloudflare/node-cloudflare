'use strict';
var assert = require('power-assert');
var td = require('testdouble');
var mocha = require('mocha');

var describe = mocha.describe;
var it = mocha.it;
var beforeEach = mocha.beforeEach;
var afterEach = mocha.afterEach;

describe('HTTP Client', function () {
  var FakeGetter;
  var Client;

  beforeEach(function () {
    FakeGetter = td.replace('../lib/Getter');
    Client = require('../lib/Client');
  });

  afterEach(function () {
    td.reset();
  });

  it('should convert data into query parameters in GET requests', function () {
    var getter = new FakeGetter();
    var email = 'fake@domain.email';
    var key = 'DEADBEEF';
    var body = {
      hello: 'world'
    };

    var options = {
      json: true,
      method: 'GET',
      headers: {
        'X-Auth-Key': key,
        'X-Auth-Email': email,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      query: {
        name: 'world'
      }
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td.when(getter.got(
      'https://api.cloudflare.com/client/v4/example/42',
      td.matchers.contains(options)
    )).thenResolve({body: body});

    var subject = new Client({
      email: email,
      key: key
    });

    var res = subject.request('GET', 'example/42', {
      name: 'world'
    }, {
      auth: {},
      headers: {}
    });

    return res.then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should pass data as body for non-GET requests', function () {
    var getter = new FakeGetter();
    var body = {
      hello: 'world'
    };
    var options = {
      json: true,
      timeout: 42,
      retries: 1337,
      method: 'TEST',
      body: JSON.stringify({
        name: 'world'
      })
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td.when(getter.got(
      'https://api.cloudflare.com/client/v4/example/42',
      td.matchers.contains(options)
    )).thenResolve({body: body});

    var subject = new Client({});

    var res = subject.request('TEST', 'example/42', {
      name: 'world'
    }, {
      timeout: 42,
      retries: 1337,
      auth: {},
      headers: {}
    });

    return res.then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should support User Service Auth keys', function () {
    var getter = new FakeGetter();
    var email = 'fake@domain.email';
    var key = 'v1.0-DEADBEEF';
    var body = {
      hello: 'world'
    };

    var options = {
      json: true,
      method: 'GET',
      headers: {
        'X-Auth-User-Service-Key': key,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      query: {
        name: 'world'
      }
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td.when(getter.got(
      'https://api.cloudflare.com/client/v4/example/42',
      td.matchers.contains(options)
    )).thenResolve({body: body});

    var subject = new Client({
      email: email,
      key: key
    });

    var res = subject.request('GET', 'example/42', {
      name: 'world'
    }, {
      auth: {},
      headers: {}
    });

    return res.then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });

  it('should override authentication', function () {
    var getter = new FakeGetter();
    var body = {
      hello: 'world'
    };
    var options = {
      json: true,
      method: 'TEST',
      body: JSON.stringify({
        name: 'world'
      }),
      headers: {
        'X-Auth-Key': 'DEADBEEF',
        'X-Auth-Email': 'fake@domain.email'
      }
    };

    td.when(getter.got(), {ignoreExtraArgs: true}).thenReject();
    td.when(getter.got(
      'https://api.cloudflare.com/client/v4/example/42',
      td.matchers.contains(options)
    )).thenResolve({body: body});

    var subject = new Client({
      email: 'other@domain.email',
      key: '5CA1AB1E'
    });

    var res = subject.request('TEST', 'example/42', {
      name: 'world'
    }, {
      auth: {
        email: 'fake@domain.email',
        key: 'DEADBEEF'
      },
      headers: {}
    });

    return res.then(function (resp) {
      assert.deepEqual(resp, body);
    });
  });
});
