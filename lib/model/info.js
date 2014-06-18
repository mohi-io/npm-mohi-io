var exports = {};

exports.info = function (name, required, stable, latest, status, pinned) {
  this.name = name;
  this.required = required;
  this.stable = stable;
  this.latest = latest;
  this.status = status;
  this.pinned = pinned;
};

module.exports = exports;
