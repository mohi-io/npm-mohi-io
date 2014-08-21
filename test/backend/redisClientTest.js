var rewire = require('rewire');
var redisClient = rewire('../../lib/backend/redisClient');
var chai = require('chai');
var should = chai.should();

var mockConfig = {
  backend: {
    redis: {
      hosts: [
        {
          host: "localhost",
          port: "6379"
        }
      ],
      options: {
        auth_pass: "pass"
      }
    }
  }
};

var redisMock = {
  createClient: function createClient(masterPort, masterHost, options) {
    masterPort.should.equal('6379');
    masterHost.should.equal('localhost');
    options.auth_pass.should.equal('pass');

    return true;
  }
};

redisClient.__set__({
  config: mockConfig,
  redis: redisMock
});

describe('redis client test', function () {

  before(function () {
  });

  it('should create client for redis', function (done) {

    var client = redisClient.client();
    should.exist(client);
    done();
  });

});
