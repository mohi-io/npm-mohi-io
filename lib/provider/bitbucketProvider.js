var config = require('config');
var async = require('async');
var util = require('util');
var logger = require('../logger/logger').logger;
var bitbucketClient = require('./client/bitbucketClient').client();

var exports = {};

exports.loadFiles = function (task, files, callback) {

  var getContent = function (filename, callbackContent) {
    bitbucketClient.getRepository({slug: task.getRepo(), owner: task.getUser()}, function (err, repo) {
      if (err) {
        return callbackContent(null, null);
      }

      repo.sources(filename, '').raw(function (err, resp) {
        return callbackContent(null, resp.raw);
      });
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

exports.getRepoUrl = function (task) {
  return util.format('https://bitbucket.org/%s/%s.git', task.getUser(), task.getRepo());
};

exports.getProviderName = function () {
  return 'bitbucket';
};

module.exports = exports;
