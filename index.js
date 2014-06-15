var logger = require('./lib/logger');
var initGradleWrapperTask = require('./lib/task/initGradleWrapperTask');
var processingQueue = require('./lib/processingQueue');
var processingTask = require('./lib/model/task/processingTask').processingTask;

var exports = {};
exports.stats = require('./lib/stats');
exports.brains = require('./lib/brains');
exports.profile = require('./lib/profile');
exports.projectResolver = require('./lib/projectResolver');

exports.addToQueue = function (providerName, user, repo) {
  logger.info("addToQueue..");

  processingQueue.push(new processingTask(providerName, user, repo, true));
  processingQueue.start();
};

exports.start = function (app, port) {
  logger.info("starting mohi..");

  initGradleWrapperTask.runTask(function (err) {
    if (err) {
      logger.critical('Failed to start mohi server');
      return;
    }

    app.listen(port);

    process.title = 'mohi:' + port;
    logger.info('mohi listening on port', port);
  });

};


module.exports = exports;