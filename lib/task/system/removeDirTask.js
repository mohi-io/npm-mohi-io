var child = require('child_process');
var logger = require('../../logger/logger').logger;

var exports = {};

exports.runTask = function (directories, callback) {

  logger.debug("run remove dir task");

  if (typeof directories === 'string') {
    directories = [directories];
  }

  var args = directories;

  args.unshift('-rf');

  child.execFile('rm', args, {env: process.env}, function (/*err, stdout, stderr*/) {
    callback.apply(this, arguments);
  });
};

module.exports = exports;
