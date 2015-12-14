var expect = require('chai').expect,
    fixture = require('broccoli-fixture');

var GlobalExportWriter = require('../dist/index');

describe('GlobalExportWriter', function() {
  it('exists', function() {
    expect(GlobalExportWriter).to.be.a('function');
  });

  describe('construction', function() {
    it('can be constructed without the `new` keyword', function() {
      var node = new fixture.Node({
        'foo.js': 'function Foo() {}'
      });

      expect(GlobalExportWriter(node, 'foo.js', {
        defaultExport: 'Foo'
      })).to.be.an.instanceof(GlobalExportWriter);
    });

    it('throws an error when either defaultExport or exports is not passed', function() {
      var node = new fixture.Node({
        'foo.js': 'function Foo() {}'
      });

      expect(function() {
        new GlobalExportWriter(node, 'foo.js');
      }).to.throw(Error);
    });

    it('throws an error when a list of nodes is passed', function() {
      expect(function() {
        new GlobalExportWriter([new fixture.Node()], 'foo.js', {
          defaultExport: 'Foo'
        });
      }).to.throw(TypeError);
    });
  });

  it('adds default exports to the input file', function(done) {
    var files,
        node;

    files = {
      'foo.js': 'function Foo() {}'
    };

    node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo'
    });

    fixture.build(node).then(function(fixture) {
      expect(fixture).to.deep.equal({
        'foo.js': 'function Foo() {};\nexport default Foo;'
      });
    }).then(done);
  });

  it('adds named exports to the input file', function(done) {
    var files,
        node;

    files = {
      'foo.js': 'function Foo() {}'
    };

    node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      exports: ['Foo']
    });

    fixture.build(node).then(function(fixture) {
      expect(fixture).to.deep.equal({
        'foo.js': 'function Foo() {};\nexport Foo;'
      });
    }).then(done);
  });

  it('adds default and named exports to the input file', function(done) {
    var files,
        node;

    files = {
      'foo.js': 'function Foo() {};\nvar bar = {};'
    };

    node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo',
      exports: ['bar']
    });

    fixture.build(node).then(function(fixture) {
      expect(fixture).to.deep.equal({
        'foo.js': 'function Foo() {};\nvar bar = {};\nexport bar;\nexport default Foo;'
      });
    }).then(done);
  });

  describe('transpiling', function(done) {
    it('transpiles modules to common if specified as moduleType', function() {
      var files,
          node;

      files = {
        'foo.js': 'function Foo() {}'
      };

      node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
        defaultExport: 'Foo',
        moduleType: 'common'
      });

      fixture.build(node).then(function(fixture) {
        var output = fixture['foo.js'];
        expect(output)
          .to.be.a('string')
          .that.contains('module.exports = Foo')
          .and.not.contains('export default Foo');
      }).then(done);
    });

    it('transpiles modules to amd if specified as moduleType', function() {
      var files,
          node;

      files = {
        'foo.js': 'function Foo() {}'
      };

      node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
        defaultExport: 'Foo',
        moduleType: 'amd'
      });

      fixture.build(node).then(function(fixture) {
        var output = fixture['foo.js'];
        expect(output)
          .to.be.a('string')
          .that.startsWith('define(')
          .and.not.contains('export default Foo');
      }).then(done);
    });
  });
});
