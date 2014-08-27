var rewire = require('rewire');
var bitbucketProvider = rewire('../../lib/provider/bitbucketProvider');
var project = require('../../lib/model/task/task').task;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var task = new project('bitbucket', 'user', 'repo', 'branch');

describe('bitbucket provider test', function () {

  before(function () {
  });

  it('should get repo url using bitbucket provider', function (done) {
    var url = bitbucketProvider.getRepoUrl(task);
    url.should.equal('https://bitbucket.org/user/repo.git');
    done();
  });

  it('should get repo url using bitbucket provider', function (done) {
    var providerName = bitbucketProvider.getProviderName();
    providerName.should.equal('bitbucket');
    done();
  });

  it('should load files using bitbucket provider', function (done) {
    bitbucketProvider.__set__({
      bitbucketClient: {
        getRepository: function getContent(data, cb) {

          data.owner.should.equal('user');
          data.slug.should.equal('repo');
          expect(cb).to.be.an('function');

          var repo = {
            sources: function (filename, param) {
              filename.should.equal('file.txt');
              param.should.equal('');

              return {
                raw: function (cb) {
                  expect(cb).to.be.an('function');
                  return cb(null, {
                    raw: 'file content'
                  });
                }
              };
            }
          };

          return cb(null, repo);
        }
      }
    });

    var files = ['file.txt'];

    bitbucketProvider.loadFiles(task, files, function (err, res) {
      expect(res).to.have.property('file.txt');
      res['file.txt'].should.equal('file content');
    });

    done();
  });

});
