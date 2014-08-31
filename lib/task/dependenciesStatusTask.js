var decorateGradleBuildScript = require('./vendor/decorateGradleBuildScript');
var generateDependenciesTask = require('./gradle/generateDependenciesTask');
var filesystem = require('./../filesystem');
var logger = require('../logger/logger').logger;
var storage = require('../storage/storage');
var fileStorage = require('../storage/fileStorage');

var exports = {};
exports.REPORT = 'report';

exports.runTask = function (system, task, projectLogger, callback) {
  logger.debug("run dependencies status task");

  var repoDir = filesystem.getRepoDir(task);

  decorateGradleBuildScript.runTask(repoDir, projectLogger, function (err) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    generateDependenciesTask.runTask(repoDir, projectLogger, function (err) {
      if (err) {
        logger.error(err);
        return callback(err);
      }

      fileStorage.getJsonData(task, exports.REPORT, function (err, content) {
        if (err) {
          logger.error(err);
          return callback(err);
        }

        return storage.saveJsonData(task, exports.REPORT, content, callback);
      });
    });
  });
};

module.exports = exports;
