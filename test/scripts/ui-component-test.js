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
var api = bootstrap.api;

describe(chalk.blue('UIElement'), function() {
  var metadataCache = {};

  function fetchComponent(componentName, callback) {
    models.UIComponent.component(componentName, null, bootstrap.defaultContext, function(err, data) {
      if (err) return callback(err);

      var start = data.indexOf('<script>');
      var end = data.indexOf('</script>');
      var metaString = data.substr(start + 8, end - start - 8);
      metaString = metaString.replace('window.OEUtils ||', '');
      eval(metaString);

      metadataCache = Object.assign(metadataCache, OEUtils.metadataCache);

      callback(err, metadataCache[componentName]);
    });
  }

  function simulateComponent(component, callback) {
    models.UIComponent.simulate(component, null, bootstrap.defaultContext, function(err, data) {
      if (err) return callback(err);

      var start = data.indexOf('<script>');
      var end = data.indexOf('</script>');
      var metaString = data.substr(start + 8, end - start - 8);
      var htmlPart = data.substr(end + 9).trim();
      metaString = metaString.replace('window.OEUtils ||', '');
      eval(metaString);
      callback(err, OEUtils.metadataCache[component.name], htmlPart);
    });
  }

  var elementsData = [{
    component: 'person-form',
    field: 'firstName',
    attributes: [{
      name: 'minlength',
      value: 2
    }]
  }];

  var componentData = [{
    name: 'order-form',
    modelName: 'Order'
  }];

  before('setup data', function(done) {
    bootstrap.deleteAndCreate(models.UIElement, elementsData, function(err1) {
      bootstrap.deleteAndCreate(models.UIComponent, componentData, function(err2) {
        done(err1 || err2);
      });
    });
  });
  after('cleanup data', function(done) {
    bootstrap.deleteAll(models.UIComponent, function(err) {
      bootstrap.deleteAll(models.UIElement, done);
    });
  });

  it('fetch using modelmeta method', function(done) {
    var UIComponent = models.UIComponent;
    UIComponent.modelmeta('person', null, bootstrap.defaultContext, function(err, data) {
      expect(data).to.exist;
      expect(data.componentName).to.equal('person');
      expect(data.modelName).to.equal('Person');
      done();
    });
  });

  it('returns error if model is not found', function(done) {
    fetchComponent('missingmodel-form', function(err, data) {
      expect(err).to.exist;
      expect(data).to.not.exist;
      expect(err.code).to.equal('MODEL_NOT_FOUND');
      done();
    });
  });

  it('returns error if form-template is not provided', function(done) {
    fetchComponent('person-', function(err, data) {
      expect(err).to.exist;
      expect(data).to.not.exist;
      expect(err.code).to.equal('TEMPLATE_TYPE_UNDEFINED');
      done();
    });
  });

  it('returns error if form-template is not found', function(done) {
    this.timeout(4000);
    fetchComponent('person-missing', function(err, data) {
      expect(err).to.exist;
      expect(data).to.not.exist;
      expect(err.code).to.equal('TEMPLATE_TYPE_MISSING');
      done();
    });
  });

  it('glob searches the template, when not found in configured paths', function(done) {
    this.timeout(4000);
    fetchComponent('person-tpl', function(err, metadata) {
      expect(metadata).to.exist;
      expect(metadata.componentName).to.equal('person-tpl');
      expect(metadata.modelName).to.equal('Person');
      expect(metadata.metadata).to.exist;
      done();
    });
  });

  it('loads default form template', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata).to.exist;
      expect(metadata.componentName).to.equal('person-form');
      expect(metadata.modelName).to.equal('Person');
      expect(metadata.metadata).to.exist;
      done();
    });
  });

  it('default form has model definition', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.models).to.be.an('object');
      expect(metadata.metadata.models.Person).to.exist;
      done();
    });
  });

  it('default form metadata has properties', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties).to.not.have.property('id')
      expect(Object.keys(metadata.metadata.properties)).to.include.members(Object.keys(models.Person.definition.properties).filter(function(v) {
        return v !== 'id' && models.Person.settings.hidden.indexOf(v) > 0;
      }));
      done();
    });
  });

  it('default form loads element definitions', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.elements).to.be.an('object');
      expect(metadata.elements.firstName).to.be.an('object').and.have.property('minlength');
      done();
    });
  });

  it('belongsTo relashionship reflects in properties as typeahead', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.departmentId).to.exist;
      expect(metadata.metadata.properties.departmentId.type).to.equal('typeahead');
      expect(metadata.metadata.properties.departmentId.valueproperty).to.exist;
      expect(metadata.metadata.properties.departmentId.displayproperty).to.exist;
      expect(metadata.metadata.properties.departmentId.searchurl).to.exist;
      done();
    });
  });

  it('embedsMany relashionship reflects in properties as grid', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties['_addresses']).to.exist;
      expect(metadata.metadata.properties['_addresses'].type).to.equal('grid');
      done();
    });
  });

  it('Array of primitive property reflects as tags', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.qualifications).to.exist;
      expect(metadata.metadata.properties.qualifications.type).to.equal('tags');
      expect(metadata.metadata.properties.qualifications.itemtype).to.equal('string');
      done();
    });
  });

  it('Array of composite property reflects in properties as grid', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.languages).to.be.ok;
      expect(metadata.metadata.properties.languages.type).to.equal('grid');
      expect(metadata.metadata.properties.languages.itemtype).to.equal('model');
      expect(metadata.metadata.properties.languages.modeltype).to.equal('Literal');
      expect(metadata.metadata.properties.languages.subModelMeta).to.be.ok;
      done();
    });
  });


  it('hasOne reflects in properties type as model', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.permanentAddress).to.be.ok;
      expect(metadata.metadata.properties.permanentAddress.type).to.equal('model');
      expect(metadata.metadata.properties.permanentAddress.modeltype).to.equal('Address');
      done();
    });
  });

  it('Composite property reflects properties type as model', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.shippingAddress).to.be.ok;
      expect(metadata.metadata.properties.shippingAddress.type).to.equal('model');
      expect(metadata.metadata.properties.shippingAddress.modeltype).to.equal('Address');
      done();
    });
  });

  it('Validations are populated', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.firstName).to.be.ok;
      expect(metadata.metadata.properties.firstName.required).to.equal(true);
      expect(metadata.metadata.properties.profession).to.be.ok;
      expect(metadata.metadata.properties.profession.max).to.equal(35);
      done();
    });
  });

  it('Validate when validations are ignored', function(done) {
    fetchComponent('person-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties.gender).to.be.ok;
      expect(metadata.metadata.properties.gender.required).to.not.exist;
      done();
    });
  });

  it('default list has gridConfig with all required fields as columns', function(done) {
    fetchComponent('person-list', function(err, metadata) {
      expect(metadata.gridConfig).to.be.an('object');
      expect(metadata.gridConfig.modelGrid).to.be.an('array').and.include.members(['firstName', 'gender']);
      done();
    });
  });

  it('simulate method returns the component definition', function(done) {
    var component = {
      name: 'salutation-form',
      modelName: 'Salutation'
    };
    simulateComponent(component, function(err, data) {
      expect(data.componentName).to.equal(component.name);
      expect(data.modelName).to.equal(component.modelName);
      expect(data.metadata.properties).to.be.an('object').and.have.keys('code', 'description');
      done();
    });
  });

  it('When template is not defined, content is returned as html', function(done) {
    var component = {
      name: 'salutation-form',
      modelName: 'Salutation',
      content: '<div>Dummy</div>'
    };
    simulateComponent(component, function(err, data, htmlPart) {
      expect(htmlPart).to.equal(component.content);
      done();
    });
  });

  it('When template is defined, content is returned as response.content', function(done) {
    var component = {
      name: 'salutation-form',
      templateName: 'default-form.html',
      modelName: 'Salutation',
      content: '<div>Dummy</div>'
    };
    simulateComponent(component, function(err, data, htmlPart) {
      expect(data.content).to.equal(component.content);
      done();
    });
  });

  it('When filePath is defined, its content are returned as html', function(done) {
    var component = {
      name: 'sample-element',
      filePath: 'test/client/templates/sample-element.html'
    };
    simulateComponent(component, function(err, data, htmlPart) {
      expect(htmlPart.indexOf('<dom-module id="sample-element">')).to.equal(0);
      done();
    });
  });

  it('When templateName is defined, its content are returned as html', function(done) {
    var component = {
      name: 'sample-element',
      templateName: 'sample-element.html'
    };
    simulateComponent(component, function(err, data, htmlPart) {
      expect(htmlPart.indexOf('<dom-module id="sample-element">')).to.equal(0);
      done();
    });
  });

  it('importUrls are added as link tags', function(done) {
    var component = {
      name: 'salutation-form',
      templateName: 'default-form.html',
      importUrls: ['link1.html', 'link2.html']
    };
    simulateComponent(component, function(err, data, htmlPart) {
      expect(htmlPart.indexOf('<link rel="import"')).to.equal(0);
      done();
    });
  });

  it('configure creates the UIComponent for form and list templates', function(done) {
    models.UIComponent.configure('Salutation,Designation', null, /*Delebrate no-options - bootstrap.defaultContext,*/ function(err, results) {
      expect(results).to.be.an('array');
      expect(results.length).to.equal(4);
      var components = results.map(function(v) {
        return v.name;
      });
      expect(components).to.have.members(['salutation-form', 'salutation-list', 'designation-form', 'designation-list']);
      done(err);
    });
  });

  it('configure for * creates the form and list components for all public models', function(done) {
    models.UIComponent.configure('*', bootstrap.defaultContext, function(err, results) {
      expect(results).to.be.an('array');
      var components = results.map(function(v) {
        return v.name;
      });
      expect(components).to.include.members(['person-form', 'person-list']);
      done(err);
    });
  });

  it('Invalid references are ignored', function(done) {
    fetchComponent('invalidrefs-form', function(err, metadata) {
      expect(metadata.metadata.properties).to.be.an('object');
      expect(metadata.metadata.properties).to.have.property('invalidEnum');
      expect(metadata.metadata.properties.invalidEnum.listdata).to.not.exist;
      expect(metadata.metadata.properties).to.have.property('invalidRefCode')
      expect(metadata.metadata.properties.invalidRefCode.listdata).to.not.exist;
      done();
    });
  });


  it('Content-Type is set correctly on /component response', function(done) {
    api.get(bootstrap.basePath + '/UIComponents/component/order-form?flatten=true&dependencies=true&skipSystemFields=false')
      .expect(200).end(function(err, resp) {
        if (err) {
          return done(err);
        }
        expect(resp.headers['content-type']).to.equal('text/html');
        expect(resp.text).to.be.a('string').and.include('order-form');
        done();
      });
  });

  it('Content-Type is set correctly on /simulate response', function(done) {
    api.post(bootstrap.basePath + '/UIComponents/simulate?flatten=true&dependencies=true&skipSystemFields=false')
    .send({
      name: 'salutation-form',
      modelName: 'Salutation'
    })
    .expect(200).end(function(err, resp) {
        if (err) {
          return done(err);
        }
        expect(resp.headers['content-type']).to.equal('text/html');
        expect(resp.text).to.be.a('string').and.include('salutation-form');
        done();
      });
  });

});