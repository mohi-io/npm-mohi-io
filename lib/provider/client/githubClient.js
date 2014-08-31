var GitHubApi = require('github');
var config = require('config');

var github = null;

var initClient = function () {

  github = new GitHubApi({
    protocol: config.github.api.protocol,
    host: config.github.api.host,
    version: config.github.api.version,
    pathPrefix: config.github.api.pathPrefix,
    timeout: 5000
  });

  if (config.github.username) {
    github.authenticate({
      type: 'basic',
      username: config.github.username,
      password: config.github.password
    });
  }

  if (config.github.token) {
    github.authenticate({
      type: 'oauth',
      token: config.github.token
    });
  }
};

module.exports.client = function () {
  if (!github) {
    initClient();
  }

  return github;
};
