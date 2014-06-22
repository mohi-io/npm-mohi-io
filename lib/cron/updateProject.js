var logger = require('../logger/logger').logger;
var queue = require('../queue/queue');
var processingQueue = require('../processingQueue');
var status = require('../status/status');
var StatusType = require('../status/statusType').StatusType;

var updateProject = function () {
  logger.info('Execute update project job');

  queue.pop(function (res, task) {
    if (task) {
      status.updateStatus(task, StatusType.QUEUED.getId(), function (err, res) {
        processingQueue.push(task);
        return processingQueue.start();
      });
    }
    else {
      logger.info('no task, skip');
    }
  });
};

module.exports.updateProject = updateProject;