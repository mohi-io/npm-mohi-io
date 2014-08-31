var logger = require('../logger/logger').logger;
var client = require('../backend/elasticsearchClient').client();
var util = require('util');

var exports = {};

var type = function (task) {
  //TODO branch
  return util.format('%s-%s', task.getUser(), task.getRepo());
};

var exists = function (task, fileName, callback) {
  logger.debug('exists in elastic search');

  client.exists({
    index: task.getProviderName(),
    type: type(task),
    id: fileName
  }, function (err, response) {
//    logger.debug("es exists response: ", response);
    return callback(err, response);
  });
};

var create = function (task, fileName, content, callback) {
  logger.debug('create in elastic search');

  client.create({
    index: task.getProviderName(),
    type: type(task),
    id: fileName,
    body: content
  }, function (err, response) {
//    logger.debug("es create response: ", response);
    return callback(err, response);
  });
};

var update = function (task, fileName, content, callback) {
  logger.debug('update in elastic search');

  client.update({
    index: task.getProviderName(),
    type: type(task),
    id: fileName,
    body: {doc:content}
  }, function (err, response) {
//    logger.debug("es update response: ", response);
    return callback(err, response);
  });
};

exports.getStorageProvider = function () {
  return 'elasticsearch';
};

exports.getJsonData = function (task, fileName, callback) {
  logger.debug('get json data from elastic search');

  client.getSource({
    index: task.getProviderName(),
    type: type(task),
    id: fileName
  }, function (err, response) {
//    logger.debug("es get: ", response);
    return callback(err, response);
  });
};

exports.saveJsonData = function (task, fileName, content, callback) {
  logger.debug('save json data to elastic search');

  exists(task, fileName, function (err, found) {

    if (found) {
      return update(task, fileName, content, callback);
    }

    return create(task, fileName, content, callback);
  });

};

module.exports = exports;
