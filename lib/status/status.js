var logger = require('../logger/logger').logger;
var cache = require('../cache/cache');
var StatusType = require('../status/statusType').StatusType;

var exports = {};

exports.getStatus = function (task, callback) {
  logger.debug("getStatus for: ", task.encode());

  return cache.get(task.encode(), function (err, res) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    if (!res) {
      return callback(err, StatusType.UNKNOWN);
    }

    return callback(err, StatusType.fromId(res));
  });
};

exports.updateStatus = function (task, status, callback) {
  logger.debug("updateStatus: ", status, task, task.encode());
  return cache.set(task.encode(), status, callback);
};

module.exports = exports;