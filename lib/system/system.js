var gradleSystem = require('./gradleSystem');

var exports = {};

exports.getSystem = function (system) {
  switch (system) {
    case 'settings.gradle':
    case 'build.gradle':
      return gradleSystem;
    case 'maven':
      return null;
    default :
      return null;
  }
};

module.exports = exports;