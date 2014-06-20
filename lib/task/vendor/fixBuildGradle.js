var spawn = require('child_process').spawn;
var config = require('config');
var logger = require('../../logger/logger');
var exports = {};

exports.runTask = function (repoDir, callback) {
  var taskParams = [
      repoDir + '/build',
    '-name',
    'build.gradle',
    '-exec',
    config.gradle.fixBuildGradleTask,
    '{}',
    ';'
  ];

  logger.debug("run fix build gradle: " + taskParams);

  var fixBuildGradle = spawn('find', taskParams, {});

  fixBuildGradle.stdout.on('data', function (data) {
    logger.debug('fixBuildGradle stdout: ' + data);
  });

  fixBuildGradle.stderr.on('data', function (data) {
    logger.debug('fixBuildGradle stderr: ' + data);
  });

  fixBuildGradle.on('close', function (code) {
    logger.debug('fixBuildGradle child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('fixBuildGradle child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
