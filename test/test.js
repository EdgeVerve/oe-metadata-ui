var oecloud = require('oe-cloud');
var loopback = require('loopback');

oecloud.observe('loaded', function (ctx, next) {
  console.log('oe-cloud modules loaded');
  return next();
});

oecloud.boot(__dirname, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  oecloud.start();
  oecloud.emit('test-start');
});


var chalk = require('chalk');
var chai = require('chai');
var async = require('async');
chai.use(require('chai-things'));

var expect = chai.expect;

var app = oecloud;
var defaults = require('superagent-defaults');
var supertest = require('supertest');
var api = defaults(supertest(app));
var basePath = app.get('restApiRoot');

var defaultContext = {};

function deleteAll(model, callback) {
  model.destroyAll({}, {}, function (err) {
    return callback(err);
  });
}

function createAll(model, items, callback) {
  async.forEachOf(items,
    function (item, m, callback2) {
      model.create(item, defaultContext, function (err, data) {
        callback2(err, data);
      });
    },
    function (err) {
      return callback(err);
    });
}

function deleteAndCreate(model, items, callback) {
  deleteAll(model, function (err) {
    if (err) {
      callback(err);
    } else {
      createAll(model, items, callback);
    }
  });
}

describe(chalk.blue('SkeletonTest Started'), function (done) {
  this.timeout(10000);
  before('wait for boot scripts to complete', function (done) {
    app.on('test-start', function () {
      deleteAll(loopback.findModel('User'), function (err) {
        return done(err);
      });
    });
  });

  afterEach('destroy context', function (done) {
    done();
  });

  it('t1 create user admin/admin with /default tenant', function (done) {
    var url = basePath + '/users';
    api.set('Accept', 'application/json')
      .post(url)
      .send([{
        username: 'admin',
        password: 'admin',
        email: 'admin@admin.com'
      },
      {
        username: 'evuser',
        password: 'evuser',
        email: 'evuser@evuser.com'
      },
      {
        username: 'infyuser',
        password: 'infyuser',
        email: 'infyuser@infyuser.com'
      },
      {
        username: 'bpouser',
        password: 'bpouser',
        email: 'infyuser@infyuser.com'
      }
      ])
      .end(function (err, response) {
        var result = response.body;
        expect(result[0].id).to.be.defined;
        expect(result[1].id).to.be.defined;
        expect(result[2].id).to.be.defined;
        expect(result[3].id).to.be.defined;
        done();
      });
  });

  var adminToken;
  it('t2 Login with admin credentials', function (done) {
    var url = basePath + '/users/login';
    api.set('Accept', 'application/json')
      .post(url)
      .send({
        username: 'admin',
        password: 'admin'
      })
      .end(function (err, response) {
        var result = response.body;
        adminToken = result.id;
        expect(adminToken).to.be.defined;
        done();
      });
  });


  var infyToken;
  it('t3 Login with infy credentials', function (done) {
    var url = basePath + '/users/login';
    api.set('Accept', 'application/json')
      .post(url)
      .send({
        username: 'infyuser',
        password: 'infyuser'
      })
      .end(function (err, response) {
        var result = response.body;
        infyToken = result.id;
        expect(infyToken).to.be.defined;
        done();
      });
  });

  var evToken;
  it('t4 Login with ev credentials', function (done) {
    var url = basePath + '/users/login';
    api.set('Accept', 'application/json')
      .post(url)
      .send({
        username: 'evuser',
        password: 'evuser'
      })
      .end(function (err, response) {
        var result = response.body;
        evToken = result.id;
        expect(evToken).to.be.defined;
        done();
      });
  });


  var bpoToken;
  it('t5 Login with bpo credentials', function (done) {
    var url = basePath + '/users/login';
    api.set('Accept', 'application/json')
      .post(url)
      .send({
        username: 'bpouser',
        password: 'bpouser'
      })
      .end(function (err, response) {
        var result = response.body;
        bpoToken = result.id;
        expect(bpoToken).to.be.defined;
        done();
      });
  });
});

module.exports = {
  app: oecloud,
  loopback: loopback,
  chai: chai,
  chalk: chalk,
  api: api,
  basePath: basePath,
  defaultContext: defaultContext,
  deleteAndCreate: deleteAndCreate,
  createAl: createAll,
  deleteAll: deleteAll
};
