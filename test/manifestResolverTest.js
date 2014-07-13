var manifestResolver = require('../lib/manifestResolver');
var fs = require('fs');
var chai = require('chai');
var should = chai.should();

var manifest = null;

describe('manifest resolver test', function () {
  before(function () {
    //get data for test (call sync because this can't by async
    var data = fs.readFileSync('test/data/report.json');
    manifest = manifestResolver.loadManifest(JSON.parse(data));
  });

  it('should parse current section of report.json', function (done) {

    manifest.current.dependencies.should.have.length(2);
    manifest.current.count.should.equal(2);
    var currentDep01 = manifest.current.dependencies[0];

    currentDep01.group.should.equal('commons-jxpath');
    currentDep01.version.should.equal('1.3');
    currentDep01.name.should.equal('commons-jxpath');

    var currentDep02 = manifest.current.dependencies[1];

    currentDep02.group.should.equal('commons-validator');
    currentDep02.version.should.equal('1.4.0');
    currentDep02.name.should.equal('commons-validator');

    done();
  });

  it('should parse exceeded section of report.json', function (done) {

    manifest.exceeded.dependencies.should.have.length(2);
    manifest.exceeded.count.should.equal(2);
    var exceededDep01 = manifest.exceeded.dependencies[0];

    exceededDep01.group.should.equal('com.google.collections');
    exceededDep01.latest.should.equal('1.0-rc2');
    exceededDep01.version.should.equal('1.0');
    exceededDep01.name.should.equal('google-collections');

    var exceededDep02 = manifest.exceeded.dependencies[1];

    exceededDep02.group.should.equal('org.apache.velocity');
    exceededDep02.latest.should.equal('1.7-beta1');
    exceededDep02.version.should.equal('1.7');
    exceededDep02.name.should.equal('velocity');

    done();
  });

  it('should parse outdated section of report.json', function (done) {

    manifest.outdated.dependencies.should.have.length(2);
    manifest.outdated.count.should.equal(2);
    var outdatedDep01 = manifest.outdated.dependencies[0];

    outdatedDep01.group.should.equal('com.google.guava');
    outdatedDep01.available.release.should.equal('17.0');
//    outdatedDep01.available.milestone.should.equal(null);
//    outdatedDep01.available.integration.should.equal(null);
    outdatedDep01.version.should.equal('12.0');
    outdatedDep01.name.should.equal('guava');

    var outdatedDep02 = manifest.outdated.dependencies[1];

    outdatedDep02.group.should.equal('com.thoughtworks.xstream');
    outdatedDep02.available.release.should.equal('1.4.7');
//    outdatedDep02.available.milestone.should.equal(null);
//    outdatedDep02.available.integration.should.equal(null);
    outdatedDep02.version.should.equal('1.4.2');
    outdatedDep02.name.should.equal('xstream');

    done();
  });

  it('should parse unresolved section of report.json', function (done) {

    manifest.unresolved.dependencies.should.have.length(1);
    manifest.unresolved.count.should.equal(1);
    var unresolvedDep01 = manifest.unresolved.dependencies[0];

    unresolvedDep01.group.should.equal('com.github.zenedith');
    unresolvedDep01.version.should.equal('0.5-beta-2');
    unresolvedDep01.reason.should.equal('Could not find any version that matches com.github.zenedith:gradle-versions-plugin:latest.release.');
    unresolvedDep01.name.should.equal('gradle-versions-plugin');

    done();
  });

});
