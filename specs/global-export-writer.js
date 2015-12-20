import { expect } from 'chai';
import fixture from 'broccoli-fixture';

import GlobalExportWriter from '../src/global-export-writer';

describe('GlobalExportWriter', function() {
  it('exists', function() {
    expect(GlobalExportWriter).to.be.a('function');
  });

  describe('construction', function() {
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

  it('adds CommonJS exports', function(done) {
    var files,
        node;

    files = {
      'foo.js': 'function Foo() {};\nvar bar = {};'
    };

    node = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo',
      exports: ['bar'],
      moduleType: 'cjs'
    });

    fixture.build(node).then(function(fixture) {
      var foo = fixture['foo.js'];
      expect(foo).to.contain('exports[\'default\'] = Foo');
      expect(foo).to.contain('exports.bar = bar');
    }).then(done);
  });
});
