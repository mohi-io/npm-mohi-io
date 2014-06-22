var logger = require('../logger/logger').logger;
var config = require('config');
var redisClient = require("../backend/redisClient").redisClient;

var exports = {};

exports.getCacheProvider = function () {
  return 'redis';
};

var getCacheKey = function (key) {
  return config.cache.prefix + key;
}

exports.set = function (key, value, callback) {
  logger.info('save to cache: ', key, value);
  redisClient.set(getCacheKey(key), value, callback);
};

exports.get = function (key, callback) {
  logger.info('get from cache: ' + key);
  redisClient.get(getCacheKey(key), callback);
};

module.exports = exports;
