var decorateGradleProjectInfoTask = require('./decorateGradleProjectInfoTask');
var generateProjectInfoTask = require('./generateProjectInfoTask');
var filesystem = require('./../filesystem');
var logger = require('../logger');
var storage = require('../storage/storage');
var fileStorage = require('../storage/fileStorage');

var exports = {};
exports.PROJECT_INFO = 'projectInfo';

exports.runTask = function (provider, system, user, repo, callback) {
  logger.debug("run project info task");

  filesystem.prepareRepoDir(provider, user, repo, function (err, repoDir) {
    if (err) {
      logger.debug(err);
      return callback(err);
    }

//    TODO system dependant actions
//    system

    decorateGradleProjectInfoTask.runTask(repoDir, function (err, code) {
      if (err) {
        logger.debug(err);
        return callback(err);
      }

      generateProjectInfoTask.runTask(repoDir, function (err, code) {
        if (err) {
          logger.error(err);
          return callback(err);
        }

        fileStorage.getJsonData(provider, user, repo, exports.PROJECT_INFO, function (err, content) {
          if (err) {
            logger.error(err);
            return callback(err);
          }

          return storage.saveJsonData(provider, user, repo, exports.PROJECT_INFO, content, callback);
        });
      });
    });
  });
};

module.exports = exports;

