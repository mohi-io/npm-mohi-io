var logger = require('../logger/logger').logger;
var config = require('config');
var elasticsearch = require('elasticsearch');
var _ = require('underscore');
var esConfig = _.extend(config.storage.elasticsearch, {"__reused": false});
var util = require('util');

var client = new elasticsearch.Client(esConfig);
var exports = {};


var type = function (user, repo) {
  return util.format('%s-%s', user, repo);
};

var exists = function (provider, user, repo, fileName, callback) {
  logger.debug('exists in elastic search');

  client.exists({
    index: provider.getProviderName(),
    type: type(user, repo),
    id: fileName
  }, function (err, response) {
//    logger.debug("es exists response: ", response);
    return callback(err, response);
  });
};

var create = function (provider, user, repo, fileName, content, callback) {
  logger.debug('create in elastic search');

  client.create({
    index: provider.getProviderName(),
    type: type(user, repo),
    id: fileName,
    body: content
  }, function (err, response) {
//    logger.debug("es create response: ", response);
    return callback(err, response);
  });
};

var update = function (provider, user, repo, fileName, content, callback) {
  logger.debug('update in elastic search');

  client.update({
    index: provider.getProviderName(),
    type: type(user, repo),
    id: fileName,
    body: {doc:content}
  }, function (err, response) {
//    logger.debug("es update response: ", response);
    return callback(err, response);
  });
};


exports.getStorageName = function () {
  return 'elasticsearch';
};

exports.getJsonData = function (provider, user, repo, fileName, callback) {
  logger.debug('get json data from elastic search');

  client.getSource({
    index: provider.getProviderName(),
    type: type(user, repo),
    id: fileName
  }, function (err, response) {
//    logger.debug("es get: ", response);
    return callback(err, response);
  });
};

exports.saveJsonData = function (provider, user, repo, fileName, content, callback) {
  logger.debug('save json data to elastic search');

  exists(provider, user, repo, fileName, function (err, found) {

    if (found) {
      return update(provider, user, repo, fileName, content, callback);
    }

    return create(provider, user, repo, fileName, content, callback);
  });

};


exports.delete = function (provider, user, repo, fileName, callback) {
  logger.debug('delete from elastic search');

  client.delete({
    index: provider.getProviderName(),
    type: type(user, repo),
    id: fileName
  }, function (err, response) {
//    logger.debug("es delete response: ", response);
    return callback(err, response);
  });
};

module.exports = exports;
