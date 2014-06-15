var githubProvider = require('./githubProvider');
var bitbucketProvider = require('./bitbucketProvider');

var exports = {};

exports.getProvider = function (provider) {
  switch (provider) {
    case 'github':
      return githubProvider;
    case 'bitbucket':
      return bitbucketProvider;
    default :
      return null;
  }
};

module.exports = exports;