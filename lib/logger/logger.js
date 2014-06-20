var Log = require('log');
var fs = require('fs');

module.exports.logger = new Log('debug', '');

module.exports.projectLogger = function (dataDir) {
  this.file = fs.createWriteStream(dataDir + '/build.log');
  this.logger = new Log('info', this.file);

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