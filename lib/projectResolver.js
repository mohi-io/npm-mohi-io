var storage = require('./storage/storage');
var filesystem = require('./filesystem');
var providerFactory = require('./provider/provider');
var systemFactory = require('./system/system');
var manifestResolver = require('./manifestResolver');
var projectInfoResolver = require('./projectInfoResolver');
var projectInfoTask = require('./task/projectInfoTask');
var loggerLib = require('./logger/logger');
var logger = loggerLib.logger;
var _ = require('underscore');
var dependenciesStatusTask = require('./task/dependenciesStatusTask');

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
      logger.error(err);
      return callback(err, null);
    }

    storage.getJsonData(provider, user, repo, 'projectInfo', function (err, object) {
      if (err) {
        logger.error(err);
        return callback(err, null);
      }

      logger.debug('checkProjectDir OK');
      return callback(null, object);
    });
  });
};

exports.checkSupportedSystem = function (providerName, user, repo, callback) {
  checkProvider(providerName, function (err, provider) {
    if (err) {
      logger.error(err);
      return callback(err, null);
    }

    logger.debug("Using provider: ", provider.getProviderName());

    var files = [
      "build.gradle",
      "pom.xml"
    ];

    provider.loadFiles(user, repo, files, function (err, filesContent) {

      if (err) {
        logger.error(err);
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
      logger.error(err);
      return callback(err);
    }

    filesystem.prepareRepoDir(provider, user, repo, function (err, repoDir) {

      var projectLogger = new loggerLib.projectLogger(repoDir + '/data');

      projectLogger.info("Using repository provider: ", provider.getProviderName());

      if (err) {
        logger.error(err);
        projectLogger.errorAndClose('Failed to initialize project from remote repository');
        return callback(err);
      }

      system.prepareRepo(repoDir, function (err, code) {

        if (err) {
          logger.error(err);
          projectLogger.errorAndClose('Failed to initialize ' + system.getSystemName() + ' build system');
          return callback(err);
        }

        projectLogger.info("Using build system: ", system.getSystemName());

        projectInfoTask.runTask(provider, system, user, repo, projectLogger, function (err, code) {

          if (err) {
            logger.error(err);
            projectLogger.errorAndClose('Failed to get project info');
            return callback(err);
          }

          dependenciesStatusTask.runTask(provider, system, user, repo, projectLogger, function (err, code) {

            if (err) {
              logger.error(err);
              projectLogger.errorAndClose('Failed to get project dependencies status');
              return callback(err);
            }

            projectLogger.end();
            return callback(err);
          });
        });
      });
    });
  });
};

exports.getManifest = function (providerName, user, repo, callback) {
  logger.debug('project resolver: getManifest');

  checkProvider(providerName, function (err, provider) {
    if (err) {
      logger.error(err);
      return callback(err, null);
    }

    storage.getJsonData(provider, user, repo, 'projectInfo', function (err, object) {
      if (err) {
        logger.error(err);
        return callback(err, null);
      }

      var projectInfo = projectInfoResolver.loadProjectInfo(object);

      storage.getJsonData(provider, user, repo, 'report', function (err, object) {

        if (err) {
          logger.error(err);
          return callback(err, null, projectInfo);
        }

        var manifest = manifestResolver.loadManifest(object);

        return callback(err, _.extend(manifest, projectInfo));
      });
    });
  });
};

module.exports = exports;
