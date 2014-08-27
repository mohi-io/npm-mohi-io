var rewire = require('rewire');
var redisQueue = rewire('../../lib/queue/redisQueue');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var project = require('../../lib/model/task/task').task;
var task = new project('github', 'user', 'repo', 'branch');

describe('redis queue tests', function () {

  before(function () {
    redisQueue.__set__({
      config: {
        processingQueue: {
          prefix: "prefix"
        }
      },
      redisClient: {
        lpush: function (queuedListName, taskString, callback) {
          queuedListName.should.equal('mohi_queue_queued_list');
          taskString.should.equal('github:user:repo:branch');
          expect(callback).to.be.an('function');
          return callback();
        },
        rpoplpush: function (queuedListName, processingListName, callback) {
          queuedListName.should.equal('mohi_queue_queued_list');
            processingListName.should.equal('mohi_queue_processing_list');
          expect(callback).to.be.an('function');
          return callback(null, 'github:user:repo:branch');
        }
      }
    });

  });

  it('should push task to redis queue', function (done) {
    redisQueue.push(task, function (err, result) {
    });

    done();
  });

  it('should pop task frok redis queue', function (done) {

    redisQueue.pop(function (err, result) {
      expect(result).to.have.property('providerName');
      result.providerName.should.equal('github');

      expect(result).to.have.property('user');
      result.user.should.equal('user');

      expect(result).to.have.property('repo');
      result.repo.should.equal('repo');

      expect(result).to.have.property('branch');
      result.branch.should.equal('branch');
    });

    done();
  });

  it('should get redis queue name', function (done) {

    var queueName = redisQueue.getQueueProvider();
    queueName.should.equal('redis');
    done();
  });

});
