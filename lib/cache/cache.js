var logger = require('../logger/logger').logger;
var config = require('config');
var redisCache = require('./redisCache');

var exports = {};

var getCache = function () {
  switch (config.cache.type) {
    case 'redis':
      return redisCache;
    default :
      return null;
  }
};

exports.set = function (key, value, callback) {
  logger.debug("set: ", key, value);
  return getCache().set(key, value, callback);
};

exports.get = function (key, callback) {
  logger.debug("get: " + key);
  return getCache().get(key, callback);
};

exports.getCacheProvider = function () {
  return getCache().getCacheProvider();
};

module.exports = exports;