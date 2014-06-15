var exports = {};

exports.projectInfo = function (project) {
  this.project = project;

  this.getProject = function () {
    return this.project;
  };
};

module.exports = exports;
