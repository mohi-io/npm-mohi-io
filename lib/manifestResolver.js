var manifest = require('./model/manifest/manifest').manifest;
var dependency = require('./model/manifest/dependency').dependency;
var dependencyOutdated = require('./model/manifest/dependencyOutdated').dependencyOutdated;
var dependencyLatest = require('./model/manifest/dependencyLatest').dependencyLatest;
var dependencyUnresolved = require('./model/manifest/dependencyUnresolved').dependencyUnresolved;
var group = require('./model/manifest/group').group;
var versionAvailable = require('./model/manifest/versionAvailable').versionAvailable;

var exports = {};

var getProperty = function (object, property) {
  if (object.hasOwnProperty(property)) {
    return object[property];
  }

  return null;
};

var getCurrentDependency = function (depObject) {
  var name = getProperty(depObject, 'name');
  var group = getProperty(depObject, 'group');
  var version = getProperty(depObject, 'version');

  return new dependency(name, group, version);
};

var getOutdatedDependency = function (depObject) {
  var name = getProperty(depObject, 'name');
  var group = getProperty(depObject, 'group');
  var version = getProperty(depObject, 'version');

  var available = getVersionAvailable(depObject);

  return new dependencyOutdated(name, group, version, available);
};

var getUnresolvedDependency = function (depObject) {
  var name = getProperty(depObject, 'name');
  var group = getProperty(depObject, 'group');
  var version = getProperty(depObject, 'version');
  var reason = getProperty(depObject, 'reason');

  return new dependencyUnresolved(name, group, version, reason);
};

var getVersionAvailable = function (depObject) {
  var availableObject = getProperty(depObject, 'available');

  if (!availableObject) {
    //TODO logger
    return null;
  }

  var release = getProperty(availableObject, 'release');
  var milestone = getProperty(availableObject, 'milestone');
  var integration = getProperty(availableObject, 'integration');

  return new versionAvailable(release, milestone, integration);
};

var getExceededDependency = function (depObject) {
  var name = getProperty(depObject, 'name');
  var group = getProperty(depObject, 'group');
  var version = getProperty(depObject, 'version');
  var latest = getProperty(depObject, 'latest');

  return new dependencyLatest(name, group, version, latest);
};

var getCurrentDependencies = function (object) {
  var dependencies = [];

  if (!object) {
    return new group(0, dependencies);
  }

  var count = getProperty(object, 'count');
  var currentList = getProperty(object, 'dependencies');

  if (!currentList) {
    return new group(0, dependencies);
  }

  for (var i in currentList) {
    if (currentList.hasOwnProperty(i)) {

      var dep = currentList[i];

      if (dep) {
        dependencies.push(getCurrentDependency(dep));
      }
    }
  }

  return new group(count, dependencies);
};

var getOutdatedDependencies = function (object) {
  var dependencies = [];

  if (!object) {
    return new group(0, dependencies);
  }

  var count = getProperty(object, 'count');
  var outdatedList = getProperty(object, 'dependencies');

  if (!outdatedList) {
    return new group(0, dependencies);
  }

  for (var i in outdatedList) {
    if (outdatedList.hasOwnProperty(i)) {

      var dep = outdatedList[i];

      if (dep) {
        dependencies.push(getOutdatedDependency(dep));
      }
    }
  }

  return new group(count, dependencies);
};

var getUnresolvedDependencies = function (object) {
  var dependencies = [];

  if (!object) {
    return new group(0, dependencies);
  }

  var count = getProperty(object, 'count');
  var outdatedList = getProperty(object, 'dependencies');

  if (!outdatedList) {
    return new group(0, dependencies);
  }

  for (var i in outdatedList) {
    if (outdatedList.hasOwnProperty(i)) {

      var dep = outdatedList[i];

      if (dep) {
        dependencies.push(getUnresolvedDependency(dep));
      }
    }
  }

  return new group(count, dependencies);
};

var getExceededDependencies = function (object) {
  var dependencies = [];

  if (!object) {
    return new group(0, dependencies);
  }

  var count = getProperty(object, 'count');
  var exceededList = getProperty(object, 'dependencies');

  if (!exceededList) {
    return new group(0, dependencies);
  }

  for (var i in exceededList) {
    if (exceededList.hasOwnProperty(i)) {

      var dep = exceededList[i];

      if (dep) {
        dependencies.push(getExceededDependency(dep));
      }
    }
  }

  return new group(count, dependencies);
};

exports.loadManifest = function (object) {
  var count = getProperty(object, 'count');
  var current = getCurrentDependencies(getProperty(object, 'current'));
  var exceeded = getExceededDependencies(getProperty(object, 'exceeded'));
  var outdated = getOutdatedDependencies(getProperty(object, 'outdated'));
  var unresolved = getUnresolvedDependencies(getProperty(object, 'unresolved'));

  return new manifest(count, current, outdated, exceeded, unresolved);
};

module.exports = exports;
