var exports = {};

exports.getSystemName = function () {
  return "gradle";
};

exports.prepareRepo = function (repoDir, callback) {
  return callback(null, null);
};

module.exports = exports;
