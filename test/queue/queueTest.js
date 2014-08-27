var rewire = require('rewire');
var queue = rewire('../../lib/queue/queue');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;


describe('queue test', function () {

  before(function () {
  });

  it('should use redis queue', function (done) {

    var mockRedisQueueConfig = {
      processingQueue: {
        type: "redis"
      }
    };

    queue.__set__({
      config: mockRedisQueueConfig
    });

    var queueProvider = queue.getQueueProvider();
    queueProvider.should.equal('redis');

    done();
  });

  it('should throw exception on unknown cache type', function (done) {

    var mockUnknownQueueConfig = {
      processingQueue: {
        type: "unknown"
      }
    };

    queue.__set__({
      config: mockUnknownQueueConfig
    });

    expect(function () {
      queue.getQueueProvider();
    }).to.throw('Unknown queue type: unknown');

    done();
  });

});
