var expect = require('chai').expect,
    fixture = require('broccoli-fixture');

var GlobalExportWriter = require('../index');

describe('GlobalExportWriter', function() {
  it('exists', function() {
    expect(GlobalExportWriter).to.be.a('function');
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
});
