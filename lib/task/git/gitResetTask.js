var spawn = require('child_process').spawn;
var logger = require('../../logger');

var exports = {};

exports.runTask = function (repoDir, callback) {
  logger.debug("run git reset task");

  var taskParams = [
    'reset',
    '--hard'
  ];

  var gitReset = spawn('git', taskParams, {
    cwd: repoDir + '/build'
  });

  logger.debug("task: git", taskParams)

  gitReset.stdout.on('data', function (data) {
    logger.debug('gitReset stdout: ' + data);
  });

  gitReset.stderr.on('data', function (data) {
    logger.debug('gitReset stderr: ' + data);
  });

  gitReset.on('close', function (code) {
    logger.debug('gitReset child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gitReset child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
