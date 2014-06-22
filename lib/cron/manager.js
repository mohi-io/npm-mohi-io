var logger = require('../logger/logger').logger;
var config = require('config');
var updateProject = require('./updateProject').updateProject;

var jobs = {
  updateProject: 0
};

module.exports.start = function () {
  logger.info('Start cron jobs');
  jobs.updateProject = setInterval(updateProject, config.cron.updateProject.interval);
};

module.exports.stop = function () {
  logger.info('Stop cron jobs');
  if (jobs.updateProject) {
    clearInterval(jobs.updateProject);
  }
};

