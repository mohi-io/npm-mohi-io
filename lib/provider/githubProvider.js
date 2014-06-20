var GitHubApi = require('github');
var config = require('config');
var async = require('async');
var util = require('util');
var logger = require('../logger/logger');

var exports = {};

var github = new GitHubApi({
  protocol: config.github.api.protocol,
  host: config.github.api.host,
  version: config.github.api.version,
  pathPrefix: config.github.api.pathPrefix,
  timeout: 5000
});

if (config.github.username) {
  github.authenticate({
    type: 'basic',
    username: config.github.username,
    password: config.github.password
  });
}

if (config.github.token) {
  github.authenticate({
    type: 'oauth',
    token: config.github.token
  });
}

exports.loadFiles = function (user, repo, files, callback) {

  logger.debug("loadFiles", user, repo, files);

  var getContent = function (filename, callbackContent) {
    logger.debug("getContent: " + filename);

    github.repos.getContent({user: user, repo: repo, path: filename}, function (err, resp) {

      if (err) {
        return callbackContent(null, null);
      }

      return callbackContent(null, new Buffer(resp.content, resp.encoding).toString());
    });
  };

  async.map(files, getContent, function (err, results) {
    if (err) {
      callback(err, null);
      return;
    }

    var filesContent = {};

    files.forEach(function (item) {
      filesContent[item] = results.shift()
    });

    return callback(err, filesContent);
  });
};

exports.getRepoUrl = function (user, repo) {
  return util.format('https://github.com/%s/%s.git', user, repo);
};

exports.getProviderName = function () {
  return 'github';
};

module.exports = exports;
