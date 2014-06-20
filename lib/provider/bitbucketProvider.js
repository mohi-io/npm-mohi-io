var bitbucket = require('bitbucket-api');
var config = require('config');
var async = require('async');
var util = require('util');
var logger = require('../logger/logger').logger;

var exports = {};

var credentials = {
  username: config.bitbucket.username,
  password: config.bitbucket.password
};

var client = bitbucket.createClient(credentials);

exports.loadFiles = function (user, repo, files, callback) {

  var getContent = function (filename, callbackContent) {
    client.getRepository({slug: repo, owner: user}, function (err, repo) {
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

exports.getRepoUrl = function (user, repo) {
  return util.format('https://bitbucket.org/%s/%s.git', user, repo);
};

exports.getProviderName = function () {
  return 'bitbucket';
};

module.exports = exports;
