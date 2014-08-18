var exports = {};
var dependencyCounts = {};


// Recently retrieved manifests ///////////////////////////////////////////////

function RetrievedManifest(task) {
  this.provider = task.getProviderName();
  this.user = task.getUser();
  this.repo = task.getRepo();
}

var recentlyRetrievedManifests = [];

exports.updateDependendenciesCounts = function (info) {
  info.deps.forEach(function (dep) {
    dependencyCounts[dep.name] = dependencyCounts[dep.name] || 0;
    dependencyCounts[dep.name]++;
  });

};

exports.updateRecently = function (task) {
  var inList = false;

  var providerName = task.getProviderName();
  var user = task.getUser();
  var repo = task.getRepo();

  for (var i = 0; i < recentlyRetrievedManifests.length; ++i) {

    if (recentlyRetrievedManifests[i].user === user &&
      recentlyRetrievedManifests[i].repo === repo &&
      recentlyRetrievedManifests[i].provider === providerName
      ) {
      recentlyRetrievedManifests.splice(i, 1);
      inList = true;
      break;
    }
  }

  recentlyRetrievedManifests.unshift(new RetrievedManifest(task));

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
