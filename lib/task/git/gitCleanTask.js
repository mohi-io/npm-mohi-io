var spawn = require('child_process').spawn;
var logger = require('../../logger/logger');

var exports = {};

exports.runTask = function (repoDir, callback) {
  logger.debug("run git clean task");

  var taskParams = [
    'clean',
    '-fdx'
  ];

  var gitClean = spawn('git', taskParams, {
    cwd: repoDir + '/build'
  });

  logger.debug("task: git", taskParams)

  gitClean.stdout.on('data', function (data) {
    logger.debug('gitClean stdout: ' + data);
  });

  gitClean.stderr.on('data', function (data) {
    logger.debug('gitClean stderr: ' + data);
  });

  gitClean.on('close', function (code) {
    logger.debug('gitClean child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gitClean child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
