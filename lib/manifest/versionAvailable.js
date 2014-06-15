var exports = {};

exports.versionAvailable = function (release, milestone, integration) {
  this.release = release;
  this.milestone = milestone;
  this.integration = integration;

  this.getRelease = function () {
    return this.release;
  };

  this.getMilestone = function () {
    return this.milestone;
  };

  this.getIntegration = function () {
    return this.integration;
  };
};

module.exports = exports;
