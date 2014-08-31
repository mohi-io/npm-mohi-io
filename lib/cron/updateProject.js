var logger = require('../logger/logger').logger;
var queue = require('../queue/queue');
var processingQueue = require('../processingQueue');
var status = require('../status/status');
var StatusType = require('../status/type').StatusType;

module.exports.execute = function () {
  logger.info('Execute update project job');

  queue.pop(function (res, task) {
    if (task) {
      status.updateStatus(task, StatusType.Type.QUEUED.getId(), function (err) {

        if (err) {
          throw err;
        }

        processingQueue.push(task);
        return processingQueue.start();
      });
    }
    else {
      logger.info('no task, skip');
    }
  });
};
