var rewire = require('rewire');
var elasticsearchClient = rewire('../../lib/backend/elasticsearchClient');
var chai = require('chai');
var should = chai.should();

var mockConfig = {
  backend: {
    elasticsearch: {
      hosts: [
        {
          protocol: "http",
          host: "IPS",
          port: 9200,
          weight: 1
        }
      ]
    }
  }
};

var mockElasticsearch = {
  Client: function Client(config) {
    config.hosts.should.equal(mockConfig.backend.elasticsearch.hosts);
    config.__reused.should.equal(false);
    return true;
  }
};

elasticsearchClient.__set__({
  config: mockConfig,
  elasticsearch: mockElasticsearch
});

describe('elastic search client test', function () {

  before(function () {
  });

  it('should create client for elastic search', function (done) {

    var client = elasticsearchClient.client();
    should.exist(client);
    done();
  });

});
