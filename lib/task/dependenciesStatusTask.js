var updateGradleProjectVersionTask = require('./decorateGradleBuildScript');
var generateDependenciesTask = require('./generateDependenciesTask');
var filesystem = require('./../filesystem');
var logger = require('../logger');
var storage = require('../storage/storage');
var fileStorage = require('../storage/fileStorage');

var exports = {};
exports.REPORT = 'report';

exports.runTask = function (provider, system, user, repo, callback) {
  logger.debug("run dependencies status task");

  filesystem.prepareRepoDir(provider, user, repo, function (err, repoDir) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

//    TODO system dependant actions
//    system

    updateGradleProjectVersionTask.runTask(repoDir, function (err, code) {
      if (err) {
        logger.error(err);
        return callback(err);
      }

      generateDependenciesTask.runTask(repoDir, function (err, code) {
        if (err) {
          logger.error(err);
          return callback(err);
        }

        fileStorage.getJsonData(provider, user, repo, exports.REPORT, function (err, content) {
          if (err) {
            logger.error(err);
            return callback(err);
          }

          return storage.saveJsonData(provider, user, repo, exports.REPORT, content, callback);
        });
      });
    });
  });
};

module.exports = exports;
