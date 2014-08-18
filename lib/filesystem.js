var fs = require('fs-extra');
var config = require('config');
var util = require('util');
var gitCloneTask = require('./task/git/gitCloneTask');
var gitPullTask = require('./task/git/gitPullTask');
var gitCleanTask = require('./task/git/gitCleanTask');
var removeUnusedFiles = require('./task/system/removeUnusedFiles');
var removeEmptyDirs = require('./task/system/removeEmptyDirs');
var gitResetTask = require('./task/git/gitResetTask');
//var copyGradlewVendorTask = require('./task/copyGradlewVendorTask');
var logger = require('./logger/logger').logger;
var gradlewVendorDir = config.vendor.baseDir + config.vendor.gradlewDir;
var exports = {};


var updateGradlewVendorFiles = function (repoDir, callback) {

  fs.copy(gradlewVendorDir, repoDir + '/build', function (err) {
    return callback(err, repoDir);
  });

//  copyGradlewVendorTask.runTask(repoDir + '/build', function (err, code) {
//    return callback(err, repoDir);
//  });
};

var cleanupUnusedFiles = function (repoDir, callback) {
  logger.debug("filesystem: cleanup unused files ", repoDir);

  removeUnusedFiles.runTask(repoDir, function (err) {
    if (err) {
      logger.error(err);
      return callback(err, null);
    }

    return removeEmptyDirs.runTask(repoDir, callback);
  });
};

exports.getRepoDir = function (task) {
  return util.format('%s/%s/%s/%s/%s',
    config.vendor.gradleBuildDir,
    task.getProviderName(),
    task.getUser(),
    task.getRepo(),
    task.getBranch()
  );
};

exports.prepareRepoDir = function (provider, task, callback) {
  var repoDir = exports.getRepoDir(task);
  logger.debug("filesystem: prepareRepoDir ", repoDir);

  fs.mkdirs(repoDir, function (err) {

    if (err) {
      return callback(err, null);
    }

    fs.exists(repoDir + '/build', function (exists) {
      logger.debug("filesystem: exists " + repoDir + '/build', exists);

      if (exists) {
        gitCleanTask.runTask(repoDir, function (err) {
          if (err) {
            logger.error(err);
            return callback(err, null);
          }

          gitResetTask.runTask(repoDir, task.getBranch(), function (err) {
            if (err) {
              logger.error(err);
              return callback(err, null);
            }

            gitPullTask.runTask(repoDir, task.getBranch(), function (err) {
              if (err) {
                logger.error(err);
                return callback(err, null);
              }

              cleanupUnusedFiles(repoDir, function (err) {
                if (err) {
                  logger.error(err);
                  return callback(err, null);
                }

                return updateGradlewVendorFiles(repoDir, callback);
              });
            });
          });
        });
      }
      else {
        fs.mkdirs(repoDir + '/data', function (err) {
          if (err) {
            logger.error(err);
          }
        });

        gitCloneTask.runTask(provider.getRepoUrl(task), repoDir, '', function (err) {
          if (err) {
            logger.error(err);
            return callback(err, null);
          }

          cleanupUnusedFiles(repoDir, function (err) {
            if (err) {
              logger.error(err);
              return callback(err, null);
            }

            return updateGradlewVendorFiles(repoDir, callback);
          });
        });
      }
    });
  });
};

exports.getFileContent = function (fileName, callback) {
  fs.readJsonFile(fileName, function (err, data) {
    if (err) {
      logger.error(err);
      return callback(new Error('File not found: ' + fileName), null);
    }

    return callback(null, data);
  });
};

module.exports = exports;
