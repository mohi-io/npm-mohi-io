var exports = {};

exports.processingTask = function (providerName, user, repo, initial) {
  this.providerName = providerName;
  this.user = user;
  this.repo = repo;
  this.initial = initial;

  this.getProviderName = function () {
    return this.providerName;
  };

  this.getUser = function () {
    return this.user;
  };

  this.getRepo = function () {
    return this.repo;
  };

  this.getInitial = function () {
    return this.initial;
  };
};

module.exports = exports;
