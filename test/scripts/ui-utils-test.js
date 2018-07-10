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

var uiUtils = require('../../lib/utils');
describe(chalk.blue('UIUtils'), function() {

  before('setup data', function(done) {
      done();
  });
  after('cleanup data', function(done) {
    done();
  });

  it('Only returns model data when dependencies are not required', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data).to.exist;
      expect(Object.keys(data)).to.deep.equal(['Person']);
      done();
    });
  });
  it('returns model properties', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data).to.exist;
      expect(data.Person).to.exist;
      expect(data.Person.properties).to.exist;
      done();
    });
  });

  it('Populates the RefCodeType', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.salutation).to.exist;
      expect(data.Person.properties.salutation.type).to.equal('string');
      expect(data.Person.properties.salutation.refcodetype).to.equal('Salutation');
      done();
    });
  });

  it('Populates the EnumType', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.designation).to.exist;
      expect(data.Person.properties.designation.type).to.equal('string');
      expect(data.Person.properties.designation.enumtype).to.equal('Designation');
      expect(data.Person.properties.designation.listdata).to.exist.and.be.an('array');
      done();
    });
  });

  it('Populates the `in` validation list', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.gender).to.exist;
      expect(data.Person.properties.gender.type).to.equal('string');
      expect(data.Person.properties.gender.in).to.be.an('array').of.length(3);
      done();
    });
  });

  it('Populates the type for boolean, number and date', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.annualIncome).to.exist;
      expect(data.Person.properties.annualIncome.type).to.equal('number');
      expect(data.Person.properties.minorIndicator).to.exist;
      expect(data.Person.properties.minorIndicator.type).to.equal('boolean');
      expect(data.Person.properties.birthDate).to.exist;
      expect(data.Person.properties.birthDate.type).to.equal('date');
      done();
    });
  });

  it('Populates premitive array property', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.qualifications).to.exist;
      expect(data.Person.properties.qualifications.type).to.equal('array');
      expect(data.Person.properties.qualifications.itemtype).to.equal('string');
      done();
    });
  });

  it('Populates modeltype for composite array property', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.languages).to.exist;
      expect(data.Person.properties.languages.type).to.equal('array');
      expect(data.Person.properties.languages.itemtype).to.equal('model');
      expect(data.Person.properties.languages.modeltype).to.equal('Literal');
      done();
    });
  });

  it('Fields marked hidden are skipped', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties.calculatedScore).to.not.exist;
      done();
    });
  });

  it('Private fields starting _ are skipped when requested', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data.Person.properties._privateField).to.exist;
      uiUtils.extractMeta('Person', {skipSystemFields: true}, function(err, data) {
        expect(data.Person.properties._privateField).to.not.exist;
        done();
      });
    });
  });
  

  it('returns model relations', function(done) {
    uiUtils.extractMeta('Person', {}, function(err, data) {
      expect(data).to.exist;
      expect(data.Person).to.exist;
      expect(data.Person.relations).to.exist;
      expect(data.Person.relations.permanentAddress).to.exist;
      expect(data.Person.relations.permanentAddress.type).to.equal('hasOne');
      expect(data.Person.relations.addresses).to.exist;
      expect(data.Person.relations.addresses.type).to.equal('embedsMany');
      expect(data.Person.relations.department).to.exist;
      expect(data.Person.relations.department.type).to.equal('belongsTo');
      done();
    });
  });

  it('Rerurns dependent models when requested', function(done) {
    uiUtils.extractMeta('Person', {dependencies: true}, function(err, data) {
      expect(data).to.exist;
      expect(Object.keys(data)).to.have.members(['Person', 'Salutation', 'Department', 'Address', 'Literal']);
      done();
    });
  });

  it('Enum model is not returned as dependent', function(done) {
    uiUtils.extractMeta('Person', {dependencies: true}, function(err, data) {
      expect(data).to.exist;
      expect(Object.keys(data)).to.not.have.members(['Designation']);
      done();
    });
  });

  it('Flattened properties are returned when requested', function(done) {
    uiUtils.extractMeta('Person', {flatten: true}, function(err, data) {
      expect(data).to.exist;
      expect(data.id).to.equal('Person');
      expect(data.properties).to.exist;
      expect(data.properties.shippingAddress).to.not.exist;
      expect(data.properties['shippingAddress.line1']).to.exist;
      expect(data.properties['shippingAddress.line2']).to.exist;
      done();
    });
  });

});