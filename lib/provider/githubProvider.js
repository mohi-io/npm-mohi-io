var async = require('async');
var util = require('util');
var logger = require('../logger/logger').logger;
var githubClient = require('./client/githubClient').client();

var exports = {};

exports.loadFiles = function (task, files, callback) {

  logger.debug("loadFiles", task.getUser(), task.getRepo(), files);

  var getContent = function (filename, callbackContent) {
    logger.debug("getContent: " + filename);

    githubClient.repos.getContent({user: task.getUser(), repo: task.getRepo(), path: filename}, function (err, resp) {

      if (err) {
        return callbackContent(null, null);
      }

      return callbackContent(null, new Buffer(resp.content, resp.encoding).toString());
    });
  };

  async.map(files, getContent, function (err, results) {
    if (err) {
      return callback(err, null);
    }

    var filesContent = {};

    files.forEach(function (item) {
      filesContent[item] = results.shift()
    });

    return callback(err, filesContent);
  });
};

exports.getRepoUrl = function (task) {
  return util.format('https://github.com/%s/%s.git', task.getUser(), task.getRepo());
};

exports.getProviderName = function () {
  return 'github';
};

module.exports = exports;
