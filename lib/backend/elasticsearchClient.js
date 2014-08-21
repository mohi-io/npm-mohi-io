var logger = require('../logger/logger').logger;
var config = require('config');
var elasticsearch = require('elasticsearch');
var _ = require('underscore');

module.exports.client = function() {
  var esConfig = _.extend(config.backend.elasticsearch, {"__reused": false});
  return new elasticsearch.Client(esConfig);
};
