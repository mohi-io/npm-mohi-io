var exports = {};

exports.Job = function Job(name, started, interval, intervalId) {
  this.name = name;
  this.started = started;
  this.interval = interval;
  this.intervalId = intervalId;

  this.getName = function () {
    return this.name;
  };

  this.getStarted = function () {
    return this.started;
  };

  this.getInterval = function () {
    return this.interval;
  };

  this.getIntervalId = function () {
    return this.intervalId;
  };
};

module.exports = exports;
