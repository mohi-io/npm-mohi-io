var decorateGradleProjectInfoTask = require('./vendor/decorateGradleProjectInfoTask');
var generateProjectInfoTask = require('./gradle/generateProjectInfoTask');
var filesystem = require('./../filesystem');
var logger = require('../logger');
var storage = require('../storage/storage');
var fileStorage = require('../storage/fileStorage');

var exports = {};
exports.PROJECT_INFO = 'projectInfo';

exports.runTask = function (provider, system, user, repo, callback) {
  logger.debug("run project info task");

  var repoDir = filesystem.getRepoDir(provider.getProviderName(), user, repo);

  decorateGradleProjectInfoTask.runTask(repoDir, function (err, code) {
    if (err) {
      logger.error(err);
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
};

module.exports = exports;

