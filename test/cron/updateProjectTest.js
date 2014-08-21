var rewire = require('rewire');
var updateProject = rewire('../../lib/cron/updateProject');
var project = require('../../lib/model/task/task').task;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var exampleTask = new project('github', 'user', 'repo', 'branch');

describe('cron updateProject job tests', function () {

  before(function () {
  });

  it('should run updateProject for valid task', function (done) {
    updateProject.__set__({
      status: {
        updateStatus: function (task, status, callback) {
          task.should.equal(exampleTask);
          status.should.equal(1);
          expect(callback).to.be.an('function');
          return callback(null);
        }
      },
      queue: {
        pop: function (callback) {
          return callback('res', exampleTask);
        }
      },
      processingQueue: {
        push: function (task) {
          task.should.equal(exampleTask);
        },
        start: function () {
          done();
        }
      }
    });


    updateProject.execute();
  });

  it('should skip run updateProject for empty queue', function (done) {
    updateProject.__set__({
      queue: {
        pop: function (callback) {
          return callback();
        }
      }
    });

    updateProject.execute();

    setTimeout(function () {
      done();
    }, 10);
  });

  it('should throw error on failed status update', function (done) {
    updateProject.__set__({
      status: {
        updateStatus: function (task, status, callback) {
          return callback(new Error('Unable to update status for project'));
        }
      },
      queue: {
        pop: function (callback) {
          return callback('res', exampleTask);
        }
      }
    });

    expect(function () {
      updateProject.execute();
    }).to.throw('Unable to update status for project');

    done();
  });

});
