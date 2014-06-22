var logger = require('../logger/logger').logger;
var config = require('config');
var redisQueue = require('./redisQueue');

var exports = {};

var getQueue = function () {
  switch (config.processingQueue.type) {
    case 'redis':
      return redisQueue;
    default :
      return null;
  }
};

exports.push = function (task, callback) {
  logger.debug("push: ", task);
  return getQueue().push(task, callback);
};

exports.pop = function (callback) {
  logger.debug("pop");
  return getQueue().pop(callback);
};

exports.getQueueProvider = function () {
  return getQueue().getQueueProvider();
};

module.exports = exports;