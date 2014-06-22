var logger = require('../logger/logger').logger;
var config = require('config');
var redisClient = require("../backend/redisClient").redisClient;
var queuedListName = config.processingQueue.prefix + '_queued_list';
var processingListName = config.processingQueue.prefix + '_processing_list';
var decodeTask = require('../model/task/task').decodeTask;

var exports = {};

exports.getQueueProvider = function () {
  return 'redis';
};

exports.push = function (task, callback) {
  logger.info('add to queue: ', task, task.encode());

  redisClient.lpush(queuedListName, task.encode(), callback);
};

exports.pop = function (callback) {
  logger.info('get from queue');

  redisClient.rpoplpush(queuedListName, processingListName, function (err, res) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    if (res) {
      res = decodeTask(res);
    }

    return callback(null, res);
  });
};

module.exports = exports;
