var spawn = require('child_process').spawn;
var logger = require('../../logger/logger').logger;
//var projectInfoTask = require('./projectInfoTask');

var exports = {};

exports.runTask = function (repoDir, projectLogger, callback) {

//  var outputFile = '../data/' + projectInfoTask.PROJECT_INFO + '.json';
  var outputFile = '../data/projectInfo.json';

  logger.debug("run generate project info task: " + outputFile);

  var generateProjectInfo = spawn('./gradlew', [
    'projectInfo',
      '-PoutputFilePath=' + outputFile
  ], {
    cwd: repoDir + '/build'
  });

  generateProjectInfo.stdout.on('data', function (data) {
    logger.debug('generateProjectInfo stdout: ' + data);
  });

  generateProjectInfo.stderr.on('data', function (data) {
    logger.debug('generateProjectInfo stderr: ' + data);
  });

  generateProjectInfo.on('close', function (code) {
    logger.debug('generateProjectInfo child process exited with code ' + code);

    if (code > 0) {
      projectLogger.error("Unable to generate project info");
      return callback(new Error('generateProjectInfo child process exited with code ' + code), code);
    }

    projectLogger.info("Generated project info");
    return callback(null, code)
  });

};

module.exports = exports;
