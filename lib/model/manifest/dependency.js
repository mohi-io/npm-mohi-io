var exports = {};

exports.dependency = function (name, group, version) {
  this.name = name;
  this.group = group;
  this.version = version;

  this.getName = function () {
    return this.name;
  };

  this.getGroup = function () {
    return this.group;
  };

  this.getVersion = function () {
    return this.version;
  };
};


module.exports = exports;
