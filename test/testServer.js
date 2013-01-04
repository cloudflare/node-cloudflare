exports.start = function (done) {
  var restify       = require('restify'),
      path          = require('path'),
      fs            = require('fs'),
      server        = restify.createServer(),
      mockResponses = {};

  server.use(restify.bodyParser());

  server.expect = function (route, response) {
    if (arguments.length === 1) {
      response = route;
    }
    if (typeof response === 'string') {
      response = require(path.join(__dirname, 'responses', response) + ".json");
    }

    mockResponses[route] = response;
  };

  server.post(/.*/, function (req, res, next) {
    if (mockResponses.hasOwnProperty(req.params.a)) {
      res.contentType = 'application/json';
      res.send(mockResponses[req.params.a]);
      res.end();
    } else {
      next();
    }
  });

  server.listen(5555, done);

  return server;
};
