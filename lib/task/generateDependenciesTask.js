var spawn = require('child_process').spawn;
var logger = require('../logger');

var exports = {};

exports.runTask = function (repoDir, callback) {
  logger.debug("run generate dependencies task");

  var generateDependencies = spawn('./gradlew', [
    'dependencyUpdates',
    '-Drevision=release',
    '-DoutputFormatter=json',
    '-DoutputDir=../data'
  ], {
    cwd: repoDir + '/build'
  });

  generateDependencies.stdout.on('data', function (data) {
    logger.debug('generateDependencies stdout: ' + data);
  });

  generateDependencies.stderr.on('data', function (data) {
    logger.debug('generateDependencies stderr: ' + data);
  });

  generateDependencies.on('close', function (code) {
    logger.debug('generateDependencies child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('generateDependencies child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
