var logger = require('../logger/logger').logger;
var config = require('config');
var fileStorage = require('./fileStorage');
var elasticsearchStorage = require('./elasticsearchStorage');

var exports = {};

var getStorage = function () {
  switch (config.storage.type) {
    case 'file':
      return fileStorage;
    case 'elasticsearch':
      return elasticsearchStorage;
    default :
      return null;
  }
};

exports.getJsonData = function (provider, user, repo, fileName, callback) {
  logger.debug("storage: get json data: ", fileName);
  return getStorage().getJsonData(provider, user, repo, fileName, callback);
};

exports.saveJsonData = function (provider, user, repo, fileName, content, callback) {
  logger.debug("storage: save json data: ", fileName);
  return getStorage().saveJsonData(provider, user, repo, fileName, content, callback);
};

module.exports = exports;