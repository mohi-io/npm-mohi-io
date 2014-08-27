var rewire = require('rewire');
var bitbucketClient = rewire('../../../lib/provider/client/bitbucketClient');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('bitbucket client test', function () {

  before(function () {
  });

  it('should create bitbucket client with auth', function (done) {
    bitbucketClient.__set__({
      config: {
        bitbucket: {
          username: "username",
          password: "password"
        }
      },
      bitbucket: {
        createClient: function (auth) {
          auth.username.should.equal('username');
          auth.password.should.equal('password');

          return {};
        }
      }
    });

    var client = bitbucketClient.client();
    should.exist(client);

    done();
  });

});
