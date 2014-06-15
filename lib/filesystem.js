var fs = require('fs-extra');
var config = require('config');
var util = require('util');
var gitCloneTask = require('./task/gitCloneTask');
var gitPullTask = require('./task/gitPullTask');
var gitResetTask = require('./task/gitResetTask');
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

exports.getRepoDir = function (providerName, user, repo) {
  return util.format('%s/%s/%s/%s', config.gradle.gradleBuildDir, providerName, user, repo);
};

exports.prepareRepoDir = function (provider, user, repo, callback) {
  var repoDir = exports.getRepoDir(provider.getProviderName(), user, repo);
  logger.debug("prepareRepoDir ", repoDir);

  fs.mkdirs(repoDir, function (err) {

    if (err) {
      return callback(err, null);
    }

    fs.exists(repoDir + '/build', function (exists) {
      logger.debug("exists " + repoDir + '/build', exists);

      if (exists) {
        gitResetTask.runTask(repoDir, function (err, code) {
          if (err) {
            logger.debug(err);
            return callback(err, null);
          }

          gitPullTask.runTask(repoDir, 'master', function (err, code) {
            if (err) {
              logger.debug(err);
              return callback(err, null);
            }

            return updateGradlewVendorFiles(repoDir, callback);
          });
        });
      }
      else {
        fs.mkdirs(repoDir + '/data', function (err) {
          //nop
        });

        gitCloneTask.runTask(provider.getRepoUrl(user, repo), repoDir, 'master', function (err, code) {
          if (err) {
            logger.debug(err);
            return callback(err, null);
          }

          return updateGradlewVendorFiles(repoDir, callback);
        });
      }
    });
  });
};
//
//var checkRepoDir = function (provider, user, repo, callback) {
//  var repoDir = util.format('%s/%s/%s/%s', config.gradle.gradleBuildDir, provider, user, repo);
//  logger.debug("checkRepoDir ", repoDir);
//
//  fs.exists(repoDir, function (exists) {
//    if (exists) {
//      return callback(null, repoDir);
//    }
//
//    return callback(new Error("not found"), null);
//  });
//};
//
//exports.initProject = function (provider, user, repo, callback) {
//  initRepoDir(provider, user, repo, function (err, repoDir) {
//    if (err) {
//      logger.debug(err);
//      return callback(err, {});
//    }
//
//    logger.debug("Init project");
//    callback(err);
//  });
//};
//
//exports.addFile = function (provider, user, repo, fileName, fileContent, callback) {
//  prepareRepoDir(provider, user, repo, function (err, repoDir) {
//    if (err) {
//      logger.debug(err);
//      return callback(err, {});
//    }
//
//    logger.debug("Add file to ", repoDir + '/build/' + fileName);
//    fs.writeFile(repoDir + '/build/' + fileName, fileContent, callback);
//  });
//};

exports.getJsonData = function (provider, user, repo, fileName, callback) {
  var repoDir = exports.getRepoDir(provider.getProviderName(), user, repo);
  var filename = repoDir + '/data/' + fileName;
  logger.debug("get json data: ", filename);

  fs.readJsonFile(filename, function (err, data) {
    if (err) {
      return callback(new Error('File not found: ' + filename), null);
    }

    return callback(null, data);
  });
};

module.exports = exports;
