/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */

var bootstrap = require('../test');
var expect = bootstrap.chai.expect;
var models = bootstrap.app.models;
var chalk = bootstrap.chalk;
var chai = bootstrap.chai;
var api = bootstrap.api;

describe(chalk.blue('grid-config'), function() {
  var testGridConfig = {
    "code": "PersonTable",
    "label": "Users",
    "editorFormUrl": "/components/person-form.html",
    "columns": [{
        "key": "firstName",
        "label": "First Name",
        "type": "string"
      },
      {
        "key": "middleName",
        "label": "Middle Name",
        "type": "string"
      },
      {
        "key": "lastName",
        "label": "Last Name",
        "type": "string"
      },
      {
        "key": "email",
        "label": "E-Mail",
        "type": "string"
      }
    ]
  };
  var testGridConfig1 = {
    "code": "PersonTable1",
    "label": "Users",
    "editorFormUrl": "/components/person-form.html",
    "columns": [{
        "key": "firstName",
        "label": "First Name",
        "type": "string"
      },
      {
        "key": "middleName",
        "label": "Middle Name",
        "type": "string"
      },
      {
        "key": "lastName",
        "label": "Last Name",
        "type": "string"
      },
      {
        "key": "email",
        "label": "E-Mail",
        "type": "string"
      }
    ]
  };

  before('Load test data', function(done) {
    bootstrap.deleteAndCreate(models.GridConfig, [testGridConfig, testGridConfig1], done);
  });

  after('remove test data', function(done) {
    bootstrap.deleteAll(models.GridConfig, done);
  });

  it('should return an error if invalid configCode is provided', function(done) {
    api
      .get(bootstrap.basePath + '/GridConfigs/config/unknownConfig')
      .expect(404).end(function(err, res) {
        var error = res.body.error;
        expect(res.status).to.equal(404);
        expect(error).to.exist;
        expect(error.statusCode).to.equal(404);
        expect(error.code).to.equal('missing-or-invalid-config-code');
        done();
      });
  });

  it('should generate grid config if configCode is a model', function(done) {
    api
      .get(bootstrap.basePath + '/GridConfigs/config/Order')
      .expect(200).end(function(err, res) {
        expect(res.status).to.equal(200);
        var response = res.body;
        expect(response).to.exist;
        expect(response.label).to.exist;
        expect(response.columns).to.exist;
        expect(response.editorFormUrl).to.exist;
        expect(response.columns.length).to.be.equal(4);
        done();
      });
  });

  it('should return the defined grid config', function(done) {
    api
      .get(bootstrap.basePath + '/GridConfigs/config/PersonTable')
      .expect(200).end(function(err, res) {
        var response = res.body;
        expect(response).to.exist;
        expect(response.label).to.exist;
        expect(response.columns).to.exist;
        expect(response.editorFormUrl).to.exist;
        expect(response.columns.length).to.be.equal(4);
        done();
      });
  });
});