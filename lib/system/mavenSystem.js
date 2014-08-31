var logger = require('../logger/logger').logger;
var convertMavenProjectToGradle = require('../task/gradle/convertMavenProjectToGradle');
var fixBuildGradle = require('../task/vendor/fixBuildGradle');

var exports = {};

exports.prepareRepo = function (repoDir, callback) {
  logger.debug("prepare maven repo dir");
  convertMavenProjectToGradle.runTask(repoDir, function (err) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    return fixBuildGradle.runTask(repoDir, callback);
  });
};

exports.getSystemName = function () {
  return "maven";
};

module.exports = exports;
