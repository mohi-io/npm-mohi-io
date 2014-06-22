var logger = require('../logger/logger').logger;
var config = require('config');
var elasticsearch = require('elasticsearch');
var _ = require('underscore');
var esConfig = _.extend(config.backend.elasticsearch, {"__reused": false});

module.exports.client = new elasticsearch.Client(esConfig);
