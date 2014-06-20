var spawn = require('child_process').spawn;
var logger = require('../../logger/logger').logger;

var exports = {};

exports.runTask = function (repoDir, projectLogger, callback) {
  logger.debug("run generate dependencies task");

  var generateDependencies = spawn('./gradlew', [
    'dependencyUpdates',
    '-Drevision=release',
    '-DoutputFormatter=json',
    '-DoutputDir=../data'
  ], {
    cwd: repoDir + '/build'
  });


  var dependenciesLog = '';

  generateDependencies.stdout.on('data', function (data) {
    logger.debug('generateDependencies stdout: ' + data);
    dependenciesLog += data;
  });

  generateDependencies.stderr.on('data', function (data) {
    logger.debug('generateDependencies stderr: ' + data);
  });

  generateDependencies.on('close', function (code) {
    logger.debug('generateDependencies child process exited with code ' + code);

    if (code > 0) {
      projectLogger.error("Unable to generate dependencies status");
      return callback(new Error('generateDependencies child process exited with code ' + code), code);
    }

    projectLogger.info(dependenciesLog);
    projectLogger.info("Generated dependencies status");
    return callback(null, code)
  });

};

module.exports = exports;
