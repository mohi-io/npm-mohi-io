var rewire = require('rewire');
var logger = rewire('../../lib/logger/logger');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var mockLoggerConfig = {
  logger: {
    level: "debug"
  },
  projectLogger: {
    level: "info"
  }
};

logger.__set__({
  config: mockLoggerConfig,
  fs: {
    createWriteStream: function (dir) {
      return process.stdout;
    }
  },
  Log: function Log(level, stream){
    console.log('Log1!');
    level.should.equal('info');
    this.level = level;
    this.stream = stream;
  }
});

describe('logger tests', function () {

  before(function () {
  });

  it('should create log with debug level', function (done) {
    var log = logger.logger;
    expect(log.level).to.equal(7);
    done();
  });

//  it('should create project log with info level', function (done) {
//    var projectLogger = logger.projectLogger('/tmp');
//    console.log(projectLogger);
//    projectLogger.info('info log');
//    done();
//  });

});
