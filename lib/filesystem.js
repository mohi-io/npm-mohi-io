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
var logger = require('./logger');
var exports = {};


var updateGradlewVendorFiles = function (repoDir, callback) {

  fs.copy(config.gradle.gradlewVendorDir, repoDir + '/build', function (err) {
    return callback(err, repoDir);
  });

//  copyGradlewVendorTask.runTask(repoDir + '/build', function (err, code) {
//    return callback(err, repoDir);
//  });
};

var cleanupUnusedFiles = function (repoDir, callback) {
  logger.debug("filesystem: cleanup unused files ", repoDir);

  removeUnusedFiles.runTask(repoDir, function (err, code) {
    if (err) {
      logger.error(err);
      return callback(err, null);
    }

    return removeEmptyDirs.runTask(repoDir, callback);
  });
};

exports.getRepoDir = function (providerName, user, repo) {
  return util.format('%s/%s/%s/%s', config.gradle.gradleBuildDir, providerName, user, repo);
};

exports.prepareRepoDir = function (provider, user, repo, callback) {
  var repoDir = exports.getRepoDir(provider.getProviderName(), user, repo);
  logger.debug("filesystem: prepareRepoDir ", repoDir);

  fs.mkdirs(repoDir, function (err) {

    if (err) {
      return callback(err, null);
    }

    fs.exists(repoDir + '/build', function (exists) {
      logger.debug("filesystem: exists " + repoDir + '/build', exists);

      if (exists) {
        gitCleanTask.runTask(repoDir, function (err, code) {
          if (err) {
            logger.error(err);
            return callback(err, null);
          }

          gitResetTask.runTask(repoDir, function (err, code) {
            if (err) {
              logger.error(err);
              return callback(err, null);
            }

            gitPullTask.runTask(repoDir, '', function (err, code) {
              if (err) {
                logger.error(err);
                return callback(err, null);
              }

              cleanupUnusedFiles(repoDir, function (err, code) {
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
          //nop
        });

        gitCloneTask.runTask(provider.getRepoUrl(user, repo), repoDir, '', function (err, code) {
          if (err) {
            logger.error(err);
            return callback(err, null);
          }

          cleanupUnusedFiles(repoDir, function (err, code) {
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
