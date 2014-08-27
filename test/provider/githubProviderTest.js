var rewire = require('rewire');
var githubProvider = rewire('../../lib/provider/githubProvider');
var project = require('../../lib/model/task/task').task;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var task = new project('github', 'user', 'repo', 'branch');

describe('github provider test', function () {

  before(function () {
  });

  it('should get repo url using github provider', function (done) {
    var url = githubProvider.getRepoUrl(task);
    url.should.equal('https://github.com/user/repo.git');
    done();
  });

  it('should get repo url using github provider', function (done) {
    var providerName = githubProvider.getProviderName();
    providerName.should.equal('github');
    done();
  });

  it('should load files using github provider', function (done) {
    githubProvider.__set__({
      githubClient: {
        repos: {
          getContent: function getContent(data, cb) {
            data.user.should.equal('user');
            data.repo.should.equal('repo');
            data.path.should.equal('file.txt');
            expect(cb).to.be.an('function');

            var res = {
              content: 'file content',
              encoding: 'utf8'
            };

            return cb(null, res);
          }
        }
      }
    });

    var files = ['file.txt'];

    githubProvider.loadFiles(task, files, function (err, res) {
      expect(res).to.have.property('file.txt');
      res['file.txt'].should.equal('file content');
    });

    done();
  });

});
