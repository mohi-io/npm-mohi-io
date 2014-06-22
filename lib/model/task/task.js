var util = require('util');
var SEPARATOR = ':';
var exports = {};

var task = function task(providerName, user, repo, branch) {
  this.providerName = providerName;
  this.user = user;
  this.repo = repo;
  this.branch = branch;

  this.encode = function () {
    return util.format('%s%s%s%s%s%s%s', this.providerName, SEPARATOR, this.user, SEPARATOR, this.repo, SEPARATOR, this.branch);
  };

  this.getProviderName = function () {
    return this.providerName;
  };

  this.getUser = function () {
    return this.user;
  };

  this.getRepo = function () {
    return this.repo;
  };

  this.getBranch = function () {
    return this.branch;
  };
};

exports.decodeTask = function (string) {
  var split = string.split(SEPARATOR);
  return new task(split[0], split[1], split[2], split[3]);
};

exports.task = task;

module.exports = exports;
