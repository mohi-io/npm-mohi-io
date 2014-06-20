var spawn = require('child_process').spawn;
var config = require('config');
var logger = require('../../logger/logger').logger;
var exports = {};

exports.runTask = function (repoDir, projectLogger, callback) {
  var buildGradlePath = (repoDir + '/build/build.gradle');

  logger.debug("run decorateProjectInfoTask: " + config.gradle.decorateGradleProjectInfoTask + " for " + buildGradlePath);

  var decorateProjectInfo = spawn('sh', [
    config.gradle.decorateGradleProjectInfoTask,
    buildGradlePath
  ], {});

  decorateProjectInfo.stdout.on('data', function (data) {
    logger.debug('decorateProjectInfo stdout: ' + data);
  });

  decorateProjectInfo.stderr.on('data', function (data) {
    logger.debug('decorateProjectInfo stderr: ' + data);
  });

  decorateProjectInfo.on('close', function (code) {
    logger.debug('decorateProjectInfo child process exited with code ' + code);

    if (code > 0) {
      projectLogger.error("Unable to decorate project with info task");
      return callback(new Error('decorateProjectInfo child process exited with code ' + code), code);
    }

    projectLogger.info("Project decorated with info task");
    return callback(null, code)
  });

};

module.exports = exports;
