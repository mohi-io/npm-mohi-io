var spawn = require('child_process').spawn;
var logger = require('../logger');
var config = require('config');

var exports = {};

exports.runTask = function (destDir, callback) {

  var args = [
    '-fR',
    config.gradle.gradlewVendorDir + '/',
    destDir + '/'
  ];

  logger.debug('copyGradlewVendor args: ' + args);

  var copyGradlewVendor = spawn('cp', args, {});

  copyGradlewVendor.stdout.on('data', function (data) {
    logger.debug('copyGradlewVendor stdout: ' + data);
  });

  copyGradlewVendor.stderr.on('data', function (data) {
    logger.debug('copyGradlewVendor stderr: ' + data);
  });

  copyGradlewVendor.on('close', function (code) {
    logger.debug('copyGradlewVendor child process exited with code ' + code);

    if (code > 0) {
      return callback(new Error('copyGradlewVendor child process exited with code ' + code), code);
    }

    return callback(null, code)
  });

};

module.exports = exports;
