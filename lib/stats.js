var exports = {};
var dependencyCounts = {};


// Recently retrieved manifests ///////////////////////////////////////////////

function RetrievedManifest(provider, user, repo) {
  this.provider = provider;
  this.user = user;
  this.repo = repo;
}

var recentlyRetrievedManifests = [];

exports.updateDependendenciesCounts = function (info) {
  info.deps.forEach(function (dep) {
    dependencyCounts[dep.name] = dependencyCounts[dep.name] || 0;
    dependencyCounts[dep.name]++;
  });

};

exports.updateRecently = function (provider, user, repo) {
  var inList = false;

  for (var i = 0; i < recentlyRetrievedManifests.length; ++i) {

    if (recentlyRetrievedManifests[i].user === user
      && recentlyRetrievedManifests[i].repo === repo
      && recentlyRetrievedManifests[i].provider === provider
      ) {
      recentlyRetrievedManifests.splice(i, 1);
      inList = true;
      break;
    }
  }

  recentlyRetrievedManifests.unshift(new RetrievedManifest(provider, user, repo));

  if (!inList && recentlyRetrievedManifests.length > 10) {
    recentlyRetrievedManifests.pop();
  }
};

exports.getRecentlyRetrievedManifests = function () {
  return recentlyRetrievedManifests.slice();
};

exports.getRecentlyUpdatedPackages = function () {
  return recentlyRetrievedManifests.slice();
};

exports.getRecentlyUpdatedManifests = function () {
  return recentlyRetrievedManifests.slice();
};

exports.getDependencyCounts = function () {
  return JSON.parse(JSON.stringify(dependencyCounts));
};

module.exports = exports;
