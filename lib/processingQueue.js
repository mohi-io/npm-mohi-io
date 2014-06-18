var queue = require('queue');
var logger = require('./logger');
var config = require('config');
var stats = require('./stats');
var projectResolver = require('./projectResolver');
var brains = require('./brains');

var exports = {};

var q = queue({
  timeout: config.processingQueue.timeout,
  concurrency: config.processingQueue.concurrency
});

// listen for events

q.on('success', function (result, job) {
  logger.debug('job finished processing');
});

q.on('end', function () {
  logger.debug('all done');
});

// use the timeout feature to deal with jobs that
// take too long or forget to execute a callback

q.on('timeout', function (next, job) {
  logger.debug('job timed out');
  next();
});

function processingTask(providerName, user, repo, initial, callback) {
  logger.debug('processingTask');

  projectResolver.checkSupportedSystem(providerName, user, repo, function (err, system) {
    if (err) {
      logger.debug(err);
      return callback(err);
    }

    projectResolver.loadProject(providerName, system, user, repo, function (err, system) {

      if (err) {
        return callback(err);
      }

      stats.updateRecently(providerName, user, repo);

      //if not initial then skip update dependencies counts
      if (!initial) {
        return callback(null);
      }

      projectResolver.getManifest(providerName, user, repo, function (err, manifest/*, projectInfo*/) {
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
};

exports.push = function (task) {
  var providerName = task.getProviderName();
  var user = task.getUser();
  var repo = task.getRepo();
  var initial = task.getInitial();

  q.push(function (cb) {
    processingTask(providerName, user, repo, initial, function (err) {
      cb();
    });
  });
};

exports.start = function () {
  q.start();
};


module.exports = exports;
