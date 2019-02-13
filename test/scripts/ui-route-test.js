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

describe(chalk.blue('ui-route tests'), function() {

  var routeData = [{
    type: 'page',
    name: 'homepage',
    path: '/homepage',
    import: '/pages/homepage.html'
  }, {
    type: 'elem',
    name: 'customer-form',
    path: '/customer-form',
    import: '/elements/customer-form.html'
  }];
  before('prepare test data', function(done) {
    bootstrap.deleteAndCreate(models.UIRoute, routeData, done);
  });
  after('cleanup test data', function(done) {
    bootstrap.deleteAll(models.UIRoute, done);
  });

  it('Returns data for normal get-api', function(done){
    api
      .get(bootstrap.basePath + '/UIRoutes?filter={"where":{"type":"page"}}')
      .set('Accept', 'application/json')
      .expect(200).end(function(err, res) {
        expect(err).to.be.not.ok;
        expect(res.status).to.equal(200);
        var routes = res.body;
        expect(routes).to.be.an('array').of.length(1);
        expect(routes[0].path).to.equal(routeData[0].path);
        done();
      });
  });
  
  it('Request is redirected when a specified route is requested', function(done){
    api
      .get(routeData[1].path)
      .expect(302).end(function(err, res) {
        expect(err).to.be.not.ok;
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal(bootstrap.app.get('subPath')+'/?redirectTo=' + encodeURIComponent(routeData[1].path));
        done();
      });
  });
});