module.exports = function (grunt) {

  grunt.initConfig({

    conf: require("config"),
    pkg: grunt.file.readJSON("package.json"),

    // Lint the server JavaScript
    jshint: {
      files: ["index.js", "lib/*.js", "lib/**/*.js", "!test/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    }
  });

  // Load the grunt plugins
  grunt.loadNpmTasks("grunt-contrib-jshint")

  grunt.registerTask("base", ["jshint"])
  grunt.registerTask("default", ["base"])
};
