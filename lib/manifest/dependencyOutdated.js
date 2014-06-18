var dependency = require('./dependency').dependency;
var exports = {};

exports.dependencyOutdated = function (name, group, version, available) {
  dependency.call(this, name, group, version);  //call parent constructor
  this.available = available;

  this.getAvailable = function () {
    return this.available;
  };
};

module.exports = exports;
