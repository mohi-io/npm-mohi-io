var logger = require('../logger');
var filesystem = require('./../filesystem');

var exports = {};

exports.getStorageName = function () {
  return 'file';
};

exports.getJsonData = function (provider, user, repo, fileName, callback) {
  var repoDir = filesystem.getRepoDir(provider.getProviderName(), user, repo);
  var filename = repoDir + '/data/' + fileName + '.json';
  logger.debug("get json data: ", filename);
  return filesystem.getFileContent(filename, callback);
};

exports.saveJsonData = function (provider, user, repo, fileName, content, callback) {
  logger.info('skipping save json data..');
};

module.exports = exports;
