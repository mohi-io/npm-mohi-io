var spawn = require('child_process').spawn;
var config = require('config');
var logger = require('../../logger/logger').logger;
var exports = {};

exports.runTask = function (repoDir, projectLogger, callback) {
  var buildGradlePath = (repoDir + '/build/build.gradle');

  var decorateGradleBuildScriptPath = config.vendor.baseDir + config.vendor.decorateGradleBuildScript;
  logger.debug("run decorateVersion: " + decorateGradleBuildScriptPath + " for " + buildGradlePath);

  var decorateVersion = spawn('sh', [decorateGradleBuildScriptPath, buildGradlePath], {});

  decorateVersion.stdout.on('data', function (data) {
    logger.debug('decorateVersion stdout: ' + data);
  });

  decorateVersion.stderr.on('data', function (data) {
    logger.debug('decorateVersion stderr: ' + data);
  });

  decorateVersion.on('close', function (code) {
    logger.debug('decorateVersion child process exited with code ' + code);

    if (code > 0) {
      projectLogger.error("Unable to decorate project with version task");
      return callback(new Error('decorateVersion child process exited with code ' + code), code);
    }

    projectLogger.info("Project decorated with version task");
    return callback(null, code)
  });

};

module.exports = exports;
