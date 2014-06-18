var exports = {};

exports.group = function (count, dependencies) {
  this.count = count;
  this.dependencies = dependencies;

  this.getCount = function () {
    return this.count;
  };

  this.getDependencies = function () {
    return this.dependencies;
  };
};

module.exports = exports;
