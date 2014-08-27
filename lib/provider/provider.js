var githubProvider = require('./githubProvider');
var bitbucketProvider = require('./bitbucketProvider');

module.exports.getProvider = function (provider) {
  switch (provider) {
    case 'github':
      return githubProvider;
    case 'bitbucket':
      return bitbucketProvider;
    default :
      throw Error('Unknown repository provider: ' + provider);
  }
};
