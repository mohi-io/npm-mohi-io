var projectInfo = require('./model/projectInfo/projectInfo').projectInfo;
var project = require('./model/projectInfo/project').project;

var exports = {};

var getProperty = function (object, property) {
  if (object.hasOwnProperty(property)) {
    return object[property];
  }

  return null;
};

var getProject = function (object) {
  var group = getProperty(object, 'group');
  var name = getProperty(object, 'name');
  var version = getProperty(object, 'version');
  var description = getProperty(object, 'description');

  return new project(group, name, version, description);
};

exports.loadProjectInfo = function (object) {
  var project = getProject(getProperty(object, 'project'));

  return new projectInfo(project);
};

module.exports = exports;
