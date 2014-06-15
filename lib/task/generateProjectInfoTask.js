var spawn = require('child_process').spawn;
var logger = require('../logger');
var projectInfoResolver = require('../projectInfoResolver');

var exports = {};

exports.runTask = function (repoDir, callback) {

  logger.debug("run generate project info task: " + repoDir);

  var generateProjectInfo = spawn('./gradlew', [
    'projectInfo',
      '-PoutputFilePath=../data/' + projectInfoResolver.PROJECT_INFO + '.json'
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
      return callback(new Error('generateProjectInfo child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
