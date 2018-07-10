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

var accessToken;
describe(chalk.blue('ui-manager-test'), function () {

  before('prepare test data', function (done) {
      done();
  });

  after('cleanup data', function(done) {
    bootstrap.deleteAll(models.UIComponent, function(err) {
      bootstrap.deleteAll(models.UIRoute, function(err) {
        bootstrap.deleteAll(models.NavigationLink, done);
      });
    });
  });


  it('Creates the UIRoute, NavigationLink and UIComponent entries', function (done) {
    var postUrl = bootstrap.basePath + '/UIManagers/generate/Literal';
    api
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .post(postUrl)
      .send({})
      .expect(200)
      .end(function (err, result) {
        if (err) {
          done(err);
        } else {
          expect(result.body).to.exist;
          expect(result.body.status).to.be.true;
          expect(result.body.messages).to.exist.and.be.an('array');
          expect(result.body.messages.length).to.equal(3);
          expect(result.body.messages).all.to.satisfy(function(item){
            return item.endsWith('-created');  
          });
          done();
        }
      });
  });

  it('Returns error if model is not found', function (done) {
    var postUrl = bootstrap.basePath + '/UIManagers/generate/InvalidModel';
    api
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .post(postUrl)
      .send({})
      .expect(422)
      .end(function (err, result) {
        if (err) {
          done(err);
        } else {
          expect(result.body).to.exist;
          expect(result.body.error).to.exist;
          expect(result.body.error.statusCode).to.equal(422);
          expect(result.body.error.message).to.equal('invalid-model-name');
          done();
        }
      });
  });


  it('Calling /generate second time returns appropriate message', function (done) {
    var postUrl = bootstrap.basePath + '/UIManagers/generate/Literal';
    api
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .post(postUrl)
      .send({})
      .expect(200)
      .end(function (err, result) {
        if (err) {
          done(err);
        } else {          
          expect(result.body).to.exist;
          expect(result.body.status).to.be.true;
          expect(result.body.messages).to.exist.and.be.an('array');
          expect(result.body.messages.length).to.equal(3);
          expect(result.body.messages).all.to.satisfy(function(item){
            return item.endsWith('-already-defined');  
          });
          done();
        }
      });
  });
});
