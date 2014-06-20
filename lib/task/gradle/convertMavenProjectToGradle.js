var spawn = require('child_process').spawn;
var logger = require('../../logger/logger').logger;

var exports = {};

exports.runTask = function (repoDir, callback) {

  logger.debug("run convert maven project to gradle task");

  var convertMavenProjectToGradle = spawn('./gradlew', [
    'init'
  ], {
    cwd: repoDir + '/build'
  });

  convertMavenProjectToGradle.stdout.on('data', function (data) {
    logger.debug('convertMavenProjectToGradle stdout: ' + data);
  });

  convertMavenProjectToGradle.stderr.on('data', function (data) {
    logger.debug('convertMavenProjectToGradle stderr: ' + data);
  });

  convertMavenProjectToGradle.on('close', function (code) {
    logger.debug('convertMavenProjectToGradle child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('convertMavenProjectToGradle child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
