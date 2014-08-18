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

exports.getJsonData = function (task, fileName, callback) {
  logger.debug("storage: get json data: ", fileName);
  return getStorage().getJsonData(task, fileName, callback);
};

exports.saveJsonData = function (task, fileName, content, callback) {
  logger.debug("storage: save json data: ", fileName);
  return getStorage().saveJsonData(task, fileName, content, callback);
};

module.exports = exports;