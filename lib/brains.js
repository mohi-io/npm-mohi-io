var config = require('config');

var getDependencyName = function(dependency) {
  return dependency.getGroup() + ':' + dependency.getName();
};

var isExcludedDependency = function(info) {
  return (config.dependencies.excluded.indexOf(info.name) > -1);
};

module.exports.getInfo = function (manifest, opts, cb) {
  // Allow cb to be passed as second parameter
  if (!cb) {
    cb = opts
    opts = {}
  } else {
    opts = opts || {}
  }

  var depList = [];
  var totals = {
    upToDate: 0,
    outOfDate: 0,
    pinned: {
      upToDate: 0,
      outOfDate: 0
    },
    unpinned: {
      upToDate: 0,
      outOfDate: 0
    }
  };

  var current = manifest.getCurrent();

  if (current.getCount() > 0) {
    current.getDependencies().forEach(function (dependency) {
      var info = {
        name: getDependencyName(dependency),
        required: dependency.getVersion(),
        stable: '',
        latest: dependency.getVersion(),
        status: 'uptodate',
        pinned: false
      };

      if (!isExcludedDependency(info)) {
        depList.push(info);
        totals.upToDate++;
      }
    });
  }

  var outdated = manifest.getOutdated();

  if (outdated.getCount() > 0) {
    outdated.getDependencies().forEach(function (dependency) {
      var available = dependency.getAvailable().getRelease();

      if (!available) {
        available = dependency.getAvailable().getMilestone();

        if (!available) {
          available = dependency.getAvailable().getIntegration();
        }
      }

      var info = {
        name: getDependencyName(dependency),
        required: dependency.getVersion(),
        stable: '',
        latest: available,
        status: 'outofdate',
        pinned: false
      };

      if (!isExcludedDependency(info)) {
        depList.push(info);
        totals.unpinned.outOfDate++;
      }
    });
  }

  var exceeded = manifest.getExceeded();

  if (exceeded.getCount() > 0) {
    exceeded.getDependencies().forEach(function (dependency) {

      var info = {
        name: getDependencyName(dependency),
        required: dependency.getVersion(),
        stable: '',
        latest: dependency.getLatest(),
        status: 'outofdate',
        pinned: true
      };

      if (!isExcludedDependency(info)) {
        depList.push(info);
        totals.pinned.outOfDate++;
      }
    });
  }

  var unresolved = manifest.getUnresolved();

  if (unresolved.getCount() > 0) {
    unresolved.getDependencies().forEach(function (dependency) {

      var info = {
        name: getDependencyName(dependency),
        required: dependency.getVersion(),
        stable: '',
        latest: '',
        status: 'outofdate',
        pinned: true
      };

      if (!isExcludedDependency(info)) {
        depList.push(info);
        totals.pinned.outOfDate++;
      }
    });
  }


//// Figure out the overall status for this manifest
  var status = 'uptodate';

  if (depList.length > 0 && totals.unpinned.outOfDate > 0) {

    if (totals.unpinned.outOfDate / depList.length > 0.25) {
      status = 'outofdate';
    } else {
      status = 'notsouptodate';
    }
  }

  cb(null, {status: status, deps: depList, totals: totals});
};
