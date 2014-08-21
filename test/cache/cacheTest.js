var rewire = require('rewire');
var cache = rewire('../../lib/cache/cache');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;


describe('cache test', function () {

  before(function () {
  });

  it('should create redis cache', function (done) {

    var mockRedisCacheConfig = {
      cache: {
        type: "redis"
      }
    };

    cache.__set__({
      config: mockRedisCacheConfig
    });

    var cacheProvider = cache.getCacheProvider();
    cacheProvider.should.equal('redis');
    done();
  });

  it('should throw exception on unknown cache type', function (done) {

    var mockUnknownCacheConfig = {
      cache: {
        type: "unknown"
      }
    };

    cache.__set__({
      config: mockUnknownCacheConfig
    });

    expect(function () {
      cache.getCacheProvider();
    }).to.throw('Unknown cache type: unknown');

    done();
  });

});
