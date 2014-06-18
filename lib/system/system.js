var gradleSystem = require('./gradleSystem');
var mavenSystem = require('./mavenSystem');

var exports = {};

exports.getSystem = function (system) {
  switch (system) {
    case 'settings.gradle':
    case 'build.gradle':
      return gradleSystem;
    case 'pom.xml':
      return mavenSystem;
    default :
      return null;
  }
};

module.exports = exports;