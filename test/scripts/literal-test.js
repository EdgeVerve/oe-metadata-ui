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

describe(chalk.blue('literal tests'), function () {
  var data = [{
    'key': 'Auth Scheme',
    'value': 'Auth Scheme'
  },
  {
    'key': 'rangeOverflow',
    'value': 'Must be max $max$ characters'
  },
  {
    'key': 'rangeOverflow',
    'value': 'Value should be $max$ characters long',
    'locale': 'en-US',
    'group': 'testgroup'
  },
  {
    'key': 'rangeUnderflow',
    'value': 'Min $min$ allowed for $field$',
    'placeholders': ['field', 'min']
  },
  {
    'key': 'valueMissing',
    'value': 'Value is required for this field',
    'locale': 'en-US',
    'group': 'testgroup'
  }
  ];

  before('setup test data', function (done) {
    bootstrap.deleteAndCreate(models.Literal, data, function (err) {
      done(err);
    });
  });

  it('populates placeholder data', function (done) {
    api.get(bootstrap.basePath + '/Literals')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.be.an.array;
        var rangeOverflow = result.find(function (item) {
          return item.key === 'rangeOverflow';
        });
        expect(rangeOverflow.placeholders).to.be.ok;
        expect(rangeOverflow.placeholders).to.have.key('max');
        expect(rangeOverflow.placeholders.max).to.deep.equal({
          content: '$1'
        });
        done();
      });
  });

  it('If placeholders are specified as array, ordering is maintained', function (done) {
    api.get(bootstrap.basePath + '/Literals')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.be.an.array;
        var rangeUnderflow = result.find(function (item) {
          return item.key === 'rangeUnderflow';
        });
        expect(rangeUnderflow.placeholders).to.be.ok;
        expect(rangeUnderflow.placeholders).to.have.keys(['field', 'min']);
        expect(rangeUnderflow.placeholders.field).to.deep.equal({
          content: '$1'
        });
        expect(rangeUnderflow.placeholders.min).to.deep.equal({
          content: '$2'
        });
        done();
      });
  });

  it('render returns data as object', function (done) {
    api.get(bootstrap.basePath + '/Literals/render/en-US')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.not.be.an.array;
        expect(result).to.have.keys(['Auth Scheme', 'rangeUnderflow', 'rangeOverflow', 'valueMissing']);
        done();
      });
  });

  it('render ignores the .json extension', function (done) {
    api.get(bootstrap.basePath + '/Literals/render/en-US.json')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.not.be.an.array;
        expect(result).to.have.keys(['Auth Scheme', 'rangeUnderflow', 'rangeOverflow', 'valueMissing']);
        done();
      });
  });

  it('Default locale is returned when locale specific data not present', function (done) {
    api.get(bootstrap.basePath + '/Literals/render/en-IN')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.not.be.an.array;
        expect(result).to.have.keys(['Auth Scheme', 'rangeUnderflow', 'rangeOverflow']);
        expect(result.rangeOverflow.locale).to.equal('*');
        expect(result.rangeOverflow.message).to.equal('Must be max $max$ characters');
        done();
      });
  });

  it('Locale data overrides the defaults', function (done) {
    api.get(bootstrap.basePath + '/Literals/render/en-US')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.not.be.an.array;
        expect(result.rangeOverflow).to.be.ok;
        expect(result.rangeOverflow.locale).to.equal('en-US');
        expect(result.rangeOverflow.message).to.equal('Value should be $max$ characters long');
        done();
      });
  });

  it('Group specific Locale data can be fetched', function (done) {
    api.get(bootstrap.basePath + '/Literals/render/en-US?group=testgroup')
      .set('Accept', 'application/json')
      .expect(200).end(function (err, resp) {
        if (err) {
          return done(err);
        }
        var result = resp.body;
        expect(result).to.not.be.an.array;
        expect(result.rangeOverflow).to.be.ok;
        expect(result.valueMissing).to.be.ok;
        expect(result.rangeUnderflow).to.not.be.ok;
        expect(result['Auth Scheme']).to.not.be.ok;
        done();
      });
  });

  after('clean up', function (done) {
    bootstrap.deleteAll(models.Literal, function (err, d) {
      if (err) {
        console.log('Error - not able to delete literals ', err, d);
      }
      done();
    });
  });
});
