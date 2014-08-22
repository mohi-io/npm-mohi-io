var exports = {};

exports.manifest = function (count, current, outdated, exceeded, unresolved) {
  this.count = count;
  this.current = current;
  this.outdated = outdated;
  this.exceeded = exceeded;
  this.unresolved = unresolved;

  this.getCount = function () {
    return this.count;
  };

  this.getCurrent = function () {
    return this.current;
  };

  this.getOutdated = function () {
    return this.outdated;
  };

  this.getExceeded = function () {
    return this.exceeded;
  };

  this.getUnresolved = function () {
    return this.unresolved;
  };
};

module.exports = exports;
