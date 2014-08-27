var rewire = require('rewire');
var githubClient = rewire('../../../lib/provider/client/githubClient');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('github client test', function () {

  before(function () {
  });

  it('should create github client with auth', function (done) {
    githubClient.__set__({
      config: {
        github: {
          api: {
            version: "3.0.0",
            protocol: "https",
            host: "api.github.com",
            pathPrefix: ''
          },
          protocol: "https",
          host: "github.com",
          token: "",
          username: "username",
          password: "password"
        }
      },
      GitHubApi: function (settings) {
        settings.protocol.should.equal('https');
        settings.host.should.equal('api.github.com');
        settings.version.should.equal('3.0.0');
        settings.pathPrefix.should.equal('');
        settings.timeout.should.equal(5000);

        this.authenticate = function (auth) {
          auth.type.should.equal('basic');
          auth.username.should.equal('username');
          auth.password.should.equal('password');
        }
      }
    });

    var client = githubClient.client();
    should.exist(client);

    done();
  });


  it('should create github client', function (done) {
    githubClient.__set__({
      config: {
        github: {
          api: {
            version: "3.0.0",
            protocol: "https",
            host: "api.github.com",
            pathPrefix: ''
          },
          protocol: "https",
          host: "github.com",
          token: ""
        }
      },
      GitHubApi: function (settings) {
        settings.protocol.should.equal('https');
        settings.host.should.equal('api.github.com');
        settings.version.should.equal('3.0.0');
        settings.pathPrefix.should.equal('');
        settings.timeout.should.equal(5000);
      }
    });

    var client = githubClient.client();
    should.exist(client);

    done();
  });

});
