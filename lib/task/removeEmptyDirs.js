var spawn = require('child_process').spawn;
var logger = require('../logger');

var exports = {};

exports.runTask = function (repoDir, callback) {

  var taskParams = [
    '.',
    '!',
    '-path',
    '*gradle*',
    '!',
    '-path',
    '*.git*',
    '-type',
    'd',
    '-empty',
    '-delete',
  ];

  logger.debug("task: find", taskParams)

  var removeEmptyDirs = spawn('find', taskParams, {
    cwd: repoDir + '/build'
  });

  removeEmptyDirs.stdout.on('data', function (data) {
    logger.debug('removeEmptyDirs stdout: ' + data);
  });

  removeEmptyDirs.stderr.on('data', function (data) {
    logger.debug('removeEmptyDirs stderr: ' + data);
  });

  removeEmptyDirs.on('close', function (code) {
    logger.debug('removeEmptyDirs child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('removeEmptyDirs child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
