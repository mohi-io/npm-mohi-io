var exports = {};

exports.totalsUnpinned = function (upToDate, outOfDate) {
  this.upToDate = upToDate;
  this.outOfDate = outOfDate;

  this.getUpToDate = function () {
    return this.upToDate;
  };

  this.getOutOfDate = function () {
    return this.outOfDate;
  };

};

module.exports = exports;
