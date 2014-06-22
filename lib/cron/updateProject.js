var logger = require('../logger/logger').logger;
var queue = require('../queue/queue');
var processingQueue = require('../processingQueue');

var updateProject = function () {
  logger.info('Execute update project job');

  queue.pop(function (res, task) {
    logger.info('got task', task);

    if (task) {
      logger.info('add task', task);
      processingQueue.push(task);
      return processingQueue.start();
    }
    else {
      logger.info('no task');
    }
  });
};

module.exports.updateProject = updateProject;