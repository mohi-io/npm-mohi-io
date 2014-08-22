var dependency = require('./dependency').dependency;
var exports = {};

exports.dependencyLatest = function (name, group, version, latest) {
  dependency.call(this, name, group, version);  //call parent constructor
  this.latest = latest;

  this.getLatest = function () {
    return this.latest;
  };
};

module.exports = exports;
