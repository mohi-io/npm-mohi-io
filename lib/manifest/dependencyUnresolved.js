var dependency = require('./dependency').dependency;
var exports = {};

exports.dependencyUnresolved = function (name, group, version, reason) {
  dependency.call(this, name, group, version);  //call parent constructor
  this.reason = reason;

  this.getReason = function () {
    return this.reason;
  };
};

//extending base class
exports.dependencyUnresolved.prototype.__proto__ = dependency.prototype;

module.exports = exports;
