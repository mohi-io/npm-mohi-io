var rewire = require('rewire');
var redisCache = rewire('../../lib/cache/redisCache');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;


describe('redis cache tests', function () {

  before(function () {
    redisCache.__set__({
      config: {
        cache: {
          prefix: "prefix"
        }
      },
      redisClient: {
        set: function (key, value, callback) {
          key.should.equal('prefixkey');
          value.should.equal('value');
          expect(callback).to.be.an('function');
          return callback('value');
        },
        get: function (key, callback) {
          key.should.equal('prefixkey');
          expect(callback).to.be.an('function');
          return callback('value');
        }
      }
    });

  });

  it('should set redis cache value', function (done) {
    redisCache.set('key', 'value', function (result) {
    });

    done();
  });

  it('should get redis cache value', function (done) {

    redisCache.get('key', function (result) {
      result.should.equal('value');
    });

    done();
  });

});
