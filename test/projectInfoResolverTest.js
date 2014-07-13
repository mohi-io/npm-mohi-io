var projectInfoResolver = require('../lib/projectInfoResolver');
var fs = require('fs');
var chai = require('chai');
var should = chai.should();

describe('project info resolver test', function () {
  it('should parse projectInfo.json', function (done) {

    fs.readFile('test/data/projectInfo.json', function (err, content) {
      if (err) {
        done(err);
      }

      var projectInfo = projectInfoResolver.loadProjectInfo(JSON.parse(content));

      projectInfo.project.group.should.equal('com.lewisd');
      projectInfo.project.name.should.equal('lint-maven-plugin');
      projectInfo.project.version.should.equal('0.0.9-SNAPSHOT');
      projectInfo.project.description.should.equal('Maven POM lint plugin');

      done();
    });
  });
});
