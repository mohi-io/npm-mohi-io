var logger = require('../logger/logger').logger;
var config = require('config');
var Job = require('../model/cron/job').Job;

var jobs = [];

var stopJob = function (job) {
  logger.info('stopping job name: ' + job.getName());
  if (job && job.getIntervalId()) {
    clearInterval(job.getIntervalId());
  }
};

var startJob = function (name) {
  logger.info('starting job name: ' + name);

  var execute = require('./' + name).execute;
  var intervalId = setInterval(execute, config.cron[name].interval);
  var job = new Job(name, new Date(), config.cron[name].interval, intervalId);
  jobs.push(job);
};

module.exports.status = function () {
  return jobs;
};

module.exports.start = function () {
  logger.info('Start cron jobs');

  for (var name in config.cron) {
    if (config.cron.hasOwnProperty(name)) {
      startJob(name);
    }
  }
};

module.exports.stop = function () {
  logger.info('Stop cron jobs');

  while (jobs.length > 0) {
    stopJob(jobs.pop());
  }
};

