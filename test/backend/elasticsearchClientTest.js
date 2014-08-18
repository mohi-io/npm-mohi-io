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
          host: "IP",
          port: 9200,
          weight: 1
        }
      ]
    }
  }
};

var mockConfig2 = {
  "backend": {
    "elasticsearch": {
      "hosts": [
        {
          "protocol": "http",
          "host": "IP",
          "port": 9200,
          "weight": 1
        }
      ]
    }
  }
};

var mockElasticsearch = {
  Client: function Client(config) {
//    console.log(config);
//    console.log('WORKS');
  }
};

describe('elastic search client test', function () {

  before(function () {
    elasticsearchClient.__set__({
      config: mockConfig,
      elasticsearch: mockElasticsearch
    });

//    elasticsearchClient.__set__("config", mockConfig);
//    elasticsearchClient.__set__("elasticsearch", mockElasticsearch);
  });

  it('should create client for elastic search', function (done) {

    var client = elasticsearchClient.client;
    should.exist(client);
    done();
  });

});
