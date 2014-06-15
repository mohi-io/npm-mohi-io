var decorateGradleProjectInfoTask = require('./decorateGradleProjectInfoTask');
var generateProjectInfoTask = require('./generateProjectInfoTask');
var filesystem = require('./../filesystem');
var logger = require('../logger');

var exports = {};

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
        return callback(err);
      });
    });
  });
};

module.exports = exports;
