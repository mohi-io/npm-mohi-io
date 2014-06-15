var filesystem = require('./filesystem');
var providerFactory = require('./provider/provider');
var systemFactory = require('./system/system');
var manifestResolver = require('./manifestResolver');
var projectInfoResolver = require('./projectInfoResolver');
var logger = require('./logger');
var _ = require('underscore');

var dependenciesStatusTask = require('./task/dependenciesStatusTask');
var projectInfoTask = require('./task/projectInfoTask');

var exports = {};


var checkProvider = function (providerName, callback) {
  var provider = providerFactory.getProvider(providerName);

  if (!provider) {
    return callback(new Error('invalid provider: ' + providerName), null);
  }

  return callback(null, provider);
};

exports.checkProjectDir = function (providerName, user, repo, callback) {
  checkProvider(providerName, function (err, provider) {
    if (err) {
      return callback(err, null);
    }
    filesystem.getJsonData(provider, user, repo, 'report.json', function (err, object) {
      if (err) {
        return callback(err, null);
      }
    });
  });
};

exports.checkSupportedSystem = function (providerName, user, repo, callback) {
  checkProvider(providerName, function (err, provider) {
    if (err) {
      return callback(err, null);
    }

    logger.debug("Using provider: ", provider.getProviderName());

    var files = [
      "build.gradle",
      "pom.xml"
    ];

    provider.loadFiles(user, repo, files, function (err, filesContent) {

      if (err) {
        return callback(err, null);
      }

      var system = null;

      for (var filename in filesContent) {
        if (filesContent.hasOwnProperty(filename)) {

          if (filesContent[filename]) {
            system = systemFactory.getSystem(filename);
            break;
          }
        }
      }

      if (!system) {
        return callback(new Error('unsupported build system (files not found: ' + files + ')'), null);
      }

      return callback(null, system);
    });
  });
};

exports.loadProject = function (providerName, system, user, repo, callback) {
  logger.debug('project resolver: loadProject');

  checkProvider(providerName, function (err, provider) {
    if (err) {
      return callback(err);
    }

    projectInfoTask.runTask(provider, system, user, repo, function (err, code) {
      if (err) {
        return callback(err);
      }

      dependenciesStatusTask.runTask(provider, system, user, repo, function (err, code) {

        if (err) {
          return callback(err);
        }

        return callback(err);
      });
    });
  });
};

exports.getManifest = function (providerName, user, repo, callback) {
  logger.debug('project resolver: getManifest');

  checkProvider(providerName, function (err, provider) {
    if (err) {
      return callback(err, null);
    }

    filesystem.getJsonData(provider, user, repo, 'projectInfo.json', function (err, object) {
      if (err) {
        return callback(err, null);
      }

      var projectInfo = projectInfoResolver.loadProjectInfo(object);

      filesystem.getJsonData(provider, user, repo, 'report.json', function (err, object) {

        if (err) {
          return callback(err, null, projectInfo);
        }

        var manifest = manifestResolver.loadManifest(object);

        return callback(err, _.extend(manifest, projectInfo));
      });
    });
  });
};

module.exports = exports;
