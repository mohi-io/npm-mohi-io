var dependency = require('./dependency').dependency;

var dependencyUnresolved = function (name, group, version, reason) {
  dependency.call(this, name, group, version);  //call parent constructor
  this.reason = reason;

  this.getReason = function () {
    return this.reason;
  };
};

//extending base class
//exports.dependencyUnresolved.prototype.__proto__ = dependency.prototype;
//Object.setPrototypeOf(dependencyUnresolved, dependency.prototype);

module.exports.dependencyUnresolved = dependencyUnresolved;
