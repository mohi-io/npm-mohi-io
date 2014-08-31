var logger = require('../logger/logger').logger;
var filesystem = require('./../filesystem');

var exports = {};

exports.getStorageProvider = function () {
  return 'file';
};

exports.getJsonData = function (task, fileName, callback) {
  var repoDir = filesystem.getRepoDir(task);
  var file = repoDir + '/data/' + fileName + '.json';
  logger.debug("get json data: ", file);
  return filesystem.getFileContent(file, callback);
};

exports.saveJsonData = function (task, fileName, content, callback) {
  logger.info('skipping save json data..', task, fileName, content, callback);
};

module.exports = exports;
