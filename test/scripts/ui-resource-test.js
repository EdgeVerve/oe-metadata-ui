/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */
/* jshint -W024 */
/* jshint expr:true */
//to avoid jshint errors for expect

var bootstrap = require('../test');
var expect = bootstrap.chai.expect;
var models = bootstrap.app.models;
var chalk = bootstrap.chalk;
var chai = bootstrap.chai;
var api = bootstrap.api;

describe(chalk.blue('ui-resource tests'), function() {

  var htmlData = {
    name: 'test.html',
    type: 'text/html',
    content: '<html></html>'
  };
  var cssData = {
    name: 'main.css',
    type: 'text/css',
    content: '.root { background: red}'
  };
  var jsonData = {
    name: 'mydata',
    type: 'application/json',
    content: '{"score":100,"subject":"js"}'
  };
  before('prepare test data', function(done) {
    bootstrap.deleteAndCreate(bootstrap.app.models.UIResource, [htmlData, cssData, jsonData], done);
  });

  it('returns 404 for non-existing pages', function(done) {
    var getUrl = bootstrap.basePath + '/UIResources/content/nonexistent.html';
    api.get(getUrl)
      .expect(404)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });


  it('returns html-data with appropriate contentType', function(done) {
    var getUrl = bootstrap.basePath + '/UIResources/content/' + htmlData.name;
    api.get(getUrl)
      .expect(200)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          expect(result.headers['content-type']).to.equal(htmlData.type);
          expect(result.text).to.equal(htmlData.content);
          done();
        }
      });
  });

  it('returns css-data with appropriate contentType', function(done) {
    var getUrl = bootstrap.basePath + '/UIResources/content/' + cssData.name;
    api.get(getUrl)
      .expect(200)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          expect(result.headers['content-type']).to.equal(cssData.type);
          expect(result.text).to.equal(cssData.content);
          done();
        }
      });
  });

  it('returns json-data with appropriate contentType', function(done) {
    var getUrl = bootstrap.basePath + '/UIResources/content/' + jsonData.name;
    api.get(getUrl)
      .expect(200)
      .end(function(err, result) {
        if (err) {
          done(err);
        } else {
          expect(result.headers['content-type']).to.equal(jsonData.type);
          expect(result.text).to.equal(jsonData.content);
          expect(result.body).to.exist;
          expect(result.body.score).to.equal(100);
          expect(result.body.subject).to.equal('js');
          done();
        }
      });
  });

});