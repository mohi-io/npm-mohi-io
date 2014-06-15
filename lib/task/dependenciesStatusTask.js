var updateGradleProjectVersionTask = require('./decorateGradleBuildScript');
var generateDependenciesTask = require('./generateDependenciesTask');
var filesystem = require('./../filesystem');
var logger = require('../logger');

var exports = {};

exports.runTask = function (provider, system, user, repo, callback) {
  logger.debug("run dependencies status task");

  filesystem.prepareRepoDir(provider, user, repo, function (err, repoDir) {
    if (err) {
      logger.debug(err);
      return callback(err);
    }

//    TODO system dependant actions
//    system

    updateGradleProjectVersionTask.runTask(repoDir, function (err, code) {
      if (err) {
        logger.debug(err);
        return callback(err);
      }

      generateDependenciesTask.runTask(repoDir, function (err, code) {
        return callback(err);
      });
    });
  });
};

module.exports = exports;
