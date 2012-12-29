var should = require('should');
var assert = require('assert');

var CF_TOKEN = 'abcdeF';
var CF_EMAIL = 'my@email.tld';

describe('CloudFlare', function () {
    var client, server;

    before(function (done) {
        client = require('../../index').createClient({
            token: CF_TOKEN,
            email: CF_EMAIL
        });
        client.endpoint = 'http://localhost:5555';

        server = require('../testServer').start(done);
    });

    after(function (done) {
        server.close();
        done();
    });

    describe('#listDomains', function () {

        it('should require only the action parameter', function (done) {
            server.expect('zone_load_multi');

            client.listDomains(function (err, domains) {
                assert.equal(err, null);

                domains.should.have.length(3);
                domains.getCount().should.equal(3);
                domains.hasMore().should.not.be.ok;

                done();
            });
        });

    });

    describe('#listDomainRecords', function () {
        it('should process domain records', function (done) {
            server.expect('rec_load_all');

            client.listDomainRecords('example.com', function (err, records) {
                assert.equal(err, null);

                records.should.have.length(7);
                assert.equal(7, records.getCount());
                records.hasMore().should.not.be.ok;

                done();
            });
        });
    });
});
