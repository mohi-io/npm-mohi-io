var spawn = require('child_process').spawn;
var logger = require('../../logger');

var exports = {};

exports.runTask = function (gitRepoUrl, repoDir, branchName, callback) {

  var taskParams = [
    'clone',
    '--depth',
    '1',
    '--single-branch',
    '--recurse-submodules',
    '--progress',
    gitRepoUrl
  ];

  if (branchName) {
    taskParams.push('--branch');
    taskParams.push(branchName);
  }

  taskParams.push(repoDir + '/build');

  logger.debug("task: git", taskParams)

  var gitClone = spawn('git', taskParams, {});

  gitClone.stdout.on('data', function (data) {
    logger.debug('gitClone stdout: ' + data);
  });

  gitClone.stderr.on('data', function (data) {
    logger.debug('gitClone stderr: ' + data);
  });

  gitClone.on('close', function (code) {
    logger.debug('gitClone child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('gitClone child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
