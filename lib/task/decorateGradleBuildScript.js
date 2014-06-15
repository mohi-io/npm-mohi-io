var spawn = require('child_process').spawn;
var config = require('config');
var logger = require('../logger');
var exports = {};

exports.runTask = function (repoDir, callback) {
  var buildGradlePath = (repoDir + '/build/build.gradle');

  logger.debug("run decorateVersion: " + config.gradle.decorateGradleBuildScript + " for " + buildGradlePath);

  var decorateVersion = spawn('sh', [config.gradle.decorateGradleBuildScript, buildGradlePath], {});

  decorateVersion.stdout.on('data', function (data) {
    logger.debug('decorateVersion stdout: ' + data);
  });

  decorateVersion.stderr.on('data', function (data) {
    logger.debug('decorateVersion stderr: ' + data);
  });

  decorateVersion.on('close', function (code) {
    logger.debug('decorateVersion child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('decorateVersion child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
