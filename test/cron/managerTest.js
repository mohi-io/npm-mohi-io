var rewire = require('rewire');
var manager = rewire('../../lib/cron/manager');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var mockCronConfig = {
  cron: {
    updateProject: {
      interval: 1000
    }
  }
};

describe('cron manager tests', function () {

  before(function () {
    manager.__set__({
      config: mockCronConfig
    });

  });

  it('should start updateProject job', function (done) {
    manager.start();

    setTimeout(function () {
      expect(manager.status()).to.have.length(1);
      done();
    }, 10);
  });

  it('should stop updateProject cron task', function (done) {
    manager.stop();

    setTimeout(function () {
      expect(manager.status()).to.be.empty;
      done();
    }, 10);
  });

  it('should throw error on invalid cron task', function (done) {
    manager.__set__({
      config: {
        cron: {
          invalidTask: {
            interval: 1000
          }
        }
      }
    });

    expect(function () {
      manager.start();
    }).to.throw('Cannot find module \'./invalidTask');

    done();
  });

});
