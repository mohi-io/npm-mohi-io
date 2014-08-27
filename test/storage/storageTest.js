var rewire = require('rewire');
var storage = rewire('../../lib/storage/storage');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('storage test', function () {

  before(function () {
  });

  it('should create file storage', function (done) {

    var mockFileStorageConfig = {
      storage: {
        type: "file"
      }
    };

    storage.__set__({
      config: mockFileStorageConfig
    });

    var storageProvider = storage.getStorageProvider();
    storageProvider.should.equal('file');
    done();
  });

  it('should create elasticsearch storage', function (done) {

    var mockElasticSearchStorageConfig = {
      storage: {
        type: "elasticsearch"
      }
    };

    storage.__set__({
      config: mockElasticSearchStorageConfig
    });

    var storageProvider = storage.getStorageProvider();
    storageProvider.should.equal('elasticsearch');
    done();
  });

  it('should throw exception on unknown storage type', function (done) {

    var mockUnknownStorageConfig = {
      storage: {
        type: "unknown"
      }
    };

    storage.__set__({
      config: mockUnknownStorageConfig
    });

    expect(function () {
      storage.getStorageProvider();
    }).to.throw('Unknown storage type: unknown');

    done();
  });

});
