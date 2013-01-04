var should = require('should');

var CF_TOKEN = 'abcdeF';
var CF_EMAIL = 'my@email.tld';

describe('CloudFlare', function () {
  var client = require('../../').createClient({
    token: CF_TOKEN,
    email: CF_EMAIL
  });

  describe('#createRequestData', function () {

    it('should require only the action parameter', function () {
      var data = client.createRequestData('zone_load_multi');

      data.should.be.a('object').and.include({
        tkn: CF_TOKEN,
        email: CF_EMAIL,
        a: 'zone_load_multi'
      });
    });

    it('should merge additional parameters', function () {
      var data = client.createRequestData('zone_load_multi', { z: "example.com" });

      data.should.be.a('object').and.include({
        tkn: CF_TOKEN,
        email: CF_EMAIL,
        z: "example.com"
      });
    });
  });
});
