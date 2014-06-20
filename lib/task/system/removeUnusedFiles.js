var spawn = require('child_process').spawn;
var logger = require('../../logger');

var exports = {};

exports.runTask = function (repoDir, callback) {

  var taskParams = [
    '.',
    '!',
    '-name',
    '*.gradle',
    '!',
    '-name',
    '*pom.xml*',
    '!',
    '-name',
    'web.xml',
    '!',
    '-path',
    '*gradle*',
    '!',
    '-path',
    '*.git*',
    '-exec',
    'rm',
    '{}',
    ';'
  ];

  logger.debug("task: find", taskParams)

  var removeUnusedFiles = spawn('find', taskParams, {
    cwd: repoDir + '/build'
  });

  removeUnusedFiles.stdout.on('data', function (data) {
    logger.debug('removeUnusedFiles stdout: ' + data);
  });

  removeUnusedFiles.stderr.on('data', function (data) {
    logger.debug('removeUnusedFiles stderr: ' + data);
  });

  removeUnusedFiles.on('close', function (code) {
    logger.debug('removeUnusedFiles child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('removeUnusedFiles child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
