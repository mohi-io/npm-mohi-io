var spawn = require('child_process').spawn;
var logger = require('../../logger/logger');
var config = require('config');

var exports = {};

exports.runTask = function (callback) {
  logger.debug("run init gradlew task");

  var gradlew = spawn('./gradlew', ['-v'], {
    cwd: config.gradle.gradlewVendorDir
  });

  gradlew.stdout.on('data', function (data) {
    logger.debug('gradlew stdout: ' + data);
  });

  gradlew.stderr.on('data', function (data) {
    logger.debug('gradlew stderr: ' + data);
  });

  gradlew.on('close', function (code) {
    logger.debug('gradlew child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gradlew child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
