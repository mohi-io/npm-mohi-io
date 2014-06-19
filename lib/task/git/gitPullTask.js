var spawn = require('child_process').spawn;
var logger = require('../../logger');

var exports = {};

exports.runTask = function (repoDir, branchName, callback) {

  logger.debug("run git pull task");

  var taskParams = [
    'pull',
    'origin',
    branchName
  ];

  var gitPull = spawn('git', taskParams, {
    cwd: repoDir + '/build'
  });

  logger.debug("task: git", taskParams)

  gitPull.stdout.on('data', function (data) {
    logger.debug('gitPull stdout: ' + data);
  });

  gitPull.stderr.on('data', function (data) {
    logger.debug('gitPull stderr: ' + data);
  });

  gitPull.on('close', function (code) {
    logger.debug('gitPull child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gitPull child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
