var rewire = require('rewire');
var provider = rewire('../../lib/provider/provider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var githubProviderMock = {};
var bitbucketProviderMock = {};

provider.__set__({
  githubProvider: githubProviderMock,
  bitbucketProvider: bitbucketProviderMock
});

describe('provider test', function () {

  before(function () {
  });

  it('should use github provider', function (done) {

    var result = provider.getProvider('github');
    result.should.equal(githubProviderMock);
    done();
  });

  it('should use bitbucket provider', function (done) {

    var result = provider.getProvider('bitbucket');
    result.should.equal(bitbucketProviderMock);
    done();
  });

  it('should use bitbucket provider', function (done) {

    expect(function () {
      provider.getProvider('unknown');
    }).to.throw('Unknown repository provider: unknown');

    done();
  });

});
