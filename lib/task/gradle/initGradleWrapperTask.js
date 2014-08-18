var spawn = require('child_process').spawn;
var logger = require('../../logger/logger').logger;
var config = require('config');

var exports = {};

exports.runTask = function (callback) {
  logger.debug("run init gradlew task");
  logger.info('loading gradle wrapper');

  var stdout = "";

  var gradlew = spawn('./gradlew', ['-v'], {
    cwd: config.vendor.baseDir + config.vendor.gradlewDir
  });

  gradlew.stdout.on('data', function (data) {
    stdout += data;
  });

  gradlew.stderr.on('data', function (data) {
    logger.debug('gradlew stderr: ' + data);
  });

  gradlew.on('close', function (code) {
    logger.debug(stdout);
    logger.debug('gradlew child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gradlew child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
