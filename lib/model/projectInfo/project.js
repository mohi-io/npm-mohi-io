var exports = {};

exports.project = function (group, name, version, description) {
  this.group = group;
  this.name = name;
  this.version = version;
  this.description = description;

  this.getName = function () {
    return this.name;
  };

  this.getGroup = function () {
    return this.group;
  };

  this.getVersion = function () {
    return this.version;
  };

  this.getDescription = function () {
    return this.description;
  };
};

module.exports = exports;
