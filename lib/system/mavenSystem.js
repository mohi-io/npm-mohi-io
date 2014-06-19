var logger = require('../logger');
var convertMavenProjectToGradle = require('../task/convertMavenProjectToGradle');

var exports = {};

exports.prepareRepo = function (repoDir, callback) {
  logger.debug("prepare maven repo dir");
  convertMavenProjectToGradle.runTask(repoDir, callback);
};

exports.getSystemName = function () {
  return "maven";
};

module.exports = exports;
