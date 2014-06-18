var exports = {};

exports.totals = function (upToDate, outOfDate, pinned, unpinned) {
  this.upToDate = upToDate;
  this.outOfDate = outOfDate;
  this.pinned = pinned;
  this.unpinned = unpinned;

  this.getUpToDate = function () {
    return this.upToDate;
  };

  this.getOutOfDate = function () {
    return this.outOfDate;
  };

  this.getPinned = function () {
    return this.pinned;
  };

  this.getUnpinned = function () {
    return this.unpinned;
  };

};

module.exports = exports;
