var spawn = require('child_process').spawn;
var config = require('config');
var logger = require('../../logger/logger').logger;
var exports = {};

exports.runTask = function (repoDir, projectLogger, callback) {
  var buildGradlePath = (repoDir + '/build/build.gradle');

  var decorateGradleProjectInfoTaskPath = config.vendor.baseDir + config.vendor.decorateGradleProjectInfoTask;
  logger.debug("run decorateProjectInfoTask: " + decorateGradleProjectInfoTaskPath + " for " + buildGradlePath);

  var decorateProjectInfo = spawn('sh', [
    decorateGradleProjectInfoTaskPath,
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
