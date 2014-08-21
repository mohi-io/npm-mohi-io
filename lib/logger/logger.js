var Log = require('log');
var fs = require('fs');
var config = require('config');

module.exports.logger = new Log(config.logger.level, '');

module.exports.projectLogger = function (dataDir) {
  this.file = fs.createWriteStream(dataDir + '/build.log');
  this.logger = new Log(config.projectLogger.level, this.file);

  this.end = function () {
    this.file.end();
    this.logger = null;
  };

  this.info = function (msg) {
    if (this.logger) {
      this.logger.info(msg);
    }
  };

  this.error = function (msg) {
    if (this.logger) {
      this.logger.error(msg);
    }
  };

  this.errorAndClose = function (msg) {
    if (this.logger) {
      this.logger.error(msg);
      this.end();
    }
  };

};