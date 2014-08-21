var logger = require('./../logger/logger').logger;
var config = require('config');
var redis = require("redis");

//redisClient.on("error", function (err) {
//  logger.error("Redis error: " + err);
//  TODO handle error
//});

//cause Error TypeError: Object 1 has no method 'indexOf'
//redisClient.monitor(function (err, res) {
//  logger.info("Entering monitoring mode.");
//});
//
//redisClient.on("monitor", function (time, args) {
//  logger.debug(args);
//});


module.exports.client = function () {
  var masterHost = config.backend.redis.hosts[0].host;
  var masterPort = config.backend.redis.hosts[0].port;

  return redis.createClient(masterPort, masterHost, config.backend.redis.options);
};
