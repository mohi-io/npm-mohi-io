var bitbucket = require('bitbucket-api');
var config = require('config');
var client = null;

var initClient = function () {
  var credentials = {
    username: config.bitbucket.username,
    password: config.bitbucket.password
  };

  client = bitbucket.createClient(credentials);
};

module.exports.client = function () {
  if (!client) {
    initClient();
  }

  return client;
};
