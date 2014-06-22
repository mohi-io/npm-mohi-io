var logger = require('./lib/logger/logger').logger;
var initGradleWrapperTask = require('./lib/task/gradle/initGradleWrapperTask');
var cronManager = require('./lib/cron/manager');
var project = require('./lib/model/task/task').task;
var queue = require('./lib/queue/queue');
var status = require('./lib/status/status');

var exports = {};
exports.stats = require('./lib/stats');
exports.brains = require('./lib/brains');
exports.profile = require('./lib/profile');
exports.projectResolver = require('./lib/projectResolver');

exports.getStatus = function (providerName, user, repo, branch, callback) {
  var task = new project(providerName, user, repo, branch);
  return status.getStatus(task, callback);
};

exports.addToQueue = function (providerName, user, repo, branch, callback) {
  logger.info("addToQueue..", providerName, user, repo, branch);

  var task = new project(providerName, user, repo, branch);

  status.getStatus(task, function (err, statusType) {
    if (err) {
      logger.error(err);
      return callback(err);
    }

    logger.debug('status: ', statusType);

    queue.push(task, function (err, res) {
      if (err) {
        logger.error(err);
        return callback(err);
      }

      return callback(err, res);
    });
  });
};

exports.start = function (app, port) {
  logger.info("starting mohi..");

  initGradleWrapperTask.runTask(function (err) {
    if (err) {
      logger.critical('Failed to start mohi server');
      return;
    }

    cronManager.start();

    app.listen(port);

    process.title = 'mohi:' + port;
    logger.info('mohi listening on port', port);
  });

};


module.exports = exports;