import { expect } from 'chai';
import fixture from 'broccoli-fixture';

import { GlobalExportWriter, MultiGlobalExportWriter } from '../src/global-export-writer';

describe('GlobalExportWriter', function() {
  it('exists', function() {
    expect(GlobalExportWriter).to.be.a('function');
  });

  describe('construction', function() {
    it('throws an error when either defaultExport or exports is not passed', function() {
      var inputTree = new fixture.Node({
        'foo.js': 'function Foo() {}'
      });

      expect(function() {
        new GlobalExportWriter(inputTree, 'foo.js');
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
        inputTree;

    files = {
      'foo.js': 'function Foo() {}'
    };

    inputTree = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo'
    });

    fixture.build(inputTree).then(function(outputTree) {
      expect(outputTree).to.deep.equal({
        'foo.js': 'function Foo() {};\nexport default Foo;'
      });
      done();
    }, done);
  });

  it('adds named exports to the input file', function(done) {
    var files,
        inputTree;

    files = {
      'foo.js': 'function Foo() {}'
    };

    inputTree = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      exports: ['Foo']
    });

    fixture.build(inputTree).then(function(outputTree) {
      expect(outputTree).to.deep.equal({
        'foo.js': 'function Foo() {};\nexport Foo;'
      });
      done();
    }, done);
  });

  it('adds default and named exports to the input file', function(done) {
    var files,
        inputTree;

    files = {
      'foo.js': 'function Foo() {};\nvar bar = {};'
    };

    inputTree = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo',
      exports: ['bar']
    });

    fixture.build(inputTree).then(function(outputTree) {
      expect(outputTree).to.deep.equal({
        'foo.js': 'function Foo() {};\nvar bar = {};\nexport bar;\nexport default Foo;'
      });
      done();
    }, done);
  });

  it('adds CommonJS exports', function(done) {
    var files,
        inputTree;

    files = {
      'foo.js': 'function Foo() {};\nvar bar = {};'
    };

    inputTree = new GlobalExportWriter(new fixture.Node(files), 'foo.js', {
      defaultExport: 'Foo',
      exports: ['bar'],
      moduleType: 'cjs'
    });

    fixture.build(inputTree).then(function(outputTree) {
      var foo = outputTree['foo.js'];
      expect(foo).to.contain('exports[\'default\'] = Foo');
      expect(foo).to.contain('exports.bar = bar');
      done();
    }, done);
  });
});

describe('MultiGlobalExportWriter', () => {
  it('exists', () => expect(MultiGlobalExportWriter).to.be.a('function'));

  describe('construction', () => {
    it('can be constructed without options arguments', () => {
      const inputTree = new fixture.Node({
        'foo.js': 'function Foo() {}'
      });

      expect(() => new MultiGlobalExportWriter(inputTree, {
        'foo.js': {
          defaultExport: 'Foo'
        }
      })).to.not.throw(Error);
    });

    it('throws an error when constructed with a list of input nodes', () => {
      const nodes = [
        { 'foo.js': 'function Foo() {}' },
        { 'bar.js': 'function Bar() {}' }
      ].map(files => new fixture.Node(files));

      expect(() => new MultiGlobalExportWriter(nodes, {
        'foo.js': {
          defaultExport: 'Foo'
        }
      })).to.throw(Error);
    });

    it('sets moduleType property from options object', () => {
      const inputTree = new fixture.Node({
        'foo.js': 'function Foo() {}'
      });

      const writer = new MultiGlobalExportWriter(inputTree, {
        'foo.js': {
          defaultExport: 'Foo'
        }
      }, {
        moduleType: 'cjs'
      });

      expect(writer)
        .to.have.property('moduleType')
        .that.is.a('string')
        .that.equals('cjs');
    });
  });

  describe('build', () => {
    it('transforms the input file', done => {
      const tree = new MultiGlobalExportWriter(new fixture.Node({
        'foo.js': 'function Foo() {}',
        'bar': {
          'baz.js': 'var baz = 1;'
        }
      }), {
        'foo.js': {
          defaultExport: 'Foo'
        },
        'bar/baz.js': {
          defaultExport: 'baz'
        }
      });

      fixture.build(tree).then(outputTree => {
        expect(outputTree)
          .to.have.property('foo.js')
          .that.equals('function Foo() {};\nexport default Foo;');

        expect(outputTree)
          .to.have.property('bar')
          .that.is.an('object')
          .that.has.property('baz.js')
          .that.equals('var baz = 1;\nexport default baz;');
        done();
      }, done);
    });

    it('does nothing if the file does not exist', done => {
      const tree = new MultiGlobalExportWriter(new fixture.Node(), {
        'foo.js': {
          defaultExport: 'Foo'
        }
      });

      fixture.build(tree).then(outputTree => {
        expect(outputTree).to.not.have.property('foo.js');
        done();
      }, done);
    });
  });
});
