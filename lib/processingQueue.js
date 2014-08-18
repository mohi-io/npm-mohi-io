var queue = require('queue');
var logger = require('./logger/logger').logger;
var config = require('config');
var stats = require('./stats');
var projectResolver = require('./projectResolver');
var brains = require('./brains');
var status = require('./status/status');
var StatusType = require('./status/type').StatusType;

var exports = {};

var q = queue({
  timeout: config.processingQueue.timeout,
  concurrency: config.processingQueue.concurrency
});

// listen for events

q.on('success', function (result) {
  logger.debug('job finished processing with result: ' + result);
});

q.on('end', function () {
  logger.debug('all done');
});

// use the timeout feature to deal with jobs that
// take too long or forget to execute a callback

q.on('timeout', function (next, job) {
  logger.debug('job timed out: ' + job);
  next();
});

function processingTask(task, callback) {
  logger.debug('processingTask');

  projectResolver.checkSupportedSystem(task, function (err, system) {
    if (err) {
      logger.debug(err);

      status.updateStatus(task, StatusType.Type.NOT_SUPPORTED.getId(), function (err) {
        logger.debug(err);
      });

      return callback(err);
    }

    projectResolver.loadProject(system, task, function (err) {

      if (err) {
        status.updateStatus(task, StatusType.Type.UNKNOWN.getId(), function (err) {
          logger.debug(err);
        });

        return callback(err);
      }

      stats.updateRecently(task);

      projectResolver.getManifest(task, function (err, manifest/*, projectInfo*/) {
        if (err) {
          return callback(err);
        }

        brains.getInfo(manifest, {}, function (err, info) {
          if (err) {
            return callback(err);
          }

          stats.updateDependendenciesCounts(info);
          return callback(null);
        });

      });
    });
  });
}

exports.push = function (task) {
  q.push(function (cb) {
    processingTask(task, function (err) {
      if (err) {
        logger.error(err);
      }
      cb();
    });
  });
};

exports.start = function () {
  q.start();
};


module.exports = exports;
